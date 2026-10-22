<script lang="ts">
    import { page } from '$app/state';
</script>
<svelte:head><title>{page.status === 404 ? 'Poll not found' : 'Something went wrong'} — Pollish</title></svelte:head>
<main class="mx-auto w-11/12 max-w-lg py-20 text-center">
    <p class="text-sm text-muted">{page.status}</p>
    <h1 class="my-4 text-4xl font-bold">{page.status === 404 ? 'This poll isn’t here.' : 'We couldn’t load this page.'}</h1>
    <p class="text-sm leading-relaxed text-muted">{page.status === 404 ? 'The link may be incomplete, or the poll may have been deleted. Check the link with the person who shared it.' : 'Please try again. If you were editing, return to the poll and check what was saved.'}</p>
    <div class="mt-6 flex justify-center gap-3"><button class="min-h-11 rounded-full border border-line px-5" onclick={() => location.reload()}>Try again</button><a class="inline-flex min-h-11 items-center rounded-full bg-accent px-5 text-black" href="/">Create a poll</a></div>
</main>
