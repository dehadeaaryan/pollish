<script lang="ts">
    import { Heart, ThumbsDown, ThumbsUp } from "@lucide/svelte";
    import { enhance } from "$app/forms";
    import type { PollCard } from "$lib/server/polls";
    let { card, vote, preview = false }: { card: PollCard; vote?: "yes" | "no"; preview?: boolean } = $props();
</script>

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
                            onsubmit={(event) => { if (preview) event.preventDefault(); }}
                            class="mt-4 flex gap-2"
                        >
                            <input
                                type="hidden"
                                name="card_id"
                                value={card.id}
                            /><button
                                class={`inline-flex min-h-10 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-line bg-white/5 px-2 text-xs font-bold text-muted transition hover:border-accent hover:text-ink ${vote === "yes" ? "border-sage bg-sage/15 text-sage" : ""}`}
                                disabled={preview}
                                name="choice"
                                value="yes"
                                ><ThumbsUp class="size-4" /> Love it</button
                            ><button
                                class={`inline-flex min-h-10 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-line bg-white/5 px-2 text-xs font-bold text-muted transition hover:border-accent hover:text-ink ${vote === "no" ? "border-sage bg-sage/15 text-sage" : ""}`}
                                disabled={preview}
                                name="choice"
                                value="no"
                                ><ThumbsDown class="size-4" /> Not for me</button
                            >
                        </form>
                    </div>
                </article>
