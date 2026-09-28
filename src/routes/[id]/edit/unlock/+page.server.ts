import { error, fail, redirect } from '@sveltejs/kit';
import { editorAccess, rememberPassword, verifyPassword } from '$lib/server/edit-access';
import { getPoll } from '$lib/server/polls';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const auth = await editorAccess(params.id, '', cookies);
	if (auth.canEdit) redirect(303, `/${params.id}/edit`);
	const poll = await getPoll(params.id);
	if (!poll) error(404, 'Poll not found');
	return { pollId: params.id, pollName: poll.name, hasPassword: Boolean(auth.access.passwordHash) };
};

export const actions: Actions = {
	default: async ({ request, params, cookies }) => {
		const auth = await editorAccess(params.id, '', cookies);
		if (auth.canEdit) redirect(303, `/${params.id}/edit`);
		const password = String((await request.formData()).get('password') ?? '');
		if (!auth.access.passwordHash || !password || password.length > 128 || !verifyPassword(password, auth.access.passwordHash)) {
			return fail(400, { error: 'That password did not match.' });
		}
		rememberPassword(cookies, params.id, auth.access);
		redirect(303, `/${params.id}/edit`);
	}
};
