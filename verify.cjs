const { chromium } = require('/Users/nnnn215/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));

  await page.goto('http://localhost:4190/?verify=current#home');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.locator('#design[data-screen="home"]').waitFor();

  await page.getByRole('button', { name: 'Start Refining', exact: true }).click();
  await page.locator('#design[data-screen="new-project"]').waitFor();
  await page.getByRole('button', { name: 'Create', exact: true }).click();
  await page.getByText('暂时无法创建，可以体验我们这一个案例项目').waitFor();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();

  await page.getByRole('button', { name: 'Open Everyday Lip Tint', exact: true }).click();
  await page.getByText('暂时无法体验，请体验第一个项目').waitFor();
  await page.getByRole('button', { name: 'Open Lightweight Sunscreen Review', exact: true }).click();
  await page.locator('#design[data-screen="feedback"]').waitFor();

  await page.getByRole('button', { name: 'Feels information-heavy', exact: true }).click();
  await page.getByRole('button', { name: 'Let’s Plan the Changes', exact: true }).click();
  await page.locator('.page-transition-overlay').waitFor();
  await page.locator('#design[data-screen="plan"]').waitFor({ timeout: 5000 });

  await page.getByRole('button', { name: 'Lead with the lightweight feel', exact: true }).click();
  await page.getByRole('button', { name: 'Give the Lijiang proof more space', exact: true }).click();
  await page.getByRole('button', { name: 'Generate New Videos', exact: true }).click();
  await page.locator('.page-transition-overlay').waitFor();
  await page.locator('#design[data-screen="candidates"]').waitFor({ timeout: 5000 });
  await page.locator('.generation-agent').waitFor();
  assert.equal(await page.locator('.generation-placeholder').count(), 3);
  await page.evaluate(() => {
    const key = 'tiktok-figma-exact-state';
    const saved = JSON.parse(localStorage.getItem(key));
    saved.generationStartedAt = Date.now() - 13000;
    localStorage.setItem(key, JSON.stringify(saved));
    location.reload();
  });
  await page.getByRole('button', { name: 'Select candidate B', exact: true }).waitFor();

  await page.getByRole('button', { name: 'Expand sidebar', exact: true }).click();
  await page.getByRole('button', { name: 'Collapse sidebar', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Collapse sidebar', exact: true }).click();
  await page.getByRole('button', { name: 'Expand sidebar', exact: true }).waitFor();

  await page.getByRole('button', { name: 'Select candidate B', exact: true }).click();
  await page.getByRole('button', { name: 'View Detail for candidate B', exact: true }).click();
  await page.locator('#design[data-screen="preview"]').waitFor();
  await page.getByText('2/3', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Next candidate', exact: true }).click();
  await page.getByText('3/3', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Refine in a new version', exact: true }).click();
  await page.locator('#design[data-screen="feedback"]').waitFor();

  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('tiktok-figma-exact-state')));
  assert.equal(saved.base, 'Personal Review');
  assert.equal(saved.currentVersion, 1);
  assert.deepEqual(errors, []);

  const missing = await page.evaluate(() =>
    [...document.images].filter(image => !image.complete || !image.naturalWidth).map(image => image.src)
  );
  assert.equal(missing.length, 0);

  console.log(JSON.stringify({
    passed: true,
    flow: 'home → create notice → feedback → plan → candidates → preview → refine',
    stateRestored: true,
    missingAssets: missing,
    pageErrors: errors
  }));
  await browser.close();
})().catch(error => {
  console.error(error);
  process.exit(1);
});
