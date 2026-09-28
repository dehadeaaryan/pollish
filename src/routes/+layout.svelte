<script lang="ts">
    import "$lib/styles.css";
    import { ui } from "$lib/ui";
    import { Moon, Sun } from "@lucide/svelte";
    import { onMount } from "svelte";
    let { children } = $props();
    let light = $state(false);
    onMount(() => {
        light = localStorage.getItem("pollish-theme") === "light";
        document.documentElement.classList.toggle("light", light);
    });
    function toggleTheme() {
        light = !light;
        document.documentElement.classList.toggle("light", light);
        localStorage.setItem("pollish-theme", light ? "light" : "dark");
    }
</script>

<svelte:head>
    <title>Pollish — Better decisions, together</title>
    <meta
        name="description"
        content="Make visual polls, share them with your people, and decide together."
    />
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="apple-touch-icon" href="/aaryandehade-logo.png" />
</svelte:head>

<div
    class="relative isolate flex gap-2 md:gap-12 min-h-screen flex-col overflow-clip bg-canvas font-sans text-ink"
>
    <div
        class="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-canvas"
        aria-hidden="true"
    >
        <div class="ambient-orbit">
            <span class="ambient-blob blob-one"></span><span
                class="ambient-blob blob-two"
            ></span><span class="ambient-blob blob-three"></span>
        </div>
        <div class="grain-layer"></div>
    </div>
    <header
        class="sticky top-2 z-10 mx-auto mt-2 flex min-h-14 w-11/12 max-w-7xl items-center justify-between rounded-full border border-line bg-surface/50 p-2 pl-3 shadow-lg backdrop-blur-2xl backdrop-saturate-150 sm:top-3 sm:mt-3 sm:min-h-16 sm:pl-5 in-[.light]:border-white/40 in-[.light]:bg-white/15"
    >
        <a
            class="group inline-flex shrink-0 items-center gap-2 text-lg font-black tracking-tight transition hover:text-accent sm:gap-2.5 sm:text-xl"
            href="/"
            aria-label="Pollish home"
            ><img
                class="h-9 w-9 rounded-lg border border-white/20 shadow-md transition group-hover:-rotate-3 group-hover:scale-105 sm:h-10 sm:w-10"
                src="/aaryandehade-logo.png"
                alt=""
            /><span>Pollish<span class="text-accent">.</span></span></a
        >
        <nav
            class="flex items-center gap-1 sm:gap-2"
            aria-label="Main navigation"
        >
            <a
                class="hidden rounded-full px-4 py-2.5 text-xs font-bold text-muted transition hover:bg-white/10 hover:text-accent sm:block"
                href="/#how-it-works">How it works</a
            >
            <a
                class={`${ui.button} ${ui.secondary} min-h-9 px-3 text-xs sm:min-h-10 sm:px-4`}
                href="/#create"
                >Make a poll <span aria-hidden="true">↗</span></a
            >
            <button
                class="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-line bg-white/5 transition hover:scale-105 hover:bg-white/10 hover:text-accent sm:h-10 sm:w-10"
                onclick={toggleTheme}
                aria-label={light
                    ? "Switch to dark mode"
                    : "Switch to light mode"}
                >{#if light}<Moon class="size-4" />{:else}<Sun
                        class="size-4"
                    />{/if}</button
            >
        </nav>
    </header>
    {@render children()}
    <footer
        class="mx-auto mt-auto flex w-11/12 max-w-7xl flex-wrap items-center justify-end gap-5 border-t border-line py-6 text-xs text-muted sm:py-7"
    >
        <span>Aaryan Dehade · © {new Date().getFullYear()}</span>
    </footer>
</div>
