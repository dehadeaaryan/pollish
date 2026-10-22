import { test, expect } from '@playwright/test';

test('phone creator → shared link → swipe, recovery, changed votes and results', async ({ page, browser }) => {
  await page.goto('/');
  await page.getByLabel('Your poll title').fill('Weekend journey test');
  await page.getByLabel('Edit password', { exact: true }).fill('test-password');
  await page.getByRole('button', { name: 'Create your poll' }).click();
  await expect(page.getByRole('heading', { name: 'POLL BUILDER' })).toBeVisible();
  const editURL = page.url();
  const pollURL = new URL(editURL).pathname.replace('/edit', '');
  await expect(page.getByText('Add choices before sharing', { exact: false })).toBeVisible();
  for (const title of ['Cabin weekend', 'Beach day']) {
    await page.getByLabel('Choice name').fill(title);
    await page.getByRole('button', { name: 'Add choice', exact: true }).click();
    await expect(page.getByText(title, { exact: true })).toBeVisible();
  }
  await page.screenshot({ path: '/tmp/pollish-builder-phone.png', fullPage: true, animations: 'disabled' });
  const voter = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const guest = await voter.newPage();
  await guest.goto(pollURL);
  await expect(guest.getByRole('link', { name: 'Edit with password' })).toBeVisible();
  await guest.getByRole('link', { name: 'Edit with password' }).click();
  await guest.getByLabel('Edit password', { exact: true }).fill('wrong-password');
  await guest.getByRole('button', { name: 'Unlock editor' }).click();
  await expect(guest.getByRole('alert')).toContainText('did not match');
  await guest.getByRole('link', { name: 'Back to poll' }).click();
  await guest.getByRole('button', { name: 'Swipe', exact: true }).click();
  await guest.screenshot({ path: '/tmp/pollish-swipe-phone.png', fullPage: true, animations: 'disabled' });
  await guest.route('**/*?/vote', route => route.abort());
  await guest.getByRole('button', { name: 'Love it', exact: true }).click();
  await expect(guest.getByRole('alert')).toContainText('Could not connect');
  await expect(guest.getByRole('heading', { name: 'Cabin weekend' })).toBeVisible();
  await guest.unroute('**/*?/vote');
  // Real touch events in mobile Chromium, including the horizontal gesture.
  const card = guest.locator('.swipe-card');
  await card.scrollIntoViewIfNeeded();
  const touchBox = await card.boundingBox();
  const cdp = await voter.newCDPSession(guest);
  const tx = touchBox!.x + 100, ty = touchBox!.y + 80;
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: tx, y: ty }] });
  for (let step = 1; step <= 6; step++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: tx + step * 20, y: ty + 2 }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(guest.getByRole('heading', { name: 'Beach day' })).toBeVisible();
  await guest.getByRole('button', { name: 'Not for me', exact: true }).click();
  await expect(guest.getByRole('heading', { name: 'You’re all done!' })).toBeVisible();
  await guest.getByRole('button', { name: 'See results' }).click();
  await expect(guest.getByText('2 votes across all choices', { exact: false })).toBeVisible();
  await guest.getByRole('button', { name: 'Cards', exact: true }).click();
  await guest.getByRole('article').filter({ hasText: 'Cabin weekend' }).getByRole('button', { name: 'Not for me' }).click();
  await expect(guest.getByRole('button', { name: 'Not for me', pressed: true })).toHaveCount(2);
  await guest.reload();
  await expect(guest.getByText('2 of 2 choices answered')).toBeVisible();
  await guest.getByRole('button', { name: 'Results', exact: true }).click();
  await guest.screenshot({ path: '/tmp/pollish-results-phone.png', fullPage: true, animations: 'disabled' });
  expect(await guest.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.goto(pollURL);
  await expect(page.getByRole('link', { name: 'Edit poll', exact: true })).toBeVisible();
  // Separate desktop visitor uses a real mouse drag.
  const desktop = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const desk = await desktop.newPage();
  await desk.goto(pollURL);
  await desk.getByRole('button', { name: 'Swipe', exact: true }).click();
  const box = await desk.locator('.swipe-card').boundingBox();
  await desk.mouse.move(box!.x + 160, box!.y + 90);
  await desk.mouse.down();
  await desk.mouse.move(box!.x + 40, box!.y + 95, { steps: 10 });
  await desk.mouse.up();
  await expect(desk.getByText('1 of 2 choices answered')).toBeVisible();
  await desk.screenshot({ path: '/tmp/pollish-swipe-desktop.png', fullPage: true, animations: 'disabled' });
  // Clicking an active choice clears it, and resetting only clears this visitor.
  await guest.getByRole('button', { name: 'Cards', exact: true }).click();
  await guest.getByRole('article').filter({ hasText: 'Cabin weekend' }).getByRole('button', { name: 'Not for me' }).click();
  await expect(guest.getByText('1 of 2 choices answered')).toBeVisible();
  await guest.getByRole('button', { name: 'Reset my votes', exact: true }).click();
  await guest.getByRole('button', { name: 'Reset & restart', exact: true }).click();
  await expect(guest.getByText('0 of 2 choices answered')).toBeVisible();
  await expect(guest.getByRole('button', { name: 'Swipe', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await desk.reload();
  await expect(desk.getByText('1 of 2 choices answered')).toBeVisible();

  await desktop.close();
  await voter.close();
  await page.goto(editURL);
  page.on('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Delete this poll' }).click();
  await expect(page.getByRole('heading', { name: 'Create a poll' })).toBeVisible();
});

test('empty states, clipboard fallback, builder retry and editing modes', async ({ page, browser }) => {
  await page.goto('/');
  await page.getByLabel('Your poll title').fill('Access test');
  await page.getByLabel('Anyone with the poll link', { exact: true }).check();
  await page.getByRole('button', { name: 'Create your poll' }).click();
  await expect(page.getByRole('heading', { name: 'POLL BUILDER' })).toBeVisible();
  const editURL = page.url();
  const pollURL = new URL(editURL).pathname.replace('/edit', '');
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.reject(new Error('denied')) }, configurable: true }));
  await page.getByRole('button', { name: 'Copy share link', exact: true }).first().click();
  await expect(page.getByRole('textbox', { name: 'Clipboard unavailable.', exact: false })).toHaveValue(`http://localhost:5173${pollURL}`);
  await page.getByLabel('Choice name').fill('Retained draft');
  await page.route('**/*?/addCard', route => route.abort());
  await page.getByRole('button', { name: 'Add choice', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Your entries are still here');
  await expect(page.getByLabel('Choice name')).toHaveValue('Retained draft');
  await page.unroute('**/*?/addCard');
  const guestContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const guest = await guestContext.newPage();
  await guest.goto(pollURL);
  await expect(guest.getByRole('heading', { name: 'This poll is taking shape.' })).toBeVisible();
  await guest.getByRole('link', { name: 'Add choices' }).click();
  await expect(guest.getByText('Collaborator access', { exact: false })).toBeVisible();
  await expect(guest.getByRole('button', { name: 'Delete this poll' })).toHaveCount(0);
  await page.getByLabel('Private edit link only', { exact: true }).check();
  await page.getByRole('button', { name: 'Save access' }).click();
  await expect(page.locator('form[action="?/access"]').getByRole('status')).toHaveText('Saved.');
  await guest.goto(`${pollURL}/edit`);
  await expect(guest.getByText('This poll uses a private edit link.', { exact: false })).toBeVisible();
  await guest.goto(pollURL);
  await expect(guest.getByRole('link', { name: 'Check for choices' })).toBeVisible();
  await page.getByRole('button', { name: 'Add choice', exact: true }).click();
  await expect(page.getByText('Retained draft', { exact: true })).toBeVisible();
  await guest.getByRole('link', { name: 'Check for choices' }).click();
  await expect(guest.getByRole('heading', { name: 'Retained draft' })).toBeVisible();
  await page.goto(editURL);
  page.on('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Delete this poll' }).click();
  await expect(page.getByRole('heading', { name: 'Create a poll' })).toBeVisible();
  await guest.goto(pollURL);
  await expect(guest.getByRole('heading', { name: 'This poll isn’t here.' })).toBeVisible();
  await guestContext.close();
});

