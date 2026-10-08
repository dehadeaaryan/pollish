<script lang="ts">
    import PollPreview from "$lib/components/PollPreview.svelte";
    import { ArrowRight } from "@lucide/svelte";
    import { enhance } from "$app/forms";
    import { page } from "$app/state";
    let { form } = $props();
    let editMode = $state("password");
</script>

<svelte:head>
    <title>Pollish — Visual polls</title>
    <meta name="description" content="Create and share visual polls." />
    <link rel="canonical" href={new URL('/', page.url).href} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={new URL('/', page.url).href} />
    <meta property="og:title" content="Pollish — Visual polls" />
    <meta property="og:description" content="Create and share visual polls." />
    <meta property="og:image" content={new URL('/og-preview.png', page.url).href} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Pollish visual poll with choices, vote counts, and voting buttons." />
    <meta name="twitter:image:alt" content="Pollish visual poll with choices, vote counts, and voting buttons." />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content={new URL('/', page.url).href} />
    <meta name="twitter:title" content="Pollish — Visual polls" />
    <meta name="twitter:description" content="Create and share visual polls." />
    <meta name="twitter:image" content={new URL('/og-preview.png', page.url).href} />
</svelte:head>

<main class="mx-auto w-11/12 max-w-7xl">
    <section
        class="grid items-center gap-8 py-12 md:grid-cols-2 md:gap-8 lg:gap-12 md:py-8 lg:py-16"
    >
        <div class="min-w-0">
            <h1 class="my-5 text-5xl sm:text-6xl leading-none font-black tracking-tighter md:text-7xl lg:text-8xl">
                Visual <em class="not-italic text-accent">polls.</em>
            </h1>
            <PollPreview />
        </div>
        <aside
            class="self-center p-5 sm:p-7 lg:p-9 rounded-3xl border border-line bg-surface/65 shadow-2xl backdrop-blur-xl backdrop-saturate-150 in-[.light]:border-white/40 in-[.light]:bg-white/15"
            id="create"
        >
            <h2
                class="mb-7 text-3xl leading-tight font-semibold tracking-tight"
            >
                Create a poll
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

        </aside>
    </section>
</main>
