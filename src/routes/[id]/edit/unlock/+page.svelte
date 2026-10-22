<script lang="ts">
  import { ArrowLeft, LockKeyhole, ArrowRight } from '@lucide/svelte';
  import { formFeedback } from "$lib/form-feedback";
    import { enhance } from '$app/forms';
  import { ui } from '$lib/ui';
  let { data, form } = $props();
</script>

<svelte:head><title>Edit {data.pollName} — Pollish</title><meta name="robots" content="noindex, nofollow" /></svelte:head>

<main class="mx-auto flex w-11/12 max-w-lg flex-1 flex-col justify-center py-6 sm:py-10">
  <a class="mb-5 inline-flex items-center gap-2 self-start text-sm text-muted hover:text-ink" href={`/${data.pollId}`}><ArrowLeft class="size-4" /> Back to poll</a>
  <section class={`${ui.surface} p-5 sm:p-8`}>
    <div class="mb-6 grid size-12 place-items-center rounded-2xl border border-accent/30 bg-accent/10 text-accent"><LockKeyhole class="size-5" /></div>
    <span class={ui.eyebrow}>EDIT ACCESS</span>
    <h1 class="my-4 text-3xl font-bold uppercase tracking-tight">Edit {data.pollName}</h1>
    {#if data.hasPassword}
      <p class="mb-6 text-sm leading-relaxed text-muted">Enter the edit password to change this poll. You don’t need a password to vote or see results.</p>
      <form method="POST" use:enhance={formFeedback} class="grid gap-4">
        <div><label class={ui.label} for="edit-password">Edit password</label><input class={ui.input} id="edit-password" name="password" type="password" autocomplete="current-password" required /></div>
        {#if form?.error}<p class="text-sm text-red-400" role="alert">{form.error}</p>{/if}
        <button class={`${ui.button} ${ui.primary} w-full`} type="submit">Unlock editor <ArrowRight class="size-4" /></button>
      </form>
    {:else}
      <p class="text-sm leading-relaxed text-muted">This poll uses a private edit link. Use the link saved by the creator to manage this poll. You can still vote and see results without it.</p>
    {/if}
  </section>
</main>