test('transparent-image stack promotes during departure without showing through', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Your poll title').fill('Transparent stack test');
  await page.getByLabel('Anyone with the poll link', { exact: true }).check();
  await page.getByRole('button', { name: 'Create your poll' }).click();
  await expect(page.getByRole('heading', { name: 'POLL BUILDER' })).toBeVisible();
  const editURL = page.url();
  for (const title of ['First transparent card', 'Second transparent card', 'Third transparent card']) {
    await page.getByLabel('Choice name').fill(title);
    await page.locator('form[action="?/addCard"] input[type="file"]').setInputFiles({
      name: 'transparent.png', mimeType: 'image/png',
      buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR4nGNgAAIAAAUAAXpeqz8AAAAASUVORK5CYII=', 'base64')
    });
    await page.getByRole('button', { name: 'Add choice', exact: true }).click();
    await expect(page.getByText(title, { exact: true })).toBeVisible();
  }
  await page.getByRole('link', { name: 'Open poll & results' }).click();
  await page.getByRole('button', { name: 'Swipe', exact: true }).click();
  await page.getByRole('button', { name: 'Love it', exact: true }).click();
  // Promotion must overlap the outgoing card, rather than start after its removal.
  await expect(page.locator('.behind.promoting')).toHaveCount(1);
  await expect(page.locator('.deck-layer:not(.behind) h2')).toHaveText('Second transparent card');
  // Both layers remain opaque throughout settling, including in light theme.
  for (const light of [false, true]) {
    await page.evaluate(light => document.documentElement.classList.toggle('light', light), light);
    const layers = await page.locator('.deck-layer').evaluateAll(elements => elements.map(element => ({
      opacity: getComputedStyle(element).opacity,
      background: getComputedStyle(element.querySelector('article')!).backgroundColor
    })));
    for (const layer of layers) {
      expect(layer.opacity).toBe('1');
      expect(layer.background).toMatch(/^rgb\(/);
    }
  }
  await page.screenshot({ path: '/tmp/pollish-transparent-stack.png', fullPage: true, animations: 'disabled' });
  await page.goto(editURL);
  page.on('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Delete this poll' }).click();
  await expect(page.getByRole('heading', { name: 'Create a poll' })).toBeVisible();
});

