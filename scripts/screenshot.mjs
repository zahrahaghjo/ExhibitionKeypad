// Generates docs/preview.png (empty state) and docs/preview-filled.png (valid number).
// Usage:  yarn build && yarn screenshot
// First time only:  npx playwright install chromium
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const PORT = 4173;
const URL = `http://localhost:${PORT}/`;

async function waitForServer(timeoutMs = 30_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(URL);
      if (res.ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error('Preview server did not start. Did you run `yarn build` first?');
}

await mkdir('docs', { recursive: true });

const server = spawn('yarn', ['preview', '--port', String(PORT), '--strictPort'], {
  stdio: 'ignore',
  shell: process.platform === 'win32',
});

try {
  await waitForServer();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1157, height: 622 }, deviceScaleFactor: 1 });
  await page.goto(URL);
  await page.evaluate(() => document.fonts.ready);

  await page.screenshot({ path: 'docs/preview.png' });

  for (const digit of '123456789') {
    await page.getByRole('button', { name: new Intl.NumberFormat('fa-IR', { useGrouping: false }).format(Number(digit)) }).click();
  }
  await page.getByRole('button', { name: 'ارسال' }).click();
  await page.screenshot({ path: 'docs/preview-filled.png' });

  await browser.close();
  console.log('Saved docs/preview.png and docs/preview-filled.png');
} finally {
  server.kill();
}
