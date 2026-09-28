import { error } from '@sveltejs/kit';
import { imageType, readImage } from '$lib/server/uploads';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const filename = params.filename;
	if (!/^[0-9a-f-]{36}\.(jpg|png|webp|gif)$/.test(filename)) error(404, 'Image not found');
	try {
		const image = await readImage(filename);
		return new Response(new Uint8Array(image), { headers: { 'Content-Type': imageType(filename), 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff' } });
	} catch {
		error(404, 'Image not found');
	}
};
