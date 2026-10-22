import { error, fail } from '@sveltejs/kit';
import { editorAccess } from '$lib/server/edit-access';
import { randomUUID } from 'node:crypto';
import { getPoll, getVoterVotes, recordVote, removeVote, resetVotes, setVoterName, getVoterName, getNamedVotes } from '$lib/server/polls';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies }) => {
	if (!/^[0-9a-f-]{36}$/i.test(params.id)) error(404, 'Poll not found');
	const poll = await getPoll(params.id);
	if (!poll) error(404, 'Poll not found');
	const voterId = cookies.get('pollish-voter');
	const votes = voterId && /^[0-9a-f-]{36}$/i.test(voterId) ? await getVoterVotes(params.id, voterId) : {};
	const auth = await editorAccess(params.id, '', cookies);
	const [voterName, namedVotes] = await Promise.all([voterId && /^[0-9a-f-]{36}$/i.test(voterId) ? getVoterName(params.id, voterId) : '', getNamedVotes(params.id)]);
	return { poll, votes, voterName, namedVotes, isOwner: auth.owner, canEdit: auth.canEdit, editMode: auth.access.publicEdit ? 'public' : auth.access.passwordHash ? 'password' : 'private' };
};

export const actions: Actions = {
    name: async ({ request, params, cookies }) => {
        if (!/^[0-9a-f-]{36}$/i.test(params.id) || !await getPoll(params.id)) return fail(404, { error: 'This poll is no longer available.' });
        const name = String((await request.formData()).get('name') ?? '').trim();
        if (name.length > 40) return fail(400, { error: 'Keep your name to 40 characters or fewer.' });
        const storedVoter = cookies.get('pollish-voter');
        const voterId = storedVoter && /^[0-9a-f-]{36}$/i.test(storedVoter) ? storedVoter : randomUUID();
        await setVoterName(params.id, voterId, name);
        cookies.set('pollish-voter', voterId, { path: '/', httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 365 });
        return { nameSaved: true };
    },
    reset: async ({ params, cookies }) => {
        if (!/^[0-9a-f-]{36}$/i.test(params.id) || !await getPoll(params.id)) return fail(404, { error: 'This poll is no longer available.' });
        const voterId = cookies.get('pollish-voter');
        if (voterId && /^[0-9a-f-]{36}$/i.test(voterId)) await resetVotes(params.id, voterId);
        return { reset: true };
    },
	vote: async ({ request, params, cookies }) => {
		const form = await request.formData();
		const cardId = String(form.get('card_id') ?? '');
		const choice = String(form.get('choice') ?? '');
		if (!/^[0-9a-f-]{36}$/i.test(cardId) || !['yes', 'no', 'remove'].includes(choice)) return fail(400, { voteError: 'That vote could not be saved.' });
		const poll = await getPoll(params.id);
		if (!poll || !poll.cards.some((card) => card.id === cardId)) return fail(404, { voteError: 'This choice was removed. Refresh the poll to see the latest choices.' });
		const storedVoter = cookies.get('pollish-voter');
		const voterId = storedVoter && /^[0-9a-f-]{36}$/i.test(storedVoter) ? storedVoter : randomUUID();
		cookies.set('pollish-voter', voterId, { path: '/', httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 365 });
		if (choice === 'remove') await removeVote(cardId, voterId);
		else await recordVote(cardId, voterId, choice as 'yes' | 'no');
		return { voted: cardId };
	}
};
