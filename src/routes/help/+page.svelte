<script lang="ts">
    import { ArrowRight } from "@lucide/svelte";
</script>

<svelte:head>
    <title>Help &amp; setup — Pollish</title>
    <meta name="description" content="Create a poll, add choices, share the link, and vote." />
</svelte:head>

<main class="mx-auto w-11/12 max-w-2xl py-12">
    <h1 class="mb-8 text-4xl font-black tracking-tight">Help &amp; setup</h1>
    <div class="grid gap-6 rounded-3xl border border-line bg-surface/65 p-6 sm:p-8">
        <section><h2 class="mb-2 text-lg font-bold">Create a poll</h2><p class="text-sm leading-relaxed text-muted">Enter a title and choose who can edit. Set an edit password or let anyone with the poll link edit.</p></section>
        <section><h2 class="mb-2 text-lg font-bold">Add choices</h2><p class="text-sm leading-relaxed text-muted">Add titles, optional descriptions, and images in the editor. You can also customize the poll background.</p></section>
        <section><h2 class="mb-2 text-lg font-bold">Share and vote</h2><p class="text-sm leading-relaxed text-muted">Open the poll and select Share poll to copy its link. Anyone with the link can vote Love it or Not for me on each choice.</p></section>
        <section><h2 class="mb-2 text-lg font-bold">Edit access</h2><p class="text-sm leading-relaxed text-muted">Keep the private owner link from the editor. It lets you manage access and delete the poll. Share the public poll link with voters.</p></section>
        <a href="/#create" class="inline-flex items-center gap-2 text-sm font-bold text-accent">Create a poll <ArrowRight class="size-4" /></a>
    </div>
</main>
