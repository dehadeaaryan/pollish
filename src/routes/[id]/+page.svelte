<script lang="ts">
    import {
        Check,
        Copy,
        Heart,
        Link2,
        Pencil,
        ThumbsDown,
        ThumbsUp,
    } from "@lucide/svelte";
    import { enhance } from "$app/forms";
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
                <article
                    class="overflow-hidden rounded-2xl border border-line bg-surface/65 shadow-2xl backdrop-blur-xl backdrop-saturate-150 in-[.light]:border-white/40 in-[.light]:bg-white/15"
                >
                    {#if card.image_path}<img
                            class="h-56 w-full object-cover sm:h-52"
                            src={`/media/${card.image_path}`}
                            alt=""
                        />{:else}<div
                            class="grid h-56 w-full place-items-center bg-[linear-gradient(145deg,#7d9175,#e2b88e_55%,#465c88)] text-white/70 sm:h-52"
                        >
                            <Heart class="size-7" strokeWidth={1.5} />
                        </div>{/if}
                    <div class="p-4 sm:p-5">
                        <div
                            class="[&_h2]:text-lg [&_h2]:font-bold [&_h2]:tracking-tight [&_p]:mt-1 [&_p]:text-xs [&_p]:leading-relaxed [&_p]:text-muted"
                        >
                            <h2>{card.title}</h2>
                            {#if card.description}<p>{card.description}</p>{/if}
                        </div>
                        <div class="mt-4 grid gap-2">
                            <div
                                class="flex items-center gap-2 text-xs [&_b]:text-right [&_b]:text-muted"
                            >
                                <span
                                    class="inline-flex w-14 items-center gap-1 text-sage"
                                    ><ThumbsUp class="size-3" /> Yes</span
                                ><span
                                    class="h-1 flex-1 overflow-hidden rounded-lg bg-raised [&_i]:block [&_i]:h-full [&_i]:rounded-lg [&_i]:bg-sage [&_i]:transition-[width]"
                                    ><i
                                        style={`width:${card.yes_count + card.no_count ? Math.round((card.yes_count / (card.yes_count + card.no_count)) * 100) : 0}%`}
                                    ></i></span
                                ><b class="w-5">{card.yes_count}</b>
                            </div>
                            <div
                                class="flex items-center gap-2 text-xs [&_b]:text-right [&_b]:text-muted [&>span:first-child]:text-muted [&_i]:bg-blue!"
                            >
                                <span
                                    class="inline-flex w-14 items-center gap-1 text-sage"
                                    ><ThumbsDown class="size-3" /> No</span
                                ><span
                                    class="h-1 flex-1 overflow-hidden rounded-lg bg-raised [&_i]:block [&_i]:h-full [&_i]:rounded-lg [&_i]:bg-sage [&_i]:transition-[width]"
                                    ><i
                                        style={`width:${card.yes_count + card.no_count ? Math.round((card.no_count / (card.yes_count + card.no_count)) * 100) : 0}%`}
                                    ></i></span
                                ><b class="w-5">{card.no_count}</b>
                            </div>
                        </div>
                        <form
                            method="POST"
                            action="?/vote"
                            use:enhance
                            class="mt-4 flex gap-2"
                        >
                            <input
                                type="hidden"
                                name="card_id"
                                value={card.id}
                            /><button
                                class={`inline-flex min-h-10 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-line bg-white/5 px-2 text-xs font-bold text-muted transition hover:border-accent hover:text-ink ${data.votes[card.id] === "yes" ? "border-sage bg-sage/15 text-sage" : ""}`}
                                name="choice"
                                value="yes"
                                ><ThumbsUp class="size-4" /> Love it</button
                            ><button
                                class={`inline-flex min-h-10 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-line bg-white/5 px-2 text-xs font-bold text-muted transition hover:border-accent hover:text-ink ${data.votes[card.id] === "no" ? "border-sage bg-sage/15 text-sage" : ""}`}
                                name="choice"
                                value="no"
                                ><ThumbsDown class="size-4" /> Not for me</button
                            >
                        </form>
                    </div>
                </article>
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
