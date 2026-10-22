<script lang="ts">
    import { ArrowRight } from "@lucide/svelte";
</script>

<svelte:head>
    <title>Help &amp; setup — Pollish</title>
    <meta name="description" content="Create a poll, add choices, share the link, and vote." />
</svelte:head>

<main class="mx-auto w-11/12 max-w-2xl pt-2 pb-8 sm:pt-4 sm:pb-12">
    <h1 class="mb-6 text-4xl font-black tracking-tight">Help &amp; setup</h1>
    <div class="grid gap-6 rounded-3xl border border-line bg-surface/65 p-5 sm:p-6">
        <section><h2 class="mb-2 text-lg font-bold">Create a poll</h2><p class="text-sm leading-relaxed text-muted">Enter a title and choose who can edit. Set an edit password or let anyone with the poll link edit.</p></section>
        <section><h2 class="mb-2 text-lg font-bold">Add choices</h2><p class="text-sm leading-relaxed text-muted">Add titles, optional descriptions, and images in the editor. You can also customize the poll background.</p></section>
        <section><h2 class="mb-2 text-lg font-bold">Share and vote</h2><p class="text-sm leading-relaxed text-muted">Open the poll and select Share poll to copy its link. Anyone with the link can use the heart or × on each choice, or switch to Swipe mode. Tap a selected vote to clear it.</p></section>
        <section><h2 class="mb-2 text-lg font-bold">Names and results</h2><p class="text-sm leading-relaxed text-muted">Add an optional display name on the poll. Everyone with the link can see it beside your votes in Results. You can edit or clear your name anytime; names apply only to that poll. Reset my votes lets you start over.</p></section>
        <section><h2 class="mb-2 text-lg font-bold">Edit access</h2><p class="text-sm leading-relaxed text-muted">Keep the private owner link from the editor. It lets you manage access and delete the poll. Share the public poll link with voters.</p></section>
        <a href="/#create" class="inline-flex items-center gap-2 text-sm font-bold text-accent">Create a poll <ArrowRight class="size-4" /></a>
    </div>
</main>
