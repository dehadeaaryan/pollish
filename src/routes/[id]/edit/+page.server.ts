import { error, fail, redirect } from '@sveltejs/kit';
import { getPoll, updatePollName, addPollCard, removePollCard, setPollBackground, setPollBackgroundColor, removePoll, setPollAccess } from '$lib/server/polls';
import { editorAccess, hashPassword, rememberOwner, requireEditor, requireOwner, validUuid } from '$lib/server/edit-access';
import { deleteImage, saveImage } from '$lib/server/uploads';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url, cookies }) => {
	const key = url.searchParams.get('k') ?? '';
	const auth = await editorAccess(params.id, key, cookies);
	if (!auth.canEdit) redirect(303, `/${params.id}/edit/unlock`);
	if (auth.owner && key) rememberOwner(cookies, params.id, key);
	const poll = await getPoll(params.id);
	if (!poll) error(404, 'Poll not found');
	const editMode: 'public' | 'password' | 'private' = auth.access.publicEdit ? 'public' : auth.access.passwordHash ? 'password' : 'private';
	return { poll, editKey: auth.owner ? auth.access.editKey : '', isOwner: auth.owner, editMode, hasPassword: Boolean(auth.access.passwordHash) };
};

export const actions: Actions = {
	update: async ({ request, params, cookies }) => {
		const form = await request.formData();
		const key = String(form.get('key') ?? '');
		await requireEditor(params.id, key, cookies);
		const name = String(form.get('name') ?? '').trim();
		if (!name || name.length > 100) return fail(400, { error: 'Use a title between 1 and 100 characters.' });
		await updatePollName(params.id, name.toUpperCase());
		return { updated: true };
	},
	addCard: async ({ request, params, cookies }) => {
		const form = await request.formData();
		await requireEditor(params.id, String(form.get('key') ?? ''), cookies);
		const title = String(form.get('title') ?? '').trim();
		const description = String(form.get('description') ?? '').trim();
		if (!title || title.length > 120 || description.length > 280) return fail(400, { error: 'Add a choice title up to 120 characters and a note under 280.' });
		const entry = form.get('image');
		let imagePath: string | null = null;
		try {
			if (entry instanceof File && entry.size > 0) imagePath = await saveImage(entry);
			await addPollCard(params.id, title, description, imagePath);
		} catch (cause) {
			await deleteImage(imagePath);
			return fail(400, { error: cause instanceof Error ? cause.message : 'Could not add that choice.' });
		}
		return { added: true };
	},
	removeCard: async ({ request, params, cookies }) => {
		const form = await request.formData();
		await requireEditor(params.id, String(form.get('key') ?? ''), cookies);
		const cardId = String(form.get('card_id') ?? '');
		if (!validUuid(cardId)) return fail(400, { error: 'That choice could not be removed.' });
		await deleteImage(await removePollCard(params.id, cardId));
		return { removed: true };
	},
	background: async ({ request, params, cookies }) => {
		const form = await request.formData();
		await requireEditor(params.id, String(form.get('key') ?? ''), cookies);
		const entry = form.get('image');
		if (!(entry instanceof File) || entry.size === 0) return fail(400, { error: 'Choose an image first.' });
		let imagePath: string | null = null;
		try {
			imagePath = await saveImage(entry);
			const previous = await setPollBackground(params.id, imagePath);
			await deleteImage(previous);
		} catch (cause) {
			await deleteImage(imagePath);
			return fail(400, { error: cause instanceof Error ? cause.message : 'Could not save that background.' });
		}
		return { backgroundSaved: true };
	},
	backgroundColor: async ({ request, params, cookies }) => {
		const form = await request.formData();
		await requireEditor(params.id, String(form.get('key') ?? ''), cookies);
		const color = String(form.get('color') ?? '').trim();
		if (!/^#[0-9a-fA-F]{6}$/.test(color)) return fail(400, { error: 'Choose a valid background color.' });
		await deleteImage(await setPollBackgroundColor(params.id, color.toLowerCase()));
		return { backgroundSaved: true };
	},
	removeBackground: async ({ request, params, cookies }) => {
		const form = await request.formData();
		await requireEditor(params.id, String(form.get('key') ?? ''), cookies);
		await deleteImage(await setPollBackground(params.id, null));
		return { backgroundRemoved: true };
	},
	access: async ({ request, params, cookies }) => {
		const form = await request.formData();
		const key = String(form.get('key') ?? '');
		const { access } = await requireOwner(params.id, key, cookies);
		const mode = String(form.get('edit_mode') ?? '');
		const password = String(form.get('password') ?? '');
		if (!['private', 'password', 'public'].includes(mode)) return fail(400, { error: 'Choose an editing mode.' });
		if (password && (password.length < 8 || password.length > 128)) return fail(400, { error: 'Use a password between 8 and 128 characters.' });
		if (mode === 'password' && !password && !access.passwordHash) return fail(400, { error: 'Add a password to enable protected editing.' });
		await setPollAccess(params.id, mode === 'public', mode === 'password' ? (password ? hashPassword(password) : access.passwordHash) : null);
		return { accessSaved: true };
	},
	deletePoll: async ({ request, params, cookies }) => {
		const form = await request.formData();
		await requireOwner(params.id, String(form.get('key') ?? ''), cookies);
		const files = await removePoll(params.id);
		await Promise.all([...files.cards, files.background ?? ''].map(deleteImage));
		throw redirect(303, '/');
	}
};
