import postgres from 'postgres';
import { env } from '$env/dynamic/private';

let client: ReturnType<typeof postgres> | undefined;
let schemaReady: Promise<void> | undefined;

export function database() {
	const connection = env.DATABASE_URL ?? process.env.DATABASE_URL;
	if (!connection) throw new Error('DATABASE_URL is missing. Add the Coolify PostgreSQL connection URL to the app environment.');
	client ??= postgres(connection, { max: 8, idle_timeout: 20, connect_timeout: 10 });
	return client;
}

export async function prepareDatabase() {
	if (!schemaReady) {
		schemaReady = (async () => {
			const sql = database();
			await sql.unsafe(`CREATE TABLE IF NOT EXISTS polls (
				id uuid PRIMARY KEY,
				edit_key uuid NOT NULL UNIQUE,
				name varchar(100) NOT NULL,
				edit_password_hash text,
				public_edit boolean NOT NULL DEFAULT false,
				background_path text,
				background_color varchar(7),
				created_at timestamptz NOT NULL DEFAULT now()
			)`);
			await sql.unsafe('ALTER TABLE polls ADD COLUMN IF NOT EXISTS edit_password_hash text');
			await sql.unsafe('ALTER TABLE polls ADD COLUMN IF NOT EXISTS public_edit boolean NOT NULL DEFAULT false');
			await sql.unsafe('ALTER TABLE polls ADD COLUMN IF NOT EXISTS background_color varchar(7)');
			await sql.unsafe(`CREATE TABLE IF NOT EXISTS poll_cards (
				id uuid PRIMARY KEY,
				poll_id uuid NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
				title varchar(120) NOT NULL,
				description varchar(280) NOT NULL DEFAULT '',
				image_path text,
				position integer NOT NULL DEFAULT 0,
				created_at timestamptz NOT NULL DEFAULT now()
			)`);
			await sql.unsafe(`CREATE TABLE IF NOT EXISTS poll_votes (
				id uuid PRIMARY KEY,
				card_id uuid NOT NULL REFERENCES poll_cards(id) ON DELETE CASCADE,
				voter_id uuid NOT NULL,
				choice varchar(8) NOT NULL CHECK (choice IN ('yes', 'no')),
				created_at timestamptz NOT NULL DEFAULT now(),
				UNIQUE (card_id, voter_id)
			)`);
			await sql.unsafe('CREATE INDEX IF NOT EXISTS poll_cards_order_idx ON poll_cards (poll_id, position)');
			await sql.unsafe('CREATE INDEX IF NOT EXISTS poll_votes_card_idx ON poll_votes (card_id)');
		})().catch((cause) => {
			schemaReady = undefined;
			throw cause;
		});
	}
	return schemaReady;
}
