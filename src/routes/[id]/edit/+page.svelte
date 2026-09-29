<script lang="ts">
	import { ArrowLeft, ArrowUpRight, Check, Copy, ImagePlus, Link2, Plus, Trash2 } from '@lucide/svelte';
	import { enhance } from '$app/forms';
	let { data, form } = $props();
	let shareCopied = $state(false);
	let editCopied = $state(false);
	let origin = $state('');
	let backgroundPreview = $state('');
	let cardPreview = $state('');
	let accessMode = $state<'private' | 'password' | 'public'>('private');
	let backgroundChoice = $state<'image' | 'color'>('image');
	let selectedColor = $state('#465c88');
	$effect(() => { accessMode = data.editMode; });
	$effect(() => { backgroundChoice = data.poll.background_color ? 'color' : 'image'; selectedColor = data.poll.background_color ?? '#465c88'; });
	let backgroundInput = $state<HTMLInputElement>();
	let cardInput = $state<HTMLInputElement>();
	$effect(() => { if (typeof window !== 'undefined') origin = window.location.origin; });
	async function copy(value: string, which: 'share' | 'edit') {
		await navigator.clipboard.writeText(value);
		if (which === 'share') { shareCopied = true; setTimeout(() => shareCopied = false, 1800); }
		else { editCopied = true; setTimeout(() => editCopied = false, 1800); }
	}
	function preview(event: Event, kind: 'background' | 'card') {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		const url = URL.createObjectURL(file);
		if (kind === 'background') backgroundPreview = url; else cardPreview = url;
	}
</script>

<svelte:head><title>Edit {data.poll.name.toUpperCase()} — Pollish</title><meta name="robots" content="noindex, nofollow" /></svelte:head>

