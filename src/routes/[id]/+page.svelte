<script lang="ts">
    import {
        Check,
        PartyPopper,
        RotateCw,
        Copy,
        Link2,
        Pencil,
    } from "@lucide/svelte";
    import { enhance } from '$app/forms';
    import { invalidateAll } from '$app/navigation';
    import { formFeedback } from '$lib/form-feedback';
    import PollResults from "$lib/components/PollResults.svelte";
    import PollCard from "$lib/components/PollCard.svelte";
    import { page } from "$app/state";
    let { data, form } = $props();
    let mode = $state<'grid' | 'swipe' | 'results'>('grid');
    let advancing = $state(false);
    $effect(() => { remaining[0]?.id; advancing = false; });
    let showReset = $state(false);
    let copyError = $state(false);
    let remaining = $derived(data.poll.cards.filter(card => !data.votes[card.id]));
    let ranked = $derived([...data.poll.cards].sort((a, b) => b.yes_count - a.yes_count || a.no_count - b.no_count));
    let answered = $derived(data.poll.cards.length - remaining.length);
    let totalVotes = $derived(data.poll.cards.reduce((sum, card) => sum + card.yes_count + card.no_count, 0));
    let copied = $state(false);
    let refreshing = $state(false);
    let refreshError = $state('');
    async function refreshResults() {
        refreshing = true; refreshError = '';
        try { await invalidateAll(); } catch { refreshError = 'Could not refresh. Try again.'; }
        finally { refreshing = false; }
    }
    async function copyLink() {
        copyError = false;
        try { await navigator.clipboard.writeText(`${window.location.origin}/${data.poll.id}`); } catch { copyError = true; return; }
        copied = true;
        setTimeout(() => (copied = false), 1800);
    }
</script>

<svelte:head>
    <title>{data.poll.name.toUpperCase()} — Pollish</title>
    <meta name="description" content={`Vote on ${data.poll.name} with your group on Pollish.`} />
    <link rel="canonical" href={new URL(page.url.pathname, page.url).href} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={new URL(page.url.pathname, page.url).href} />
    <meta property="og:title" content={`${data.poll.name.toUpperCase()} — Pollish`} />
    <meta property="og:description" content={`Vote on ${data.poll.name} with your group on Pollish.`} />
    <meta property="og:image" content={new URL('/og-preview.png', page.url).href} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content={new URL(page.url.pathname, page.url).href} />
    <meta name="twitter:title" content={`${data.poll.name.toUpperCase()} — Pollish`} />
    <meta name="twitter:description" content={`Vote on ${data.poll.name} with your group on Pollish.`} />
    <meta name="twitter:image" content={new URL('/og-preview.png', page.url).href} />
</svelte:head>

<main
    class="relative isolate mx-auto w-11/12 max-w-6xl overflow-hidden rounded-3xl p-4 sm:p-6"
