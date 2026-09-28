declare module 'bun:sqlite' {
	type Parameter = string | number | null;
	export class Database {
		constructor(filename: string, options?: { create?: boolean });
		exec(sql: string): void;
		query<T extends object = Record<string, unknown>>(sql: string): {
			get(...params: Parameter[]): T | null;
			all(...params: Parameter[]): T[];
			run(...params: Parameter[]): { changes: number };
		};
	}
}
