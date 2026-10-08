<script lang="ts">
    import {
        Check,
        Copy,
        Link2,
        Pencil,
    } from "@lucide/svelte";
    import PollCard from "$lib/components/PollCard.svelte";
    import { page } from "$app/state";
    let { data } = $props();
    let copied = $state(false);
    async function copyLink() {
        await navigator.clipboard.writeText(window.location.href);
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
    class="relative isolate mx-auto w-11/12 max-w-6xl overflow-hidden rounded-3xl px-4 p-2 sm:p-4 sm:px-6"
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
    <header class="flex flex-wrap items-end justify-between gap-2 px-4 pb-8">
        <div>
            <h1
                class="my-3 max-w-3xl text-4xl sm:text-6xl leading-none font-black uppercase tracking-tighter"
            >
                {data.poll.name}
            </h1>
        </div>
        <div class="flex flex-wrap items-center gap-2">
            <a
                href={`/${data.poll.id}/edit`}
                class="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-line bg-white/5 px-5 text-xs font-bold text-ink transition hover:border-accent/40 hover:text-accent"
                ><Pencil class="size-4" /> Edit poll</a
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
    {#if data.poll.cards.length}
        <section
            class="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3"
            aria-label="Poll choices"
        >
            {#each data.poll.cards as card (card.id)}
                <PollCard {card} vote={data.votes[card.id]} />
            {/each}
        </section>
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
                The person who made it is adding choices. Check back in a little
                while.
            </p>
        </section>
    {/if}
</main>
