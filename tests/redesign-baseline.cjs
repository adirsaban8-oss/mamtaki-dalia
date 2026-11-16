/**
 * Redesign regression baseline.
 *
 *   node tests/redesign-baseline.cjs <baseUrl> <before|after>
 *
 * Needs playwright-core (resolved from NODE_PATH, so it is not a project
 * dependency) and Microsoft Edge. Records, without placing any order:
 *   - every product: catalog price, product-page price, and for per-kg
 *     products the total + WhatsApp message at 1 kg, 1.2 kg and 2 kg
 *   - the checkout page (cart is empty: the UI has no add-to-cart in
 *     catalog mode) and the admin page load
 *   - screenshots of the main pages at 390×844 and 1440×900
 * Writes docs/redesign/baseline.json (before) or after.json, and in
 * "after" mode prints every difference from the baseline.
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const [base = 'http://localhost:3005', mode = 'before'] = process.argv.slice(2);
const OUT = path.join(__dirname, '..', 'docs', 'redesign');
const SHOTS = path.join(OUT, mode);
const PAGES = ['he', 'he/shop', 'he/shop/baklava-pistachio', 'he/shop/layali-beirut-tray', 'he/delivery', 'he/events', 'he/checkout', 'ar'];

const num = (s) => (s && s.match(/₪\s?(\d+)/) ? +s.match(/₪\s?(\d+)/)[1] : null);

(async () => {
  fs.mkdirSync(SHOTS, { recursive: true });
  const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const result = { base, takenAt: new Date().toISOString(), products: {}, checkout: {}, admin: {} };

  // Catalog: name → price as shown on the card
  await page.goto(`${base}/he/shop`, { waitUntil: 'networkidle' });
  const cards = await page.evaluate(() =>
    [...document.querySelectorAll('article')].map((a) => ({
      slug: (a.querySelector('a[href*="/shop/"]')?.getAttribute('href') || '').split('/shop/')[1],
      price: (a.innerText.match(/₪\s?\d+/) || [null])[0],
    }))
  );

  for (const { slug, price } of cards) {
    if (!slug) continue;
    await page.goto(`${base}/he/shop/${slug}`, { waitUntil: 'networkidle' });
    const read = () =>
      page.evaluate(() => {
        const fs = document.querySelector('fieldset');
        const wa = [...document.querySelectorAll('a[href*="wa.me"]')].map((a) => a.href).find((h) => h.includes('text='));
        return {
          weight: fs?.querySelector('output')?.innerText ?? null,
          total: fs ? (fs.innerText.match(/₪\s?\d+/g) || []).pop() ?? null : null,
          message: wa ? decodeURIComponent(wa.split('text=')[1]) : null,
        };
      });
    const h1 = await page.locator('h1').first().innerText();
    const pagePrice = await page.evaluate(() => {
      const h = document.querySelector('h1');
      const scope = h?.closest('div.flex') || document.body;
      return (scope.innerText.match(/₪\s?\d+/) || [null])[0];
    });
    const entry = { name: h1.trim(), cardPrice: num(price), pagePrice: num(pagePrice), steps: [] };
    entry.steps.push(await read());
    const plus = page.locator('fieldset button[aria-label="הוספת 200 גרם"]');
    if (await plus.count()) {
      await plus.click();
      entry.steps.push(await read());
      await page.locator('fieldset button', { hasText: '2 ק״ג' }).first().click();
      entry.steps.push(await read());
    }
    result.products[slug] = entry;
  }

  // Checkout (empty cart in catalog mode) and admin
  let r = await page.goto(`${base}/he/checkout`, { waitUntil: 'networkidle' });
  result.checkout = {
    status: r.status(),
    h1: (await page.locator('h1').first().innerText().catch(() => '')).trim(),
    summary: (await page.evaluate(() => (document.querySelector('aside') || document.body).innerText.slice(0, 160))).replace(/\s+/g, ' '),
  };
  r = await page.goto(`${base}/he/admin`, { waitUntil: 'networkidle' });
  result.admin = { status: r.status(), h1: (await page.locator('h1').first().innerText().catch(() => '')).trim() };

  // Screenshots
  for (const [w, h] of [[390, 844], [1440, 900]]) {
    const c = await browser.newContext({ viewport: { width: w, height: h }, isMobile: w < 500, hasTouch: w < 500 });
    const p = await c.newPage();
    for (const route of PAGES) {
      await p.goto(`${base}/${route}`, { waitUntil: 'networkidle' });
      await p.screenshot({ path: path.join(SHOTS, `${route.replace(/\//g, '_')}-${w}.png`) });
    }
    await c.close();
  }
  await browser.close();

  const file = path.join(OUT, mode === 'before' ? 'baseline.json' : 'after.json');
  fs.writeFileSync(file, JSON.stringify(result, null, 2));
  console.log(`${Object.keys(result.products).length} products recorded → ${path.basename(file)}`);

  if (mode !== 'before') {
    const before = JSON.parse(fs.readFileSync(path.join(OUT, 'baseline.json'), 'utf8'));
    const diffs = [];
    for (const [slug, b] of Object.entries(before.products)) {
      const a = result.products[slug];
      if (!a) { diffs.push(`${slug}: missing after`); continue; }
      for (const k of ['name', 'cardPrice', 'pagePrice']) if (a[k] !== b[k]) diffs.push(`${slug}.${k}: ${b[k]} → ${a[k]}`);
      b.steps.forEach((s, i) => {
        for (const k of ['weight', 'total', 'message']) if ((a.steps[i] || {})[k] !== s[k]) diffs.push(`${slug}.step${i}.${k}: ${s[k]} → ${(a.steps[i] || {})[k]}`);
      });
    }
    for (const slug of Object.keys(result.products)) if (!before.products[slug]) diffs.push(`${slug}: new after`);
    if (before.checkout.status !== result.checkout.status) diffs.push(`checkout status ${before.checkout.status} → ${result.checkout.status}`);
    if (before.admin.status !== result.admin.status) diffs.push(`admin status ${before.admin.status} → ${result.admin.status}`);
    console.log(diffs.length ? `DIFFERENCES (${diffs.length}):\n` + diffs.join('\n') : 'REGRESSION: identical to baseline');
  }
})();
