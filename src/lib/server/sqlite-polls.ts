import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import type { Poll, PollCard } from './postgres-polls';

type Parameter = string | number | null;
type Statement<T> = {
	get(...params: Parameter[]): T | null;
	all(...params: Parameter[]): T[];
	run(...params: Parameter[]): { changes: number | bigint };
};
type SQLiteClient = {
	exec(sql: string): void;
	query<T extends object>(sql: string): Statement<T>;
};

let client: Promise<SQLiteClient> | undefined;

function database() {
	return client ??= openDatabase();
}

async function openDatabase(): Promise<SQLiteClient> {
	const filename = resolve(process.env.SQLITE_PATH || '.data/pollish.sqlite');
	mkdirSync(dirname(filename), { recursive: true });
	let db: SQLiteClient;
	if ('bun' in process.versions) {
		db = new (await import('bun:sqlite')).Database(filename, { create: true });
	} else {
		const { DatabaseSync } = await import('node:sqlite');
		const node = new DatabaseSync(filename);
		db = {
			exec: (sql) => node.exec(sql),
			query: <T extends object>(sql: string): Statement<T> => {
				const statement = node.prepare(sql);
				return {
					get: (...params) => statement.get(...params) as T | null,
					all: (...params) => statement.all(...params) as T[],
					run: (...params) => statement.run(...params)
				};
			}
		};
	}
	db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
	db.exec(`CREATE TABLE IF NOT EXISTS polls (
		id TEXT PRIMARY KEY, edit_key TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
		edit_password_hash TEXT, public_edit INTEGER NOT NULL DEFAULT 0,
		background_path TEXT, background_color TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
	);
	CREATE TABLE IF NOT EXISTS poll_cards (
		id TEXT PRIMARY KEY, poll_id TEXT NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
		title TEXT NOT NULL, description TEXT NOT NULL DEFAULT '', image_path TEXT,
		position INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
	);
	CREATE TABLE IF NOT EXISTS poll_votes (
		id TEXT PRIMARY KEY, card_id TEXT NOT NULL REFERENCES poll_cards(id) ON DELETE CASCADE,
		voter_id TEXT NOT NULL, choice TEXT NOT NULL CHECK (choice IN ('yes', 'no')),
		created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE(card_id, voter_id)
	);
	CREATE INDEX IF NOT EXISTS poll_cards_order_idx ON poll_cards(poll_id, position);
	CREATE INDEX IF NOT EXISTS poll_votes_card_idx ON poll_votes(card_id);`);
	const columns = db.query<{ name: string }>('PRAGMA table_info(polls)').all().map((column) => column.name);
	if (!columns.includes('edit_password_hash')) db.exec('ALTER TABLE polls ADD COLUMN edit_password_hash TEXT');
	if (!columns.includes('public_edit')) db.exec('ALTER TABLE polls ADD COLUMN public_edit INTEGER NOT NULL DEFAULT 0');
	if (!columns.includes('background_color')) db.exec('ALTER TABLE polls ADD COLUMN background_color TEXT');
	return db;
}

export async function createPoll(name: string, publicEdit = false, passwordHash: string | null = null) {
	const id = randomUUID();
	const editKey = randomUUID();
	(await database()).query('INSERT INTO polls (id, edit_key, name, public_edit, edit_password_hash) VALUES (?, ?, ?, ?, ?)').run(id, editKey, name, Number(publicEdit), passwordHash);
	return { id, editKey };
}

export async function getPoll(id: string): Promise<Poll | null> {
	const db = await database();
	const poll = db.query<{ id: string; name: string; background_path: string | null; background_color: string | null; created_at: string }>('SELECT id, name, background_path, background_color, created_at FROM polls WHERE id = ?').get(id);
	if (!poll) return null;
	const cards = db.query<PollCard>(`SELECT c.id, c.poll_id, c.title, c.description, c.image_path, c.position,
		SUM(CASE WHEN v.choice = 'yes' THEN 1 ELSE 0 END) AS yes_count,
		SUM(CASE WHEN v.choice = 'no' THEN 1 ELSE 0 END) AS no_count
		FROM poll_cards c LEFT JOIN poll_votes v ON v.card_id = c.id
		WHERE c.poll_id = ? GROUP BY c.id ORDER BY c.position, c.created_at`).all(id);
	return { ...poll, created_at: new Date(poll.created_at), cards };
}

