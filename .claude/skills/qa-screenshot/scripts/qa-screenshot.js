#!/usr/bin/env node

/**
 * QA Screenshot Tool
 *
 * Takes screenshots of web app pages for visual QA.
 * Customize APP_URL and DEFAULT_PAGES for your project.
 */

const APP_URL = process.env.QA_URL || 'http://localhost:3000';
const DEFAULT_PAGES = ['/', '/about'];
const DEFAULT_VIEWPORT = { width: 1440, height: 900 };
const OUTPUT_DIR = '/tmp/qa-screenshots';

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

function parseArgs(args) {
  const opts = {
    url: APP_URL,
    pages: null,
    viewport: { ...DEFAULT_VIEWPORT },
    click: null,
    type: null,
    upload: null,
    wait: 2,
    interact: true,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--url':
        opts.url = args[++i];
        break;
      case '--pages':
        opts.pages = args[++i].split(',');
        break;
      case '--viewport': {
        const [w, h] = args[++i].split('x').map(Number);
        opts.viewport = { width: w, height: h };
        break;
      }
      case '--click':
        opts.click = args[++i];
        break;
      case '--type': {
        const [sel, text] = args[++i].split('=');
        opts.type = { selector: sel, text };
        break;
      }
      case '--upload': {
        const [sel, file] = args[++i].split('=');
        opts.upload = { selector: sel, file };
        break;
      }
      case '--wait':
        opts.wait = parseInt(args[++i], 10);
        break;
      case '--no-interact':
        opts.interact = false;
        break;
    }
  }

  if (!opts.pages) opts.pages = DEFAULT_PAGES;
  return opts;
}

async function run() {
  const opts = parseArgs(process.argv.slice(2));

  // Clean and create output dir
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true });
  }
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport(opts.viewport);

  // Collect console errors
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', (err) => {
    consoleErrors.push(err.message);
  });

  let screenshotIndex = 1;

  for (const pagePath of opts.pages) {
    const url = opts.url.replace(/\/$/, '') + pagePath;
    const label = pagePath.replace(/\//g, '_').replace(/^_/, '') || 'home';

    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
    } catch (e) {
      console.error(`Failed to load ${url}: ${e.message}`);
      continue;
    }

    // Wait for content to settle
    await new Promise((r) => setTimeout(r, opts.wait * 1000));

    // Take initial screenshot
    const filename = `${String(screenshotIndex).padStart(3, '0')}_${label}.png`;
    const filepath = path.join(OUTPUT_DIR, filename);
    await page.screenshot({ path: filepath, fullPage: true });
    console.log(filepath);
    screenshotIndex++;

    if (opts.interact) {
      // Click interaction
      if (opts.click) {
        try {
          await page.click(opts.click);
          await new Promise((r) => setTimeout(r, 1500));
          const clickFile = `${String(screenshotIndex).padStart(3, '0')}_${label}_after_click.png`;
          const clickPath = path.join(OUTPUT_DIR, clickFile);
          await page.screenshot({ path: clickPath, fullPage: true });
          console.log(clickPath);
          screenshotIndex++;
        } catch (e) {
          console.error(`Click failed on "${opts.click}": ${e.message}`);
        }
      }

      // Type interaction
      if (opts.type) {
        try {
          await page.type(opts.type.selector, opts.type.text);
          await new Promise((r) => setTimeout(r, 500));
          const typeFile = `${String(screenshotIndex).padStart(3, '0')}_${label}_after_type.png`;
          const typePath = path.join(OUTPUT_DIR, typeFile);
          await page.screenshot({ path: typePath, fullPage: true });
          console.log(typePath);
          screenshotIndex++;
        } catch (e) {
          console.error(`Type failed on "${opts.type.selector}": ${e.message}`);
        }
      }

      // Upload interaction
      if (opts.upload) {
        try {
          const input = await page.$(opts.upload.selector);
          if (input) {
            await input.uploadFile(opts.upload.file);
            await new Promise((r) => setTimeout(r, 2000));
            const uploadFile = `${String(screenshotIndex).padStart(3, '0')}_${label}_after_upload.png`;
            const uploadPath = path.join(OUTPUT_DIR, uploadFile);
            await page.screenshot({ path: uploadPath, fullPage: true });
            console.log(uploadPath);
            screenshotIndex++;
          }
        } catch (e) {
          console.error(`Upload failed on "${opts.upload.selector}": ${e.message}`);
        }
      }
    }
  }

  await browser.close();

  // Print console errors
  if (consoleErrors.length > 0) {
    console.log('\n--- Console Errors ---');
    consoleErrors.forEach((err) => console.log(`  ERROR: ${err}`));
  } else {
    console.log('\n--- No console errors ---');
  }
}

run().catch((err) => {
  console.error('QA Screenshot failed:', err.message);
  process.exit(1);
});
