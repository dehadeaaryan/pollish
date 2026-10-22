<script lang="ts">
    import { Crown, Heart, X } from '@lucide/svelte';
    import type { PollCard, NamedVote } from '$lib/server/polls';
    let { cards, namedVotes = [] }: { cards: PollCard[]; namedVotes?: NamedVote[] } = $props();
    const rank = (card: PollCard) => cards.findIndex(other => other.yes_count === card.yes_count) + 1;
</script>

<ol class="leaderboard mx-auto grid max-w-3xl gap-3" aria-label="Poll results">
    {#each cards as card, index (card.id)}
        {@const total = card.yes_count + card.no_count}
        {@const percent = total ? Math.round(card.yes_count / total * 100) : 0}
        {@const favorite = card.yes_count > 0 && card.yes_count === cards[0].yes_count}
        <li class="result-row rounded-2xl border border-line bg-surface/80 p-4 sm:p-5" class:favorite style={`--delay: ${Math.min(index, 5) * 60}ms`}>
            <div class="flex items-center gap-3 sm:gap-4">
                <span class="rank grid size-9 shrink-0 place-items-center rounded-full text-sm font-black" class:gold={favorite} aria-label={`Rank ${rank(card)}`}>
                    {#if favorite}<Crown class="size-5" />{:else}{rank(card)}{/if}
                </span>
                {#if card.image_path}<img class="size-12 shrink-0 rounded-xl object-cover sm:size-16" src={`/media/${card.image_path}`} alt="" />{:else}<span class="thumbnail grid size-12 shrink-0 place-items-center rounded-xl sm:size-16" aria-hidden="true"><Heart class="size-5" /></span>{/if}
                <div class="min-w-0 flex-1">
                    {#if favorite}<p class="mb-1 text-[10px] font-extrabold uppercase tracking-widest text-accent">{cards.filter(other => other.yes_count === card.yes_count).length > 1 ? 'Tied for most loved' : 'Most loved'}</p>{/if}
                    <h2 class="text-base font-bold leading-snug sm:text-xl">{card.title}</h2>
                    {#if card.description}<p class="mt-1 line-clamp-2 text-xs text-muted">{card.description}</p>{/if}
                </div>
            </div>
            <div class="mt-4 flex items-center gap-3">
                <div class="h-2 flex-1 overflow-hidden rounded-full bg-raised" aria-hidden="true"><div class="vote-fill h-full rounded-full bg-sage" style:width={`${percent}%`}></div></div>
                <span class="w-9 text-right text-xs font-bold text-sage">{total ? `${percent}%` : '—'}</span>
            </div>
            <div class="mt-3 flex items-center justify-between gap-3 text-xs">
                <div class="flex items-center gap-4"><span class="inline-flex items-center gap-1.5 font-bold text-sage" aria-label={`${card.yes_count} likes`}><Heart class="size-3.5" fill="currentColor" />{card.yes_count}</span><span class="inline-flex items-center gap-1.5 text-muted" aria-label={`${card.no_count} dislikes`}><X class="size-3.5" />{card.no_count}</span></div>
                <span class="text-muted">{total ? `${total} ${total === 1 ? 'vote' : 'votes'}` : 'Be the first to vote'}</span>
            </div>
            {#if total > 0}
                <div class="mt-4 grid gap-3 border-t border-line pt-3">
                    {#each ['yes', 'no'] as choice}
                        {@const names = namedVotes.filter(vote => vote.card_id === card.id && vote.choice === choice)}
                        {@const anonymous = (choice === 'yes' ? card.yes_count : card.no_count) - names.length}
                        {#if names.length || anonymous > 0}
                            <div class="flex flex-wrap items-center gap-2 text-xs" aria-label={choice === 'yes' ? 'Liked by' : 'Not for them'}>
                                <span class="inline-flex items-center gap-1.5 py-1 font-semibold text-muted">{#if choice === 'yes'}<Heart class="size-3.5 text-sage" /> Liked by{:else}<X class="size-3.5" /> Not for{/if}</span>
                                {#each names as vote}<span class="max-w-full break-all rounded-full border border-line bg-raised px-2.5 py-1.5">{vote.name}</span>{/each}
                                {#if anonymous > 0}<span class="py-1 text-muted">{anonymous} anonymous</span>{/if}
                            </div>
                        {/if}
                    {/each}
                </div>
            {/if}
        </li>
    {/each}
</ol>

<style>
.result-row { animation: arrive 420ms both cubic-bezier(.2,.8,.2,1); animation-delay: var(--delay); }
.favorite { border-color: color-mix(in srgb, var(--accent) 45%, transparent); background: linear-gradient(120deg, color-mix(in srgb, var(--accent) 12%, var(--surface)), var(--surface)); }
.rank { background: var(--surface-raised); color: var(--muted); }
.rank.gold { background: var(--accent); color: #27160a; transform: rotate(-8deg); box-shadow: 0 4px 18px #ff7a3026; }
.thumbnail { color: var(--sage); background: linear-gradient(140deg, color-mix(in srgb, var(--sage) 25%, var(--surface)), var(--surface-raised)); }
.vote-fill { transform-origin: left; animation: fill-in 650ms both cubic-bezier(.2,.8,.2,1); animation-delay: var(--delay); }
@keyframes arrive { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fill-in { from { transform: scaleX(0); } to { transform: scaleX(1); } }
</style>
