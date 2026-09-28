import { randomUUID } from 'node:crypto';
import { database, prepareDatabase } from './db';

export type PollCard = {
	id: string;
	poll_id: string;
	title: string;
	description: string;
	image_path: string | null;
	position: number;
	yes_count: number;
	no_count: number;
};
export type Poll = {
	id: string;
	name: string;
	background_path: string | null;
	background_color: string | null;
	created_at: Date;
	cards: PollCard[];
};

export async function createPoll(name: string, publicEdit = false, passwordHash: string | null = null) {
	await prepareDatabase();
	const id = randomUUID();
	const editKey = randomUUID();
	const [poll] = await database()`INSERT INTO polls (id, edit_key, name, public_edit, edit_password_hash) VALUES (${id}, ${editKey}, ${name}, ${publicEdit}, ${passwordHash}) RETURNING id, edit_key`;
	return { id: String(poll.id), editKey: String(poll.edit_key) };
}

export async function getPoll(id: string): Promise<Poll | null> {
	await prepareDatabase();
	const sql = database();
	const [poll] = await sql<{ id: string; name: string; background_path: string | null; background_color: string | null; created_at: Date }[]>`SELECT id, name, background_path, background_color, created_at FROM polls WHERE id = ${id}::uuid`;
	if (!poll) return null;
	const cards = await sql<PollCard[]>`
		SELECT c.id, c.poll_id, c.title, c.description, c.image_path, c.position,
			COUNT(v.id) FILTER (WHERE v.choice = 'yes')::int AS yes_count,
			COUNT(v.id) FILTER (WHERE v.choice = 'no')::int AS no_count
		FROM poll_cards c LEFT JOIN poll_votes v ON v.card_id = c.id
		WHERE c.poll_id = ${id}::uuid
		GROUP BY c.id ORDER BY c.position, c.created_at`;
	return { ...poll, id: String(poll.id), cards } as Poll;
}

export async function canEditPoll(id: string, editKey: string) {
	await prepareDatabase();
	const [row] = await database()`SELECT 1 FROM polls WHERE id = ${id}::uuid AND edit_key = ${editKey}::uuid`;
	return Boolean(row);
}

export async function getPollAccess(id: string) {
	await prepareDatabase();
	const [row] = await database()<[{ edit_key: string; edit_password_hash: string | null; public_edit: boolean }]>`
		SELECT edit_key, edit_password_hash, public_edit FROM polls WHERE id = ${id}::uuid`;
	return row ? { editKey: String(row.edit_key), passwordHash: row.edit_password_hash, publicEdit: row.public_edit } : null;
}

export async function setPollAccess(id: string, publicEdit: boolean, passwordHash: string | null) {
	await prepareDatabase();
	await database()`UPDATE polls SET public_edit = ${publicEdit}, edit_password_hash = ${passwordHash} WHERE id = ${id}::uuid`;
}

export async function updatePollName(id: string, name: string) {
	await prepareDatabase();
	await database()`UPDATE polls SET name = ${name} WHERE id = ${id}::uuid`;
}

export async function addPollCard(pollId: string, title: string, description: string, imagePath: string | null) {
	await prepareDatabase();
	const [row] = await database()`SELECT COALESCE(MAX(position), -1) + 1 AS position FROM poll_cards WHERE poll_id = ${pollId}::uuid`;
	await database()`INSERT INTO poll_cards (id, poll_id, title, description, image_path, position) VALUES (${randomUUID()}, ${pollId}::uuid, ${title}, ${description}, ${imagePath}, ${row.position})`;
}

export async function removePollCard(pollId: string, cardId: string) {
	await prepareDatabase();
	const [row] = await database()`DELETE FROM poll_cards WHERE poll_id = ${pollId}::uuid AND id = ${cardId}::uuid RETURNING image_path`;
	return row?.image_path as string | null | undefined;
}

export async function setPollBackground(pollId: string, imagePath: string | null) {
	await prepareDatabase();
	const [row] = await database()`WITH previous AS (SELECT background_path FROM polls WHERE id = ${pollId}::uuid) UPDATE polls SET background_path = ${imagePath}, background_color = NULL WHERE id = ${pollId}::uuid RETURNING (SELECT background_path FROM previous) AS previous_path`;
	return row?.previous_path as string | null | undefined;
}

export async function setPollBackgroundColor(pollId: string, color: string) {
	await prepareDatabase();
	const [row] = await database()`WITH previous AS (SELECT background_path FROM polls WHERE id = ${pollId}::uuid) UPDATE polls SET background_color = ${color}, background_path = NULL WHERE id = ${pollId}::uuid RETURNING (SELECT background_path FROM previous) AS previous_path`;
	return row?.previous_path as string | null | undefined;
}

export async function removePoll(id: string) {
	await prepareDatabase();
	const sql = database();
	const cards = await sql<{ image_path: string | null }[]>`SELECT image_path FROM poll_cards WHERE poll_id = ${id}::uuid AND image_path IS NOT NULL`;
	const [poll] = await sql`DELETE FROM polls WHERE id = ${id}::uuid RETURNING background_path`;
	return { cards: cards.map((card) => card.image_path).filter((path): path is string => Boolean(path)), background: poll?.background_path as string | null | undefined };
}

export async function recordVote(cardId: string, voterId: string, choice: 'yes' | 'no') {
	await prepareDatabase();
	await database()`INSERT INTO poll_votes (id, card_id, voter_id, choice) VALUES (${randomUUID()}, ${cardId}::uuid, ${voterId}::uuid, ${choice}) ON CONFLICT (card_id, voter_id) DO UPDATE SET choice = EXCLUDED.choice, created_at = now()`;
}

export async function getVoterVotes(pollId: string, voterId: string) {
	await prepareDatabase();
	const rows = await database()<{ card_id: string; choice: 'yes' | 'no' }[]>`
		SELECT v.card_id, v.choice FROM poll_votes v JOIN poll_cards c ON c.id = v.card_id
		WHERE c.poll_id = ${pollId}::uuid AND v.voter_id = ${voterId}::uuid`;
	return Object.fromEntries(rows.map((row) => [String(row.card_id), row.choice])) as Record<string, 'yes' | 'no'>;
}
