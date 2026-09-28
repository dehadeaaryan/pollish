/** Shared Tailwind utilities for controls and surfaces used across pages. */
export const ui = {
  surface: 'rounded-3xl border border-line bg-surface/65 shadow-2xl backdrop-blur-xl backdrop-saturate-150 [.light_&]:border-white/40 [.light_&]:bg-white/15',
  button: 'inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-5 text-xs font-bold transition duration-200 hover:scale-105 cursor-pointer',
  primary: 'border-transparent bg-accent text-[#17110d] shadow-lg shadow-accent/20 hover:bg-[#ff9256]',
  secondary: 'border-line bg-white/5 text-ink backdrop-blur-md hover:border-accent/40 hover:bg-white/10 hover:text-accent',
  eyebrow: 'inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-muted',
  dot: 'h-2 w-2 rounded-full bg-sage shadow-sm shadow-sage/60',
  label: 'mb-2 block text-xs font-bold tracking-wide text-muted',
  input: 'min-h-12 w-full rounded-full border border-line bg-canvas/45 px-4 text-ink outline-none transition placeholder:text-muted/75 focus:border-accent focus:bg-surface/65 focus:ring-4 focus:ring-accent/15',
  iconButton: 'grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg border border-line text-muted transition hover:border-accent/40 hover:text-accent'
} as const;
