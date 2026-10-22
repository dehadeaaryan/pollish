<script lang="ts">
    import { Heart, X, ThumbsDown, ThumbsUp } from "@lucide/svelte";
    import type { SubmitFunction } from "@sveltejs/kit";
    import { enhance } from "$app/forms";
    import type { PollCard } from "$lib/server/polls";
    let { card, vote, preview = false, swipe = false, results = false, stacked = false, oncommit }: { card: PollCard; vote?: "yes" | "no"; preview?: boolean; swipe?: boolean; results?: boolean; stacked?: boolean; oncommit?: () => void } = $props();
    let pending = $state(false);
    let message = $state('');
    let failed = $state(false);
    let x = $state(0);
    const swipePower = $derived(swipe ? Math.min(Math.abs(x) / 110, 1) : 0);
    let startX = 0;
    let startY = 0;
    let dragging = $state(false);
    let votingForm = $state<HTMLFormElement>();
    const submit: SubmitFunction = ({ cancel, formData }) => {
        if (preview || pending) { cancel(); return; }
        pending = true; failed = false; message = 'Saving your vote…';
        const choice = formData.get('choice');
        return async ({ result, update }) => {
            if (result.type === 'success') {
                if (swipe) {
                    oncommit?.();
                    x = choice === 'yes' ? 500 : -500;
                    await new Promise(resolve => setTimeout(resolve, 280));
                }
                await update({ reset: false });
                message = choice === 'remove' ? 'Vote removed.' : 'Saved.';
                setTimeout(() => message = '', 1800);
            } else {
                failed = true;
                message = result.type === 'failure' ? String(result.data?.voteError ?? 'Vote not saved. Please try again.') : 'Could not connect. Check your connection and try again.';
            }
            pending = false; x = 0;
        };
    };
    function start(event: PointerEvent) {
        if (!swipe || pending || event.button !== 0 || (event.target as HTMLElement).closest('button, a')) return;
        startX = event.clientX; startY = event.clientY; dragging = true;
        (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    }
    function move(event: PointerEvent) {
        if (!dragging) return;
        if (Math.abs(event.clientY - startY) > Math.abs(event.clientX - startX) + 20) { dragging = false; x = 0; return; }
        x = event.clientX - startX;
    }
    function end() {
        if (!dragging) return;
        dragging = false;
        if (Math.abs(x) >= 85) { votingForm?.requestSubmit(votingForm.querySelector<HTMLButtonElement>(`button[value="${x > 0 ? 'yes' : 'no'}"]`)!); return; }
        x = 0;
    }
</script>

                <article
                    style:background-color={stacked ? "var(--surface)" : undefined}
                    class:swipe-card={swipe}
                    class:dragging
                    style:--swipe-power={swipePower}
                    style:--swipe-rgb={x < 0 ? '255 112 139' : '94 255 184'}
                    style:--glow-origin={x < 0 ? '0%' : '100%'}
                    style:--yes-power={x > 0 ? swipePower : 0}
                    style:--no-power={x < 0 ? swipePower : 0}
                    style:transform={swipe ? `translateX(${x}px) rotate(${x / 22}deg)` : undefined}
                    onpointerdown={start} onpointermove={move} onpointerup={end}
                    onpointercancel={() => { dragging = false; x = 0; }}
                    class="overflow-hidden rounded-2xl border border-line bg-surface/65 shadow-2xl backdrop-blur-xl backdrop-saturate-150 in-[.light]:border-white/40 in-[.light]:bg-white/15"
                >
                    {#if swipe && Math.abs(x) > 25}<span class="swipe-stamp" class:negative={x < 0}>{x > 0 ? 'LOVE IT' : 'NOT FOR ME'}</span>{/if}
                    {#if card.image_path}<img
                            class="h-56 w-full object-cover sm:h-52"
                            src={`/media/${card.image_path}`}
                            alt="" draggable="false"
                        />{:else}<div
                            class="grid h-56 w-full place-items-center bg-[linear-gradient(145deg,#7d9175,#e2b88e_55%,#465c88)] text-white/70 sm:h-52"
                        >
                            <Heart class="size-10" strokeWidth={1.5} />
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
                        {#if !results}<form
                            bind:this={votingForm}
                            method="POST"
                            action="?/vote"
                            use:enhance={submit}
                            onsubmit={(event) => { if (preview) event.preventDefault(); }}
                            class="vote-actions mt-5 flex justify-center gap-5"
                        >
                            <input
                                type="hidden"
                                name="card_id"
                                value={card.id}
                            /><button
                                class="vote-button vote-no"
                                disabled={preview || pending} aria-label="Not for me" aria-pressed={vote === "no"} class:selected-no={vote === "no"} title={vote === "no" ? "Remove your vote" : "Not for me"}
                                name="choice"
                                value={vote === "no" ? "remove" : "no"}
                                ><X class="size-6" strokeWidth={vote === "no" ? 3.5 : 2.2} /></button
                            ><button
                                class="vote-button vote-yes"
                                disabled={preview || pending} aria-label="Love it" aria-pressed={vote === "yes"} class:selected-yes={vote === "yes"} title={vote === "yes" ? "Remove your vote" : "Love it"}
                                name="choice"
                                value={vote === "yes" ? "remove" : "yes"}
                                ><Heart class="size-6" strokeWidth={2.2} fill={vote === "yes" ? "currentColor" : "none"} /></button
                            >
                        </form>{/if}
                        {#if !preview && message}<p class="mt-3 text-xs text-muted" class:sr-only={swipe && !failed} role={failed ? 'alert' : 'status'}>{message}</p>{/if}
                    </div>
                </article>

<style>
.swipe-card {
    position: relative; touch-action: pan-y; user-select: none; cursor: grab;
    border-color: color-mix(in srgb, rgb(var(--swipe-rgb)) calc(var(--swipe-power) * 70%), var(--line));
    box-shadow: 0 0 22px rgb(var(--swipe-rgb) / calc(var(--swipe-power) * .24)), 0 0 65px rgb(var(--swipe-rgb) / calc(var(--swipe-power) * .12)), 0 20px 35px #0003;
    transition: transform 280ms cubic-bezier(.2,.7,.2,1), border-color 180ms ease, box-shadow 180ms ease;
}
.swipe-card::after {
    content: ''; position: absolute; inset: 0; z-index: 1; pointer-events: none; border-radius: inherit;
    background: radial-gradient(ellipse at var(--glow-origin) 70%, rgb(var(--swipe-rgb) / .22), transparent 75%), linear-gradient(rgb(var(--swipe-rgb) / .04), rgb(var(--swipe-rgb) / .09));
    box-shadow: inset 0 0 28px rgb(var(--swipe-rgb) / .12);
    opacity: var(--swipe-power); transition: opacity 180ms ease;
}
.swipe-card .vote-actions { position: relative; z-index: 2; }
.swipe-card .vote-yes { --button-power: var(--yes-power); --button-rgb: 94 255 184; }
.swipe-card .vote-no { --button-power: var(--no-power); --button-rgb: 255 112 139; }
.swipe-card .vote-button {
    background: color-mix(in srgb, rgb(var(--button-rgb)) calc(var(--button-power) * 85%), var(--surface-raised));
    color: color-mix(in srgb, #102019 calc(var(--button-power) * 100%), rgb(var(--button-rgb)));
    border-color: color-mix(in srgb, rgb(var(--button-rgb)) calc(var(--button-power) * 100%), var(--line));
    box-shadow: 0 0 18px rgb(var(--button-rgb) / calc(var(--button-power) * .5)), 0 0 38px rgb(var(--button-rgb) / calc(var(--button-power) * .2));
    scale: calc(1 + var(--button-power) * .12);
}
.swipe-card .vote-yes :global(svg) { fill: color-mix(in srgb, currentColor calc(var(--yes-power) * 100%), transparent); }
.swipe-card.dragging::after, .swipe-card.dragging .vote-button { transition-duration: 40ms; }
.swipe-card.dragging { cursor: grabbing; transition: none; }
.swipe-stamp { position: absolute; z-index: 2; top: 24px; left: 20px; padding: 8px 12px; border: 3px solid #b7c5a4; border-radius: 8px; color: #b7c5a4; background: #141414df; font-weight: 900; transform: rotate(-12deg); }
.swipe-stamp.negative { left: auto; right: 20px; color: #ff8f7b; border-color: #ff8f7b; transform: rotate(12deg); }
.selected-yes { background: #b7c5a4 !important; color: #182015 !important; border-color: #b7c5a4 !important; box-shadow: 0 0 0 2px #b7c5a433; }
.selected-no { background: #f2a08e !important; color: #35150f !important; border-color: #f2a08e !important; box-shadow: 0 0 0 2px #f2a08e33; }
.vote-button { display: grid; place-items: center; width: 56px; height: 56px; border-radius: 50%; border: 1.5px solid var(--line); background: var(--surface-raised); transition: transform 240ms cubic-bezier(.34,1.56,.64,1), background-color 180ms ease, box-shadow 180ms ease; }
.vote-yes { color: var(--sage); }
.vote-no { color: #f2a08e; }
.vote-button:focus-visible { outline-offset: 5px; }
@media (hover: hover) {
    .vote-button:not(:disabled):hover { transform: translateY(-3px) rotate(-7deg) scale(1.08); border-color: currentColor; box-shadow: 0 6px 20px #0002; }
    .vote-no:not(:disabled):hover { transform: translateY(-3px) rotate(7deg) scale(1.08); }
}
.vote-button:not(:disabled):active { transform: scale(.88); }
</style>
