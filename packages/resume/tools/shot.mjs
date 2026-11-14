// Screenshot and input-scripting helper for visual checks on the real GPU.
// usage: node tools/shot.mjs <path?query> <out.png> [--size 1920x1080] [--dpr 1]
//        [--clip x,y,w,h] [--wait ms] [--steps '<json>'] [--mobile]
// steps: [{"move":[x,y]},{"down":1},{"up":1},{"drag":[[x,y],[x,y]],"ms":600},
//         {"key":"f"},{"scroll":400},{"wait":300},{"shot":"file.png"},{"eval":"js"}]
import { chromium } from 'playwright-core';

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};
const [path, out] = args;
const [width, height] = flag('size', '1920x1080').split('x').map(Number);
const dpr = Number(flag('dpr', '1'));
const wait = Number(flag('wait', '1800'));
const steps = JSON.parse(flag('steps', '[]'));
const clip = flag('clip');
const mobile = args.includes('--mobile');
const base = process.env.BASE ?? 'http://localhost:5199';

const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-webgl', ...(args.includes('--no-webgl') ? ['--disable-gpu', '--disable-3d-apis'] : [])],
});
const context = await browser.newContext({
  viewport: { width, height },
  deviceScaleFactor: dpr,
  hasTouch: mobile,
  isMobile: mobile,
  reducedMotion: args.includes('--reduced') ? 'reduce' : 'no-preference',
});
const page = await context.newPage();
page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning') console.log(`[${m.type()}]`, m.text());
});
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
await page.goto(base + path, { waitUntil: 'load' });
await page.waitForTimeout(wait);

const clipOf = (c) => {
  if (!c) return undefined;
  const [x, y, w, h] = c.split(',').map(Number);
  return { x, y, width: w, height: h };
};

for (const step of steps) {
  if (step.move) await page.mouse.move(step.move[0], step.move[1], { steps: step.steps ?? 8 });
  if (step.down) await page.mouse.down();
  if (step.up) await page.mouse.up();
  if (step.drag) {
    const pts = step.drag;
    await page.mouse.move(pts[0][0], pts[0][1]);
    await page.mouse.down();
    const per = (step.ms ?? 500) / Math.max(1, pts.length - 1);
    for (const p of pts.slice(1)) {
      await page.mouse.move(p[0], p[1], { steps: 12 });
      await page.waitForTimeout(per);
    }
    if (!step.hold) await page.mouse.up();
  }
  if (step.key) await page.keyboard.press(step.key);
  if (step.scroll !== undefined) await page.evaluate((y) => window.scrollTo(0, y), step.scroll);
  if (step.wheel) await page.mouse.wheel(0, step.wheel);
  if (step.click) await page.mouse.click(step.click[0], step.click[1]);
  if (step.eval) console.log('eval:', JSON.stringify(await page.evaluate(step.eval)));
  if (step.wait) await page.waitForTimeout(step.wait);
  if (step.shot) await page.screenshot({ path: step.shot, clip: clipOf(step.clip) });
}

if (out && out !== '-') await page.screenshot({ path: out, clip: clipOf(clip) });
const info = await page.evaluate(() => {
  const c = document.createElement('canvas').getContext('webgl2');
  const ext = c?.getExtension('WEBGL_debug_renderer_info');
  return { gpu: ext ? c.getParameter(ext.UNMASKED_RENDERER_WEBGL) : 'none', stats: window.__stats ?? null };
});
console.log(JSON.stringify(info));
await browser.close();
