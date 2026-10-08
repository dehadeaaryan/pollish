<script lang="ts">
    import { Copy, Pencil } from "@lucide/svelte";
    import PollCard from "./PollCard.svelte";
    const choices = [
        { title: "Cabin weekend", description: "Somewhere green", yes_count: 8, no_count: 2 },
        { title: "Beach day", description: "By the water", yes_count: 6, no_count: 4 },
        { title: "City break", description: "Food & wandering", yes_count: 4, no_count: 6 },
    ].map((choice, position) => ({ ...choice, id: `example-${position}`, poll_id: "example", image_path: null, position }));
</script>

<section class="poll-preview -rotate-1 rounded-2xl border border-line bg-surface/80 p-3 shadow-2xl sm:p-5" aria-label="Example poll">
    <header class="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 class="text-2xl font-black uppercase leading-none tracking-tighter">Where should we go?</h2>
        <div class="flex items-center gap-2 text-xs font-bold text-muted">
            <span class="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-2"><Pencil class="size-3" /> Edit poll</span>
            <span class="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-2"><Copy class="size-3" /> Share poll</span>
        </div>
    </header>
    <div class="preview-choices grid gap-3">
        {#each choices as card (card.id)}
            <PollCard {card} preview />
        {/each}
    </div>
</section>

<style>
    .preview-choices { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .poll-preview :global(article > div:first-child) { height: 6rem; }
    .poll-preview :global(article > div:last-child) { padding: .75rem; }
    .poll-preview :global(article h2) { font-size: .875rem; }
    .poll-preview :global(form) { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .poll-preview :global(form button) { font-size: .5625rem; white-space: nowrap; padding-inline: .25rem; gap: .25rem; }
    .poll-preview :global(form button svg) { width: .75rem; height: .75rem; }
    @media (max-width: 639px) {
        .preview-choices { grid-template-columns: minmax(0, 1fr); }
        .preview-choices :global(article:not(:first-child)) { display: none; }
        .poll-preview :global(article > div:first-child) { height: 7rem; }
        .poll-preview :global(form button) { font-size: .75rem; }
    }
</style>