<main class="mx-auto w-11/12 max-w-7xl py-7 sm:pt-10 sm:pb-20">
	<div class="mb-6"><a class="inline-flex items-center gap-2 text-xs font-bold text-muted hover:text-ink" href="/"><ArrowLeft class="size-3.5" /> All Pollish</a></div>
	<section class="mb-8 flex flex-wrap items-end justify-between gap-6"><div><h1 class="text-5xl font-black uppercase leading-none tracking-tighter sm:text-6xl">POLL BUILDER</h1><p class="mt-4 text-sm font-bold uppercase tracking-wide text-accent">{data.poll.name}</p></div><div class="flex flex-wrap gap-2"><a class="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border px-5 text-xs font-bold transition duration-200 hover:scale-105 border-transparent bg-accent text-[#17110d] shadow-lg shadow-accent/20 hover:bg-[#ff9256]" href={`/${data.poll.id}`}><ArrowUpRight class="size-4" /> Preview poll</a><button class="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border px-5 text-xs font-bold transition duration-200 hover:scale-105 border-line bg-white/5 text-ink backdrop-blur-md hover:border-accent/40 hover:bg-white/10 hover:text-accent" onclick={() => copy(`${origin}/${data.poll.id}`, 'share')}>{#if shareCopied}<Check class="size-4" /> Link copied{:else}<Copy class="size-4" /> Copy share link{/if}</button></div></section>
	{#if form?.error}<p class="-mt-3 mb-5 text-xs text-[#ff8f7b]" role="alert">{form.error}</p>{/if}
	<div class="grid items-start gap-4 lg:grid-cols-3">
		<div class="grid gap-4 lg:col-span-2">
			<section class="p-4 sm:p-6 rounded-2xl border border-line bg-surface/65 shadow-2xl backdrop-blur-xl backdrop-saturate-150 [.light_&]:border-white/40 [.light_&]:bg-white/15">
				<div class="mb-5 flex items-start gap-3 [&_h2]:text-base [&_h2]:font-bold [&_p]:mt-1 [&_p]:text-xs [&_p]:text-muted"><span class="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-accent/30 bg-accent/10 text-xs font-extrabold text-accent">01</span><div><h2>Name your poll</h2><p>Start with a question people can answer.</p></div></div>
				<form method="POST" action="?/update" use:enhance class="grid gap-2"><input type="hidden" name="key" value={data.editKey} /><label class="mb-2 block text-xs font-bold tracking-wide text-muted" for="poll-name">Poll title</label><div class="flex gap-2 [&_input]:min-w-0 [&_input]:flex-1"><input class="min-h-12 w-full rounded-full border border-line bg-canvas/45 px-4 text-ink outline-none transition placeholder:text-muted/75 focus:border-accent focus:bg-surface/65 focus:ring-4 focus:ring-accent/15 uppercase" id="poll-name" name="name" maxlength="100" value={data.poll.name.toUpperCase()} required /><button class="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border px-5 text-xs font-bold transition duration-200 hover:scale-105 border-line bg-white/5 text-ink backdrop-blur-md hover:border-accent/40 hover:bg-white/10 hover:text-accent" type="submit">Save title</button></div></form>
			</section>
			<section class="p-4 sm:p-6 rounded-2xl border border-line bg-surface/65 shadow-2xl backdrop-blur-xl backdrop-saturate-150 [.light_&]:border-white/40 [.light_&]:bg-white/15">
				<div class="mb-5 flex items-start gap-3 [&_h2]:text-base [&_h2]:font-bold [&_p]:mt-1 [&_p]:text-xs [&_p]:text-muted"><span class="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-accent/30 bg-accent/10 text-xs font-extrabold text-accent">02</span><div><h2>Add your choices</h2><p>Give each option a name and a picture.</p></div><span class="ml-auto rounded-full border border-line px-2.5 py-1.5 text-xs text-muted">{data.poll.cards.length} {data.poll.cards.length === 1 ? 'choice' : 'choices'}</span></div>
				{#if data.poll.cards.length}<div class="mb-4 grid gap-2">{#each data.poll.cards as card, index (card.id)}<article class="flex min-h-16 items-center gap-3 rounded-xl border border-line bg-canvas/40 p-2"><div class="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-[linear-gradient(135deg,#778c78,#c69d81)] text-xs font-extrabold text-white [&_img]:h-full [&_img]:w-full [&_img]:object-cover">{#if card.image_path}<img src={`/media/${card.image_path}`} alt="" />{:else}<span>{String(index + 1).padStart(2, '0')}</span>{/if}</div><div class="grid min-w-0 flex-1 gap-1 [&_strong]:truncate [&_strong]:text-xs [&_small]:truncate [&_small]:text-xs [&_small]:text-muted"><strong>{card.title}</strong>{#if card.description}<small>{card.description}</small>{/if}</div><span class="hidden whitespace-nowrap text-xs text-muted sm:block">{card.yes_count + card.no_count} picks</span><form method="POST" action="?/removeCard" use:enhance><input type="hidden" name="key" value={data.editKey} /><input type="hidden" name="card_id" value={card.id} /><button class="grid h-9 w-9 cursor-pointer place-items-center rounded-lg border border-line text-muted transition hover:border-[#ff766355] hover:text-[#ff8f7b]" aria-label={`Remove ${card.title}`} title="Remove choice"><Trash2 class="size-4" /></button></form></article>{/each}</div>{:else}<div class="mb-4 flex items-center gap-3 rounded-xl border border-dashed border-line p-4 text-xs leading-relaxed text-muted"><div class="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-raised text-accent"><ImagePlus class="size-4.5" /></div><p>Your choices will show up here. Add at least two so your group has something to weigh in on.</p></div>{/if}
				<form method="POST" action="?/addCard" enctype="multipart/form-data" use:enhance class="grid gap-3 rounded-xl border border-line bg-raised/55 p-4"><input type="hidden" name="key" value={data.editKey} /><div class="grid gap-3 sm:grid-cols-2 [&_label_span]:font-normal"><div><label class="mb-2 block text-xs font-bold tracking-wide text-muted" for="choice-title">Choice name</label><input class="min-h-12 w-full rounded-full border border-line bg-canvas/45 px-4 text-ink outline-none transition placeholder:text-muted/75 focus:border-accent focus:bg-surface/65 focus:ring-4 focus:ring-accent/15" id="choice-title" name="title" maxlength="120" placeholder="e.g. Cabin in the woods" required /></div><div><label class="mb-2 block text-xs font-bold tracking-wide text-muted" for="choice-description">A little detail <span>(optional)</span></label><input class="min-h-12 w-full rounded-full border border-line bg-canvas/45 px-4 text-ink outline-none transition placeholder:text-muted/75 focus:border-accent focus:bg-surface/65 focus:ring-4 focus:ring-accent/15" id="choice-description" name="description" maxlength="280" placeholder="What makes it special?" /></div></div><input bind:this={cardInput} class="sr-only" type="file" name="image" accept="image/jpeg,image/png,image/webp,image/gif" onchange={(event) => preview(event, 'card')} /><button class="flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-lg border border-dashed border-line px-3 py-1.5 text-left text-accent [&_img]:h-10 [&_img]:w-10 [&_img]:rounded-lg [&_img]:object-cover [&_small]:block [&_small]:text-xs [&_small]:font-medium [&_small]:text-muted" type="button" onclick={() => cardInput?.click()}>{#if cardPreview}<img src={cardPreview} alt="Selected choice" />{:else}<ImagePlus class="size-4" />{/if}<span class="grid flex-1 gap-1 text-xs font-bold">{cardPreview ? 'Image ready' : 'Add an image'}<small>JPG, PNG, WebP or GIF · up to 8 MB</small></span><span class="text-xs text-muted">Browse</span></button><button class="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border px-5 text-xs font-bold transition duration-200 hover:scale-105 border-transparent bg-accent text-[#17110d] shadow-lg shadow-accent/20 hover:bg-[#ff9256] min-h-10 justify-self-end px-4 text-xs" type="submit"><Plus class="size-4" /> Add choice</button></form>
			</section>
			<section class="rounded-2xl border border-line bg-surface/65 p-4 shadow-2xl backdrop-blur-xl sm:p-6">
				<div class="mb-5 flex items-start gap-3 [&_h2]:text-base [&_h2]:font-bold [&_p]:mt-1 [&_p]:text-xs [&_p]:text-muted"><span class="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-accent/30 bg-accent/10 text-xs font-extrabold text-accent">03</span><div><h2>Background</h2><p>Optional image or color.</p></div></div>
				<fieldset class="mb-4 flex flex-wrap gap-4 text-sm">
					<legend class="sr-only">Background type</legend>
					<label class="flex cursor-pointer items-center gap-2"><input class="accent-accent" type="radio" value="image" bind:group={backgroundChoice} /> Image</label>
					<label class="flex cursor-pointer items-center gap-2"><input class="accent-accent" type="radio" value="color" bind:group={backgroundChoice} /> Solid color</label>
				</fieldset>
				{#if backgroundChoice === 'image'}
					{#if backgroundPreview || data.poll.background_path}<div class="mb-4 h-32 rounded-xl bg-cover bg-center" style={`background-image: linear-gradient(90deg, color-mix(in srgb, var(--canvas) 76%, transparent), transparent), url('${backgroundPreview || `/media/${data.poll.background_path}`}')`}></div>{/if}
					<form method="POST" action="?/background" enctype="multipart/form-data" use:enhance class="flex flex-wrap items-center gap-2">
						<input type="hidden" name="key" value={data.editKey} />
						<input bind:this={backgroundInput} class="sr-only" type="file" name="image" accept="image/jpeg,image/png,image/webp,image/gif" required onchange={(event) => preview(event, 'background')} />
						<button class="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-line bg-white/5 px-4 text-xs font-bold hover:border-accent/40" type="button" onclick={() => backgroundInput?.click()}><ImagePlus class="size-4" /> Choose image</button>
						<button class="inline-flex min-h-10 items-center justify-center rounded-full bg-accent px-4 text-xs font-bold text-[#17110d]" type="submit">Save image</button>
					</form>
				{:else}
					<div class="mb-4 h-32 rounded-xl border border-line" style:background-color={selectedColor}></div>
					<form method="POST" action="?/backgroundColor" use:enhance class="flex flex-wrap items-center gap-3">
						<input type="hidden" name="key" value={data.editKey} />
						<label class="text-xs font-bold text-muted" for="background-color">Color</label>
						<input class="size-12 cursor-pointer rounded-xl border border-line bg-transparent p-1" id="background-color" name="color" type="color" bind:value={selectedColor} />
						<button class="inline-flex min-h-10 items-center justify-center rounded-full bg-accent px-4 text-xs font-bold text-[#17110d]" type="submit">Save color</button>
					</form>
				{/if}
				{#if data.poll.background_path || data.poll.background_color}<form method="POST" action="?/removeBackground" use:enhance><input type="hidden" name="key" value={data.editKey} /><button class="mt-4 cursor-pointer text-xs text-[#ff8f7b] hover:underline" type="submit">Remove background</button></form>{/if}
			</section>
		</div>
		<aside class="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
			<section class="p-4 sm:p-6 rounded-2xl border border-line bg-surface/65 shadow-2xl backdrop-blur-xl backdrop-saturate-150 [.light_&]:border-white/40 [.light_&]:bg-white/15"><span class="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-accent"><Link2 class="size-3" /> SHARE YOUR POLL</span><h2 class="my-4 text-2xl leading-tight font-semibold tracking-tight">Bring everyone<br />into the decision.</h2><p class="text-xs leading-relaxed text-muted">Anyone with this link can see the choices and vote. Use the Edit button on the poll page to open the editor.</p><div class="mt-5 flex items-center justify-between gap-2 rounded-xl border border-line py-2 pr-2 pl-3 text-xs text-muted [&_span]:truncate"><span>{origin}/{data.poll.id.slice(0, 8)}…</span><button class="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg border border-line text-muted transition hover:border-accent/40 hover:text-accent" onclick={() => copy(`${origin}/${data.poll.id}`, 'share')} aria-label="Copy share link"><Copy class="size-3.5" /></button></div><button class="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border px-5 text-xs font-bold transition duration-200 hover:scale-105 border-transparent bg-accent text-[#17110d] shadow-lg shadow-accent/20 hover:bg-[#ff9256] mt-2 w-full min-h-10 text-xs" onclick={() => copy(`${origin}/${data.poll.id}`, 'share')}>{#if shareCopied}<Check class="size-4" /> Copied to clipboard{:else}<Copy class="size-4" /> Copy poll link{/if}</button>{#if data.isOwner}<div class="mt-4 grid gap-2 border-t border-line pt-4 [&>span]:text-xs [&>span]:font-extrabold [&>span]:tracking-widest [&>span]:text-muted [&_button]:inline-flex [&_button]:items-center [&_button]:gap-2 [&_button]:justify-self-start [&_button]:text-xs [&_button]:font-bold"><span>PRIVATE EDIT LINK</span><button onclick={() => copy(`${origin}/${data.poll.id}/edit?k=${data.editKey}`, 'edit')}>{#if editCopied}<Check class="size-3" /> Edit link copied{:else}<Copy class="size-3" /> Copy edit access{/if}</button></div>{/if}</section>
			{#if data.isOwner}
			<section class="rounded-2xl border border-line bg-surface/65 p-4 shadow-2xl backdrop-blur-xl sm:p-6">
				<span class="text-xs font-extrabold uppercase tracking-widest text-accent">EDITING ACCESS</span>
				<h2 class="my-3 text-xl font-semibold tracking-tight">Who can edit?</h2>
				<p class="mb-5 text-xs leading-relaxed text-muted">Choose a password, let anyone with the link edit, or keep the private edit link only. Only the private link can change access or delete this poll.</p>
				<form method="POST" action="?/access" use:enhance class="grid gap-4">
					<input type="hidden" name="key" value={data.editKey} />
					<fieldset class="grid gap-3 text-sm">
						<legend class="sr-only">Editing mode</legend>
						<label class="flex cursor-pointer items-center gap-3"><input class="accent-accent" type="radio" name="edit_mode" value="password" bind:group={accessMode} /> Password protected</label>
						<label class="flex cursor-pointer items-center gap-3"><input class="accent-accent" type="radio" name="edit_mode" value="public" bind:group={accessMode} /> Public editing</label>
						<label class="flex cursor-pointer items-center gap-3"><input class="accent-accent" type="radio" name="edit_mode" value="private" bind:group={accessMode} /> Private edit link only</label>
					</fieldset>
					{#if accessMode === 'password'}
						<div><label class="mb-2 block text-xs font-bold text-muted" for="new-edit-password">{data.hasPassword ? 'New password (leave blank to keep current)' : 'New edit password'}</label><input class="min-h-12 w-full rounded-full border border-line bg-canvas/45 px-4 text-ink outline-none placeholder:text-muted/75 focus:border-accent focus:ring-4 focus:ring-accent/15" id="new-edit-password" name="password" type="password" minlength="8" maxlength="128" autocomplete="new-password" placeholder="At least 8 characters" required={!data.hasPassword} /></div>
					{/if}
					<button class="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-5 text-xs font-bold text-[#17110d] transition hover:scale-105" type="submit">Save access</button>
				</form>
			</section>
			{/if}
			<section class="flex items-start gap-3 rounded-xl border border-sage/15 bg-sage/5 p-4 [&_strong]:text-xs [&_p]:mt-1 [&_p]:text-xs [&_p]:leading-relaxed [&_p]:text-muted"><span class="text-sage">✳</span><div><strong>Good polls have a few good options.</strong><p>Keep each choice clear and add a picture to make the difference easy to imagine.</p></div></section>
			{#if data.isOwner}<form method="POST" action="?/deletePoll" use:enhance onsubmit={(event) => { if (!confirm('Delete this poll and all its choices? This cannot be undone.')) event.preventDefault(); }}><input type="hidden" name="key" value={data.editKey} /><button class="inline-flex cursor-pointer items-center gap-2 py-2 text-xs text-muted hover:text-[#ff8f7b]" type="submit"><Trash2 class="size-3.5" /> Delete this poll</button></form>{/if}
		</aside>
	</div>
</main>
