import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { error } from '@sveltejs/kit';
import { getPollAccess } from './polls';
import type { Cookies } from '@sveltejs/kit';

export const validUuid = (value: string) => /^[0-9a-f-]{36}$/i.test(value);
const ownerCookie = (id: string) => `pollish-owner-${id}`;
const passwordCookie = (id: string) => `pollish-password-${id}`;
const cookieOptions = { path: '/', httpOnly: true, sameSite: 'lax' as const, secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 365 };

type Access = NonNullable<Awaited<ReturnType<typeof getPollAccess>>>;

function equal(a: string, b: string) {
	const left = Buffer.from(a);
	const right = Buffer.from(b);
	return left.length === right.length && timingSafeEqual(left, right);
}

export function hashPassword(password: string) {
	const salt = randomBytes(16).toString('hex');
	return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
}

export function verifyPassword(password: string, stored: string) {
	const [salt, digest] = stored.split(':');
	if (!salt || !digest || !/^[0-9a-f]{32}$/.test(salt) || !/^[0-9a-f]{128}$/.test(digest)) return false;
	return equal(scryptSync(password, salt, 64).toString('hex'), digest);
}

function passwordToken(access: Access) {
	return createHash('sha256').update(`${access.editKey}:${access.passwordHash}`).digest('hex');
}

export function rememberOwner(cookies: Cookies, id: string, key: string) {
	cookies.set(ownerCookie(id), key, cookieOptions);
}

export function rememberPassword(cookies: Cookies, id: string, access: Access) {
	cookies.set(passwordCookie(id), passwordToken(access), cookieOptions);
}

export async function editorAccess(id: string, submittedKey: string, cookies: Cookies) {
	if (!validUuid(id)) error(404, 'Poll not found');
	const access = await getPollAccess(id);
	if (!access) error(404, 'Poll not found');
	const owner = [submittedKey, cookies.get(ownerCookie(id)) ?? ''].some((key) => validUuid(key) && equal(key, access.editKey));
	const passwordEditor = Boolean(access.passwordHash && equal(cookies.get(passwordCookie(id)) ?? '', passwordToken(access)));
	return { access, owner, canEdit: owner || passwordEditor || access.publicEdit };
}

export async function requireEditor(id: string, submittedKey: string, cookies: Cookies) {
	const result = await editorAccess(id, submittedKey, cookies);
	if (!result.canEdit) error(403, 'Editing is protected');
	return result;
}

export async function requireOwner(id: string, submittedKey: string, cookies: Cookies) {
	const result = await editorAccess(id, submittedKey, cookies);
	if (!result.owner) error(403, 'Private edit access required');
	return result;
}
