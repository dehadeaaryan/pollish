import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

const uploadRoot = path.resolve(process.env.UPLOAD_DIR || (process.env.NODE_ENV === 'production' ? '/app/uploads' : '.data/uploads'));
const allowed = new Map([['image/jpeg', 'jpg'], ['image/png', 'png'], ['image/webp', 'webp'], ['image/gif', 'gif']]);
export const MAX_IMAGE_SIZE = 8 * 1024 * 1024;

export async function saveImage(file: File) {
	const extension = allowed.get(file.type);
	if (!extension) throw new Error('Use a JPG, PNG, WebP or GIF image.');
	if (file.size > MAX_IMAGE_SIZE) throw new Error('Keep images under 8 MB.');
	if (file.size === 0) throw new Error('That image is empty. Choose another file.');
	const name = `${randomUUID()}.${extension}`;
	await mkdir(uploadRoot, { recursive: true });
	await writeFile(path.join(uploadRoot, name), Buffer.from(await file.arrayBuffer()), { flag: 'wx' });
	return name;
}

export async function readImage(name: string) {
	return readFile(path.join(uploadRoot, name));
}

export async function deleteImage(name: string | null | undefined) {
	if (!name || !/^[0-9a-f-]{36}\.(jpg|png|webp|gif)$/.test(name)) return;
	await unlink(path.join(uploadRoot, name)).catch(() => undefined);
}

export function imageType(name: string) {
	const extension = path.extname(name).slice(1);
	return ({ jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif' } as Record<string, string>)[extension] ?? 'application/octet-stream';
}
