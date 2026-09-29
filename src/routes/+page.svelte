<script lang="ts">
    import { ArrowRight } from "@lucide/svelte";
    import { enhance } from "$app/forms";
    import { page } from "$app/state";
    let { form } = $props();
    let editMode = $state("password");
</script>

<svelte:head>
    <title>Pollish — Better decisions, together</title>
    <meta name="description" content="Make visual polls, share them with your people, and decide together." />
    <link rel="canonical" href={new URL('/', page.url).href} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={new URL('/', page.url).href} />
    <meta property="og:title" content="Pollish — Better decisions, together" />
    <meta property="og:description" content="Make visual polls, share them with your people, and decide together." />
    <meta property="og:image" content={new URL('/og-preview.png', page.url).href} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content={new URL('/', page.url).href} />
    <meta name="twitter:title" content="Pollish — Better decisions, together" />
    <meta name="twitter:description" content="Make visual polls, share them with your people, and decide together." />
    <meta name="twitter:image" content={new URL('/og-preview.png', page.url).href} />
</svelte:head>

<main class="mx-auto w-11/12 max-w-7xl">
    <section
        class="grid items-center gap-8 py-12 md:grid-cols-2 md:gap-8 lg:gap-12 md:py-8 lg:py-16"
    >
        <div class="min-w-0">
            <h1
                class="my-5 text-5xl sm:text-6xl leading-none font-black tracking-tighter md:text-7xl lg:text-8xl"
            >
                Big choices.<br />Better
                <em class="not-italic text-accent">together.</em>
            </h1>
            <p class="mb-8 max-w-lg text-sm text-muted sm:text-base">
                Create a visual poll. Share it. Decide together.
            </p>
            <div
                class="max-w-xl -rotate-1 rounded-2xl border border-line bg-surface/80 p-3 shadow-2xl sm:p-5 md:max-w-none"
                aria-label="Example visual poll preview"
            >
                <div class="mb-4 flex items-start justify-between">
                    <div>
                        <span
                            class="text-xs font-extrabold tracking-widest text-muted"
                            >THE GROUP PICK</span
                        >
                        <h2
                            class="mt-1 text-lg font-semibold uppercase tracking-tight"
                        >
                            Where should we go?
                        </h2>
                    </div>
                    <span
                        class="mt-1 text-xs font-extrabold tracking-widest text-muted"
                        >03 OPTIONS</span
                    >
                </div>
                <div class="grid grid-cols-3 gap-2">
                    <div
                        class="relative min-h-32 overflow-hidden rounded-xl border border-line bg-raised p-2 sm:min-h-36 sm:p-2.5 [&_strong]:block [&_strong]:truncate [&_strong]:text-xs [&_small]:mt-0.5 [&_small]:block [&_small]:truncate [&_small]:text-xs [&_small]:text-muted"
                    >
                        <span
                            class="mb-2 grid h-16 place-items-center rounded-lg text-3xl sm:h-20 bg-[radial-gradient(ellipse_at_50%_100%,#66816a_0_20%,transparent_21%),linear-gradient(140deg,#7c9c8c,#d8c6a2)] text-[#cbd4bb]"
                            >✳</span
                        >
                        <div>
                            <strong>Somewhere green</strong><small
                                >Cabin weekend</small
                            >
                        </div>
                        <span
                            class="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full border border-white/30 bg-black/50 text-xs text-white"
                            >♥</span
                        >
                    </div>
                    <div
                        class="relative min-h-32 overflow-hidden rounded-xl border border-line bg-raised p-2 sm:min-h-36 sm:p-2.5 [&_strong]:block [&_strong]:truncate [&_strong]:text-xs [&_small]:mt-0.5 [&_small]:block [&_small]:truncate [&_small]:text-xs [&_small]:text-muted"
                    >
                        <span
                            class="mb-2 grid h-16 place-items-center rounded-lg text-3xl sm:h-20 bg-[linear-gradient(160deg,#f6bb79_0_38%,#698e9c_39%_62%,#304e61_63%)] text-[#f3e8ca]"
                            >◒</span
                        >
                        <div>
                            <strong>By the water</strong><small>Beach day</small
                            >
                        </div>
                        <span
                            class="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full border border-white/30 bg-black/50 text-xs text-white"
                            >♥</span
                        >
                    </div>
                    <div
                        class="relative min-h-32 overflow-hidden rounded-xl border border-line bg-raised p-2 sm:min-h-36 sm:p-2.5 [&_strong]:block [&_strong]:truncate [&_strong]:text-xs [&_small]:mt-0.5 [&_small]:block [&_small]:truncate [&_small]:text-xs [&_small]:text-muted"
                    >
                        <span
                            class="mb-2 grid h-16 place-items-center rounded-lg text-3xl sm:h-20 bg-[radial-gradient(circle_at_25%_75%,#e88755_0_13%,transparent_14%),linear-gradient(140deg,#505e78,#c5866b)] text-[#ffe3bc]"
                            >✦</span
                        >
                        <div>
                            <strong>Little city break</strong><small
                                >Food &amp; wandering</small
                            >
                        </div>
                        <span
                            class="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full border border-white/30 bg-black/50 text-xs text-white"
                            >♥</span
                        >
                    </div>
                </div>
                <div class="mt-3 flex items-center gap-2 text-xs text-muted">
                    <span
                        class="flex pl-1 [&_i]:-ml-1 [&_i]:grid [&_i]:h-6 [&_i]:w-6 [&_i]:place-items-center [&_i]:rounded-full [&_i]:border-2 [&_i]:border-surface [&_i]:bg-[#c8a892] [&_i]:text-xs [&_i]:font-extrabold [&_i]:not-italic [&_i]:text-[#28231f] [&_i:nth-child(2)]:bg-[#aeb9a0] [&_i:nth-child(3)]:bg-[#a7b6c9] [&_i:nth-child(4)]:bg-raised"
                        ><i>A</i><i>J</i><i>M</i><i>+</i></span
                    ><span>Your group is deciding</span><span
                        class="ml-auto text-base text-accent">↗</span
                    >
                </div>
            </div>
        </div>
        <aside
            class="self-center p-5 sm:p-7 lg:p-9 rounded-3xl border border-line bg-surface/65 shadow-2xl backdrop-blur-xl backdrop-saturate-150 in-[.light]:border-white/40 in-[.light]:bg-white/15"
            id="create"
        >
            <h2
                class="mb-7 text-3xl leading-tight font-semibold tracking-tight"
            >
                What are we<br />deciding today?
            </h2>
            <form
                method="POST"
                action="?/create"
                use:enhance
                class="grid gap-2"
            >
                <label
                    class="mb-2 block text-xs font-bold tracking-wide text-muted"
                    for="poll-title">Your poll title</label
                >
                <input
                    class="min-h-12 w-full rounded-full border border-line bg-canvas/45 px-4 text-ink outline-none transition placeholder:text-muted/75 focus:border-accent focus:bg-surface/65 focus:ring-4 focus:ring-accent/15"
                    id="poll-title"
                    name="name"
                    maxlength="100"
                    placeholder="e.g. Pick our next adventure"
                    required
                    value={form?.name ?? ""}
                />
                <fieldset class="mt-4 grid gap-3">
                    <legend class="mb-2 text-xs font-bold text-muted"
                        >Who can edit?</legend
                    >
                    <label
                        class="flex cursor-pointer items-center gap-3 text-sm"
                        ><input
                            class="accent-accent"
                            type="radio"
                            name="edit_mode"
                            value="password"
                            bind:group={editMode}
                        /> People with the password</label
                    >
                    <label
                        class="flex cursor-pointer items-center gap-3 text-sm"
                        ><input
                            class="accent-accent"
                            type="radio"
                            name="edit_mode"
                            value="public"
                            bind:group={editMode}
                        /> Anyone with the poll link</label
                    >
                </fieldset>
                {#if editMode === "password"}
                    <div class="mt-2">
                        <label
                            class="mb-2 block text-xs font-bold text-muted"
                            for="create-password">Edit password</label
                        ><input
                            class="min-h-12 w-full rounded-full border border-line bg-canvas/45 px-4 text-ink outline-none placeholder:text-muted/75 focus:border-accent focus:ring-4 focus:ring-accent/15"
                            id="create-password"
                            name="password"
                            type="password"
                            minlength="8"
                            maxlength="128"
                            autocomplete="new-password"
                            placeholder="At least 8 characters"
                            required
                        />
                    </div>
                {/if}
                {#if form?.error}<p class="text-xs text-[#ff8f7b]" role="alert">
                        {form.error}
                    </p>{/if}
                <button
                    class="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border px-5 text-xs font-bold transition duration-200 hover:scale-105 border-transparent bg-accent text-[#17110d] shadow-lg shadow-accent/20 hover:bg-[#ff9256] mt-2 w-full"
                    type="submit"
                    >Create your poll <ArrowRight class="size-4" /></button
                >
            </form>
            <div
                class="mt-7 grid grid-cols-3 gap-2 border-t border-line pt-5 [&_span]:text-xs [&_span]:font-extrabold [&_span]:tracking-wide [&_span]:text-accent [&_p]:mt-1 [&_p]:text-xs [&_p]:text-muted"
                id="how-it-works"
            >
                <div>
                    <span>01</span>
                    <p>Add your ideas</p>
                </div>
                <div>
                    <span>02</span>
                    <p>Share the link</p>
                </div>
                <div>
                    <span>03</span>
                    <p>Choose together</p>
                </div>
            </div>
        </aside>
    </section>
</main>
