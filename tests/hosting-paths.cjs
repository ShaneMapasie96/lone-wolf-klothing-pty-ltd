const { chromium, expect } = require('@playwright/test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
    const browser = await chromium.launch({ channel: 'msedge' });
    try {
        for (const base of ['/', '/lone-wolf-klothing-pty-ltd/']) {
            const page = await browser.newPage();
            const errors = [];
            page.on('pageerror', error => errors.push(error.message));
            await page.route('http://local/**', route => {
                const pathname = new URL(route.request().url()).pathname;
                if (!pathname.startsWith(base)) return route.abort();
                let file = path.join(process.cwd(), decodeURIComponent(pathname.slice(base.length)));
                if (!path.extname(file)) file += '.html';
                return fs.existsSync(file) && fs.statSync(file).isFile()
                    ? route.fulfill({ path: file }) : route.abort();
            });
            await page.route(/^https:/, route => route.abort());
            await page.goto('http://local' + base + 'home-page/home.html');
            await page.getByRole('button', { name: 'Search', exact: true }).click();
            await page.getByRole('searchbox').fill('tracksuits');
            await expect(page.locator('.shop-result')).toHaveAttribute('href', base + 'clothing-pages/tracksuits.html');
            await page.locator('.shop-result').click();
            await expect(page).toHaveURL('http://local' + base + 'clothing-pages/tracksuits.html');

            for (const dir of ['clothing-pages', 'accessories-pages']) {
                for (const file of fs.readdirSync(dir).filter(file => file.endsWith('.html'))) {
                    await page.goto('http://local' + base + dir + '/' + file);
                    // The existing design handlers attach on a 100ms timer.
                    await page.waitForTimeout(150);
                    const sources = await page.evaluate(() => {
                        const sources = [];
                        document.querySelectorAll('.item').forEach(card => {
                            const design = card.querySelector('select[name="design"]');
                            for (const option of design ? [...design.options] : [null]) {
                                if (option) { design.value = option.value; design.dispatchEvent(new Event('change')); }
                                card.querySelectorAll('.colors .color').forEach(swatch => {
                                    swatch.click();
                                    const image = card.querySelector('img');
                                    sources.push(image.src);
                                    for (let i = 1; i < (card._variants?.length || 1); i++) {
                                        card.querySelector('.variant-next').click();
                                        sources.push(image.src);
                                    }
                                });
                            }
                        });
                        return sources;
                    });
                    assert(sources.length, 'No product images checked: ' + file);
                    for (const source of sources) {
                        const url = new URL(source);
                        assert(url.pathname.startsWith(base), 'Escaped project folder: ' + source);
                        assert(fs.existsSync(path.join(process.cwd(), decodeURIComponent(url.pathname.slice(base.length)))), 'Missing image: ' + source);
                    }
                    await page.locator('.item').first().getByRole('button', { name: 'Add to Cart', exact: true }).click();
                    await expect(page.getByRole('dialog').getByRole('status')).toContainText('Added to your cart');
                }
            }
            await page.goto('http://local' + base + 'home-page/home.html');
            await page.getByRole('button', { name: 'Shopping cart', exact: true }).click();
            await expect(page.locator('.shop-item')).toHaveCount(8);
            for (const link of await page.locator('.shop-item a').all()) {
                assert((await link.getAttribute('href')).startsWith(base));
            }
            for (const preview of await page.locator('.shop-preview img').all()) {
                await expect(preview).toHaveJSProperty('complete', true);
                assert(await preview.evaluate(image => image.naturalWidth > 0), 'Cart preview failed');
            }
            assert.deepEqual(errors, []);
            console.log('PASS: search, every design/color/image variant, and saved cart at ' + base);
            await page.close();
        }
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
