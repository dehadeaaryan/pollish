import { error, fail } from '@sveltejs/kit';
import { randomUUID } from 'node:crypto';
import { getPoll, getVoterVotes, recordVote } from '$lib/server/polls';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies }) => {
	if (!/^[0-9a-f-]{36}$/i.test(params.id)) error(404, 'Poll not found');
	const poll = await getPoll(params.id);
	if (!poll) error(404, 'Poll not found');
	const voterId = cookies.get('pollish-voter');
	const votes = voterId && /^[0-9a-f-]{36}$/i.test(voterId) ? await getVoterVotes(params.id, voterId) : {};
	return { poll, votes };
};

export const actions: Actions = {
	vote: async ({ request, params, cookies }) => {
		const form = await request.formData();
		const cardId = String(form.get('card_id') ?? '');
		const choice = String(form.get('choice') ?? '');
		if (!/^[0-9a-f-]{36}$/i.test(cardId) || !['yes', 'no'].includes(choice)) return fail(400, { voteError: 'That vote could not be saved.' });
		const poll = await getPoll(params.id);
		if (!poll || !poll.cards.some((card) => card.id === cardId)) error(404, 'Poll option not found');
		const voterId = cookies.get('pollish-voter') ?? randomUUID();
		cookies.set('pollish-voter', voterId, { path: '/', httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 365 });
		await recordVote(cardId, voterId, choice as 'yes' | 'no');
		return { voted: cardId };
	}
};
