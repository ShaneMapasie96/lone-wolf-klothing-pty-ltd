const { chromium, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

(async () => {
    const browser = await chromium.launch({ channel: 'msedge' });
    try {
        const page = await browser.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.route('**/*', route => {
            const url = new URL(route.request().url());
            if (url.hostname !== 'local') return route.abort();
            const file = path.join(process.cwd(), decodeURIComponent(url.pathname));
            return fs.existsSync(file) ? route.fulfill({ path: file }) : route.abort();
        });
        let designs = 0;
        for (const dir of ['clothing-pages', 'accessories-pages']) {
            for (const file of fs.readdirSync(dir).filter(file => file.endsWith('.html'))) {
                await page.goto('http://local/' + dir + '/' + file);
                // Existing design handlers attach on a 100ms timer.
                await page.waitForTimeout(200);
                for (const item of await page.locator('.item').all()) {
                    const select = item.locator('select[name="design"]');
                    const values = await select.count()
                        ? await select.locator('option').evaluateAll(options => options.map(option => option.value))
                        : [null];
                    for (const value of values) {
                        if (value !== null) await select.selectOption(value);
                        const swatches = item.locator('.colors .color');
                        const target = swatches.last();
                        await expect(target).toHaveAttribute('role', 'button');
                        await expect(target).toHaveAccessibleName(await target.getAttribute('data-color'));
                        await target.focus();
                        await page.keyboard.press('Space');
                        await expect(target).toHaveAttribute('aria-pressed', 'true');
                        assert.equal(await item.locator('.color[aria-pressed="true"]').count(), 1);
                        assert.equal(await target.evaluate(element => getComputedStyle(element).outlineStyle), 'solid');
                        await swatches.first().focus();
                        await page.keyboard.press('Enter');
                        await expect(swatches.first()).toHaveAttribute('aria-pressed', 'true');
                        await page.keyboard.press('Tab');
                        if (await swatches.count() > 1) await expect(swatches.nth(1)).toBeFocused();
                        await target.click();
                        await expect(target).toHaveAttribute('aria-pressed', 'true');
                        assert.equal(await item.locator('.color[aria-pressed="true"]').count(), 1);
                        designs++;
                    }
                }
                console.log('PASS keyboard: ' + file);
            }
        }
        assert.deepEqual(errors, []);
        console.log('PASS ' + designs + ' product/design combinations: keyboard, pointer, accessible names, selection and focus outlines.');
    } finally {
        await browser.close();
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
