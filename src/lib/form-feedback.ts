import type { SubmitFunction } from '@sveltejs/kit';

/** Keep drafts in place on failure and announce the outcome beside the submitting form. */
export const formFeedback: SubmitFunction = ({ formElement, cancel, action }) => {
    if (formElement.dataset.saving) { cancel(); return; }
    formElement.dataset.saving = 'true';
    let status = formElement.querySelector<HTMLElement>('[data-feedback]');
    if (!status) {
        status = document.createElement('p');
        status.dataset.feedback = 'true';
        status.className = 'w-full text-sm text-muted';
        formElement.append(status);
    }
    status.setAttribute('role', 'status');
    status.textContent = 'Saving…';
    const buttons = [...formElement.querySelectorAll<HTMLButtonElement>('button[type="submit"], button:not([type])')];
    buttons.forEach(button => button.disabled = true);
    return async ({ result, update }) => {
        try {
            if (result.type === 'error' || result.type === 'failure') {
                status!.setAttribute('role', 'alert');
                status!.textContent = result.type === 'failure' ? String(result.data?.error ?? 'Could not save. Please try again.') : 'Could not save. Check your connection and try again. Your entries are still here.';
            } else {
                await update({ reset: action.search.includes('/addCard') });
                status!.textContent = action.search.includes('/addCard') ? 'Choice added. Add another or open your poll.' : 'Saved.';
            }
        } finally {
            delete formElement.dataset.saving;
            buttons.forEach(button => button.disabled = false);
        }
    };
};