>
    {#if data.poll.background_path || data.poll.background_color}
        <div
            class="pointer-events-none absolute inset-0 -z-10 bg-cover bg-center"
            style:background-image={data.poll.background_path
                ? `url('/media/${data.poll.background_path}')`
                : undefined}
            style:background-color={data.poll.background_color ?? undefined}
            aria-hidden="true"
        ></div>
        <div
            class="pointer-events-none absolute inset-0 -z-10 bg-canvas/55"
            aria-hidden="true"
        ></div>
    {/if}
    <header class="flex flex-wrap items-end justify-between gap-4 pb-6">
        <div>
            <h1
                class="max-w-3xl text-4xl sm:text-6xl leading-none font-black uppercase tracking-tighter"
            >
                {data.poll.name}
            </h1>
        </div>
        <div class="flex flex-wrap items-center gap-2">
            <a
                href={`/${data.poll.id}/edit`}
                class="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-line bg-white/5 px-5 text-xs font-bold text-ink transition hover:border-accent/40 hover:text-accent"
                ><Pencil class="size-4" /> {data.canEdit ? "Edit poll" : data.editMode === "password" ? "Edit with password" : "Edit access"}</a
            >
            <button
                class="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border px-5 text-xs font-bold transition duration-200 hover:scale-105 border-line bg-white/5 text-ink backdrop-blur-md hover:border-accent/40 hover:bg-white/10 hover:text-accent shrink-0"
                onclick={copyLink}
                >{#if copied}<Check class="size-4" /> Copied{:else}<Copy
                        class="size-4"
                    /> Share poll{/if}</button
            >
        </div>
    </header>
    {#if data.editMode === 'public'}<p class="mb-5 text-xs text-muted">Anyone with the link can edit</p>{/if}
    {#if copyError}<label class="mb-5 block text-sm" role="status">Copy this voting link manually<input class="mt-2 w-full rounded-xl border border-line p-3" readonly value={new URL(`/${data.poll.id}`, page.url).href} onclick={(event) => event.currentTarget.select()} /></label>{/if}
    {#if form?.voteError}<p role="alert">{form.voteError}</p>{/if}
    <details class="mb-5 rounded-2xl border border-line bg-surface/60 px-4">
        <summary class="flex min-h-12 cursor-pointer items-center justify-between gap-3 text-sm font-semibold"><span class="min-w-0 break-all">{data.voterName ? `Voting as ${data.voterName}` : 'Add your name'}</span><Pencil class="size-3.5 shrink-0 text-muted" /></summary>
        <form method="POST" action="?/name" use:enhance={formFeedback} class="grid gap-3 border-t border-line py-4">
            <label class="text-xs font-bold text-muted" for="voter-name">Display name (optional)</label>
            <div class="flex flex-wrap gap-2"><input class="min-h-11 min-w-0 flex-1 rounded-full border border-line bg-canvas/45 px-4 text-base" id="voter-name" name="name" maxlength="40" autocomplete="nickname" value={data.voterName} placeholder="What should we call you?" aria-describedby="name-visibility" /><button type="submit" class="min-h-11 rounded-full bg-accent px-5 text-sm font-bold text-black">Save name</button></div>
            <p class="text-xs text-muted" id="name-visibility">Visible to everyone with your votes on this poll. Leave blank to stay anonymous.</p>
        </form>
    </details>
    {#if form?.error}<p class="mb-4 text-sm" role="alert">{form.error}</p>{/if}
    {#if data.poll.cards.length}
        <div class="mb-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
            <div class="mode-switch flex rounded-full border border-line bg-surface p-1" style={`--selected: ${mode === "grid" ? 0 : mode === "swipe" ? 1 : 2}`} role="group" aria-label="Viewing mode">
                {#each ['grid', 'swipe', 'results'] as view}<button class="min-h-11 rounded-full px-4 text-sm font-bold" class:active-mode={mode === view} aria-pressed={mode === view} onclick={() => mode = view as typeof mode}>{view === 'grid' ? 'Cards' : view === 'swipe' ? 'Swipe' : 'Results'}</button>{/each}
            </div>
            <p class="text-sm text-muted" aria-live="polite">{answered} of {data.poll.cards.length} choices answered</p>
        </div>
        {#if mode === 'swipe'}
            <section class="mx-auto max-w-sm pb-8" aria-label="Swipe choices">
                {#if remaining[0]}
                    <p class="mb-5 text-center text-xs text-muted">← Not for me · Love it →</p>
                    <div class="deck">
                        {#each remaining.slice(0, 2) as card, index (card.id)}
                            <div class="deck-layer" class:behind={index > 0} class:promoting={index > 0 && advancing} inert={index > 0} aria-hidden={index > 0}>
                                <PollCard {card} stacked oncommit={() => advancing = true} swipe={index === 0} preview={index > 0} />
                            </div>
                        {/each}
                    </div>
                {:else}
                    <div class="rounded-3xl border border-line bg-surface p-8 text-center"><div class="celebrate mx-auto mb-4 w-fit"><PartyPopper class="size-10 text-accent" /></div><h2 class="text-2xl font-bold">You’re all done!</h2><p class="my-4 text-sm text-muted">Votes saved. View results or start again.</p><button class="min-h-11 rounded-full bg-accent px-5 font-bold text-black" onclick={() => mode = 'results'}>See results</button></div>
                {/if}
            </section>
        {:else}
            {#if mode === 'results'}
                <div class="mx-auto mb-5 max-w-3xl">
                    <div class="flex items-center justify-between gap-3"><h2 class="text-2xl font-bold">Group results</h2><button class="grid size-11 shrink-0 place-items-center rounded-full border border-line text-muted" aria-label="Refresh results" title="Refresh results" disabled={refreshing} onclick={refreshResults}><RotateCw class={refreshing ? "size-4 animate-spin" : "size-4"} /></button></div>
                    <p class="mt-1 text-xs leading-relaxed text-muted">{totalVotes ? `${totalVotes} votes across all choices · Ranked by hearts` : 'No votes yet. Vote on a choice to get things started.'}</p>
                </div>
            {/if}
            {#if mode === 'results'}
                {#if refreshError}<p class="mx-auto mb-4 max-w-3xl text-sm" role="alert">{refreshError}</p>{/if}
                <PollResults cards={ranked} namedVotes={data.namedVotes} />
            {:else}
                <section class="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Poll choices">
                    {#each data.poll.cards as card (card.id)}<PollCard {card} vote={data.votes[card.id]} />{/each}
                </section>
            {/if}
        {/if}
        {#if answered > 0}
            <div class="my-6 flex flex-wrap items-center justify-center gap-3">
                {#if showReset}
                    <form method="POST" action="?/reset" use:enhance={(input) => {
                        const feedback = formFeedback(input);
                        return async (result) => {
                            if (typeof feedback === 'function') await feedback(result);
                            if (result.result.type === 'success') { showReset = false; mode = 'swipe'; }
                        };
                    }} class="flex flex-wrap items-center justify-center gap-3">
                        <p class="w-full text-center text-sm text-muted">Clear only your votes on this poll?</p>
                        <button type="submit" class="min-h-11 rounded-full bg-accent px-5 text-sm font-bold text-black">Reset & restart</button>
                        <button type="button" class="min-h-11 rounded-full border border-line px-5 text-sm" onclick={() => showReset = false}>Cancel</button>
                    </form>
                {:else}<button class="min-h-11 rounded-full border border-line px-5 text-sm text-muted" onclick={() => showReset = true}>Reset my votes</button>{/if}
            </div>
        {/if}
    {:else}
        <section
            class="grid justify-items-center px-5 py-14 text-center sm:py-16 rounded-3xl border border-line bg-surface/65 shadow-2xl backdrop-blur-xl backdrop-saturate-150 in-[.light]:border-white/40 in-[.light]:bg-white/15"
        >
            <div
                class="mb-5 grid h-12 w-12 place-items-center rounded-2xl border border-line bg-raised text-accent"
            >
                <Link2 class="size-5" />
            </div>
            <span
                class="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-muted"
                >Your options are on the way</span
            >
            <h2 class="my-3 text-3xl tracking-tight">
                This poll is taking shape.
            </h2>
            <p class="max-w-sm text-xs leading-7 text-muted">
                {data.canEdit ? 'Add choices in the builder, then share this link with your group.' : 'The creator hasn’t added choices yet. Check back soon.'}
            </p>
            <a class="mt-4 inline-flex min-h-11 items-center rounded-full border border-line px-5 text-sm" data-sveltekit-reload href={data.canEdit ? `/${data.poll.id}/edit` : `/${data.poll.id}`}>{data.canEdit ? 'Add choices' : 'Check for choices'}</a>
        </section>
    {/if}
</main>

<style>
.celebrate { animation: celebrate 600ms cubic-bezier(.34,1.56,.64,1); }
@keyframes celebrate { from { transform: scale(.4) rotate(-25deg); opacity: 0; } to { transform: scale(1) rotate(0); opacity: 1; } }
.mode-switch { position: relative; isolation: isolate; }
.mode-switch::before { content: ''; position: absolute; z-index: -1; top: 4px; bottom: 4px; left: 4px; width: calc((100% - 8px) / 3); border-radius: 999px; background: var(--accent); transform: translateX(calc(var(--selected) * 100%)); transition: transform 250ms cubic-bezier(.2,.8,.2,1); }
.mode-switch button { width: 76px; padding-inline: 0; }
.active-mode { color: #17110d; }
.deck { position: relative; isolation: isolate; margin-bottom: 18px; }
.deck-layer { position: relative; z-index: 2; transform: translateY(0) scale(1); filter: brightness(1); transition: transform 280ms cubic-bezier(.2,.7,.2,1), filter 280ms ease; }
.deck-layer.behind { position: absolute; inset: 0; z-index: 1; transform: translateY(16px) scale(.95); filter: brightness(.82); height: 100%; overflow: hidden; border-radius: 1rem; pointer-events: none; }
.deck-layer.behind.promoting { transform: translateY(0) scale(1); filter: brightness(1); }
</style>
