import { fail, redirect } from '@sveltejs/kit';
import { createPoll } from '$lib/server/polls';
import { hashPassword, rememberOwner } from '$lib/server/edit-access';
import type { Actions } from './$types';

export const actions: Actions = {
	create: async ({ request, cookies }) => {
		const form = await request.formData();
		const name = String(form.get('name') ?? '').trim();
		if (!name || name.length > 100) return fail(400, { name, error: 'Give your poll a title under 100 characters.' });
		const mode = String(form.get('edit_mode') ?? 'password');
		const password = String(form.get('password') ?? '');
		if (!['password', 'public'].includes(mode)) return fail(400, { name, error: 'Choose who can edit this poll.' });
		if (mode === 'password' && (password.length < 8 || password.length > 128)) return fail(400, { name, error: 'Use an edit password between 8 and 128 characters.' });
		const poll = await createPoll(name.toUpperCase(), mode === 'public', mode === 'password' ? hashPassword(password) : null);
		rememberOwner(cookies, poll.id, poll.editKey);
		throw redirect(303, `/${poll.id}/edit?k=${poll.editKey}`);
	}
};
