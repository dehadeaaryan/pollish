import { env } from '$env/dynamic/private';

export type { Poll, PollCard } from './postgres-polls';

async function repository() {
	if (env.DATABASE_URL || process.env.DATABASE_URL) return import('./postgres-polls');
	if (process.env.NODE_ENV === 'production') {
		throw new Error('DATABASE_URL is required in production. Configure the Coolify PostgreSQL connection URL.');
	}
	return import('./sqlite-polls');
}

export async function createPoll(name: string, publicEdit = false, passwordHash: string | null = null) { return (await repository()).createPoll(name, publicEdit, passwordHash); }
export async function getPoll(id: string) { return (await repository()).getPoll(id); }
export async function canEditPoll(id: string, editKey: string) { return (await repository()).canEditPoll(id, editKey); }
export async function getPollAccess(id: string) { return (await repository()).getPollAccess(id); }
export async function setPollAccess(id: string, publicEdit: boolean, passwordHash: string | null) { return (await repository()).setPollAccess(id, publicEdit, passwordHash); }
export async function updatePollName(id: string, name: string) { return (await repository()).updatePollName(id, name); }
export async function addPollCard(pollId: string, title: string, description: string, imagePath: string | null) { return (await repository()).addPollCard(pollId, title, description, imagePath); }
export async function removePollCard(pollId: string, cardId: string) { return (await repository()).removePollCard(pollId, cardId); }
export async function setPollBackground(pollId: string, imagePath: string | null) { return (await repository()).setPollBackground(pollId, imagePath); }
export async function setPollBackgroundColor(pollId: string, color: string) { return (await repository()).setPollBackgroundColor(pollId, color); }
export async function removePoll(id: string) { return (await repository()).removePoll(id); }
export async function recordVote(cardId: string, voterId: string, choice: 'yes' | 'no') { return (await repository()).recordVote(cardId, voterId, choice); }
export async function getVoterVotes(pollId: string, voterId: string) { return (await repository()).getVoterVotes(pollId, voterId); }