export async function canEditPoll(id: string, editKey: string) {
	return Boolean((await database()).query('SELECT 1 FROM polls WHERE id = ? AND edit_key = ?').get(id, editKey));
}

export async function getPollAccess(id: string) {
	const row = (await database()).query<{ edit_key: string; edit_password_hash: string | null; public_edit: number }>('SELECT edit_key, edit_password_hash, public_edit FROM polls WHERE id = ?').get(id);
	return row ? { editKey: row.edit_key, passwordHash: row.edit_password_hash, publicEdit: Boolean(row.public_edit) } : null;
}

export async function setPollAccess(id: string, publicEdit: boolean, passwordHash: string | null) {
	(await database()).query('UPDATE polls SET public_edit = ?, edit_password_hash = ? WHERE id = ?').run(Number(publicEdit), passwordHash, id);
}

export async function updatePollName(id: string, name: string) {
	(await database()).query('UPDATE polls SET name = ? WHERE id = ?').run(name, id);
}

export async function addPollCard(pollId: string, title: string, description: string, imagePath: string | null) {
	const db = await database();
	const row = db.query<{ position: number }>('SELECT COALESCE(MAX(position), -1) + 1 AS position FROM poll_cards WHERE poll_id = ?').get(pollId);
	db.query('INSERT INTO poll_cards (id, poll_id, title, description, image_path, position) VALUES (?, ?, ?, ?, ?, ?)').run(randomUUID(), pollId, title, description, imagePath, row?.position ?? 0);
}

export async function removePollCard(pollId: string, cardId: string) {
	const db = await database();
	const row = db.query<{ image_path: string | null }>('DELETE FROM poll_cards WHERE poll_id = ? AND id = ? RETURNING image_path').get(pollId, cardId);
	return row?.image_path;
}

export async function setPollBackground(pollId: string, imagePath: string | null) {
	const db = await database();
	const previous = db.query<{ background_path: string | null }>('SELECT background_path FROM polls WHERE id = ?').get(pollId);
	db.query('UPDATE polls SET background_path = ?, background_color = NULL WHERE id = ?').run(imagePath, pollId);
	return previous?.background_path;
}

export async function setPollBackgroundColor(pollId: string, color: string) {
	const db = await database();
	const previous = db.query<{ background_path: string | null }>('SELECT background_path FROM polls WHERE id = ?').get(pollId);
	db.query('UPDATE polls SET background_color = ?, background_path = NULL WHERE id = ?').run(color, pollId);
	return previous?.background_path;
}

export async function removePoll(id: string) {
	const db = await database();
	const cards = db.query<{ image_path: string }>('SELECT image_path FROM poll_cards WHERE poll_id = ? AND image_path IS NOT NULL').all(id);
	const poll = db.query<{ background_path: string | null }>('DELETE FROM polls WHERE id = ? RETURNING background_path').get(id);
	return { cards: cards.map((card) => card.image_path), background: poll?.background_path };
}

export async function recordVote(cardId: string, voterId: string, choice: 'yes' | 'no') {
	(await database()).query(`INSERT INTO poll_votes (id, card_id, voter_id, choice) VALUES (?, ?, ?, ?)
		ON CONFLICT (card_id, voter_id) DO UPDATE SET choice = excluded.choice, created_at = CURRENT_TIMESTAMP`).run(randomUUID(), cardId, voterId, choice);
}

export async function getVoterVotes(pollId: string, voterId: string) {
	const rows = (await database()).query<{ card_id: string; choice: 'yes' | 'no' }>(`SELECT v.card_id, v.choice FROM poll_votes v
		JOIN poll_cards c ON c.id = v.card_id WHERE c.poll_id = ? AND v.voter_id = ?`).all(pollId, voterId);
	return Object.fromEntries(rows.map((row) => [row.card_id, row.choice])) as Record<string, 'yes' | 'no'>;
}