test('optional names are public with votes, editable, and removable without changing votes', async ({ page, browser }) => {
  await page.goto('/');
  await page.getByLabel('Your poll title').fill('Named votes test');
  await page.getByLabel('Anyone with the poll link', { exact: true }).check();
  await page.getByRole('button', { name: 'Create your poll' }).click();
  await expect(page.getByRole('heading', { name: 'POLL BUILDER' })).toBeVisible();
  const editURL = page.url();
  await page.getByLabel('Choice name').fill('Pizza night');
  await page.getByRole('button', { name: 'Add choice', exact: true }).click();
  await expect(page.getByText('Pizza night', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Open poll & results' }).click();
  await page.getByRole('button', { name: 'Love it', exact: true }).click();
  await expect(page.getByText('1 of 1 choices answered')).toBeVisible();
  const pollURL = page.url();
  const visitor = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const guest = await visitor.newPage();
  await guest.goto(pollURL);
  await guest.getByText('Add your name', { exact: true }).click();
  await guest.getByLabel('Display name (optional)').fill('Alex');
  await guest.getByRole('button', { name: 'Save name' }).click();
  await expect(guest.getByText('Voting as Alex', { exact: true })).toBeVisible();
  await guest.getByRole('button', { name: 'Love it', exact: true }).click();
  await expect(guest.getByText('1 of 1 choices answered')).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: 'Results', exact: true }).click();
  await expect(page.getByLabel('Liked by', { exact: true })).toContainText('Alex');
  await expect(page.getByLabel('Liked by', { exact: true })).toContainText('1 anonymous');
  await page.screenshot({ path: '/tmp/pollish-named-results-phone.png', fullPage: true, animations: 'disabled' });
  await page.setViewportSize({ width: 320, height: 740 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.screenshot({ path: '/tmp/pollish-named-results-desktop.png', fullPage: true, animations: 'disabled' });

  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await guest.reload();
  await expect(guest.getByText('Voting as Alex', { exact: true })).toBeVisible();
  await guest.getByText('Voting as Alex', { exact: true }).click();
  await guest.getByLabel('Display name (optional)').fill('Alexandra');
  await guest.getByRole('button', { name: 'Save name' }).click();
  await expect(guest.getByText('Voting as Alexandra', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Refresh results', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Results', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByLabel('Liked by', { exact: true })).toContainText('Alexandra');
  await guest.getByLabel('Display name (optional)').fill('');
  await guest.getByRole('button', { name: 'Save name' }).click();
  await expect(guest.getByText('Add your name', { exact: true })).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: 'Results', exact: true }).click();
  await expect(page.getByLabel('Liked by', { exact: true })).toContainText('2 anonymous');
  await expect(page.getByText('2 votes across all choices', { exact: false })).toBeVisible();
  await visitor.close();
  await page.goto(editURL);
  page.on('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Delete this poll' }).click();
  await expect(page.getByRole('heading', { name: 'Create a poll' })).toBeVisible();
});
