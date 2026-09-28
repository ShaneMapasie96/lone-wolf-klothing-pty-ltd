const { chromium, expect } = require('@playwright/test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
    const browser = await chromium.launch({ channel: 'msedge' });
    try {
        const page = await browser.newPage({ hasTouch: true });
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.route('**/*', route => {
            const url = new URL(route.request().url());
            if (url.hostname !== 'local') return route.abort();
            const file = path.join(process.cwd(), decodeURIComponent(url.pathname));
            return fs.existsSync(file) && fs.statSync(file).isFile()
                ? route.fulfill({ path: file }) : route.abort();
        });
        const files = ['home-page', 'clothing-pages', 'accessories-pages', 'company-pages', 'get-help-pages']
            .flatMap(dir => fs.readdirSync(dir).filter(file => file.endsWith('.html')).map(file => `${dir}/${file}`));
        async function checkBounds(label) {
            const failures = await page.evaluate(() => {
                const failures = [];
                if (document.documentElement.scrollWidth > innerWidth + 1) failures.push('page overflow');
                for (const el of document.querySelectorAll('.nav-tools button, .home-mobile-menu summary')) {
                    const rect = el.getBoundingClientRect();
                    if (!rect.width || !rect.height) continue;
                    if (rect.left < 0 || rect.right > innerWidth || rect.top < 0 || rect.bottom > innerHeight) failures.push('header control clipped');
                    if (innerWidth <= 900 && (rect.width < 44 || rect.height < 44)) failures.push('header target too small');
                }
                for (const el of document.querySelectorAll('.item .color, .product-filter-swatch, .variant-btn, .hero-image-button')) {
                    const rect = el.getBoundingClientRect();
                    if (rect.width && rect.height && (rect.width < 44 || rect.height < 44)) failures.push('small target: ' + el.className);
                }
                for (const el of document.querySelectorAll('.item select, .product-filters select')) {
                    if (el.getBoundingClientRect().width && parseFloat(getComputedStyle(el).fontSize) < 16) failures.push('small selector text');
                }
                return failures;
            });
            assert.deepEqual(failures, [], label);
        }
        for (const width of [320, 667]) {
            await page.setViewportSize({ width, height: width === 667 ? 375 : 844 });
            for (const file of files) {
                await page.goto('http://local/' + file);
                await checkBounds(`${width}px ${file}`);
                await page.locator('.home-mobile-menu summary').tap();
                await expect(page.locator('.home-mobile-menu nav')).toBeVisible();
                const lastLink = page.locator('.home-mobile-menu nav a').last();
                await lastLink.scrollIntoViewIfNeeded();
                await expect(lastLink).toBeInViewport();
                await page.locator('.home-mobile-menu summary').tap();
                if (await page.locator('.product-filter-toggle').count()) {
                    await page.locator('.product-filter-toggle').tap();
                    await checkBounds(`filters ${width}px ${file}`);
                }
            }
            console.log(`PASS: ${files.length} pages at ${width}px, header/menu reachability, touch targets, selector text and overflow`);
        }
        await page.goto('http://local/home-page/home.html');
        for (const width of [360, 390, 640, 641, 768, 900, 901, 1280]) {
            await page.setViewportSize({ width, height: 844 });
            await checkBounds(`home breakpoint ${width}px`);
        }
        assert.deepEqual(errors, []);
        console.log('PASS: header breakpoint boundaries and no JavaScript errors');
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
