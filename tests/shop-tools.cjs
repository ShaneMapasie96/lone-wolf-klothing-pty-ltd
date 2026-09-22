const { chromium, expect } = require('@playwright/test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
    const browser = await chromium.launch({ channel: 'msedge' });
    try {
        const page = await browser.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.route('http://local/**', async route => {
            let file = path.join(process.cwd(), new URL(route.request().url()).pathname);
            if (!path.extname(file)) file += '.html';
            if (fs.existsSync(file) && fs.statSync(file).isFile()) await route.fulfill({ path: file });
            else await route.abort();
        });
        await page.route(/^https:/, route => route.abort());
        const open = name => page.locator('.nav-tools').getByRole('button', { name, exact: true }).click();
        const close = () => page.getByRole('dialog').getByRole('button', { name: 'Close', exact: true }).click();
        await page.goto('http://local/home-page/home.html');
        await open('Search');
        await page.getByRole('searchbox').fill('hoodies');
        assert.equal(await page.locator('.shop-result').count(), 1);
        await page.getByRole('searchbox').fill('zzzz');
        assert.match(await page.getByRole('dialog').innerText(), /No collections found/);
        await page.keyboard.press('Escape');
        await expect(page.getByRole('button', { name: 'Search', exact: true })).toBeFocused();
        await open('Account');
        await page.getByLabel('Name', { exact: true }).fill('Test Shopper');
        await page.getByLabel('Email', { exact: true }).fill('shopper@example.com');
        await page.getByRole('button', { name: 'Save profile', exact: true }).click();
        assert.match(await page.getByRole('dialog').getByRole('status').innerText(), /Profile saved/);
        await close();
        for (const dir of ['clothing-pages', 'accessories-pages']) {
            for (const file of fs.readdirSync(dir).filter(file => file.endsWith('.html'))) {
                await page.goto('http://local/' + dir + '/' + file);
                const cards = page.locator('.item');
                for (let i = 0; i < await cards.count(); i++) {
                    const card = cards.nth(i);
                    await card.getByRole('button', { name: 'Add to Wishlist', exact: true }).click();
                    assert(!/Please select a valid/.test(await page.getByRole('dialog').innerText()), file);
                    await close();
                    await card.getByRole('button', { name: 'Add to Cart', exact: true }).click();
                    assert.match(await page.getByRole('dialog').getByRole('status').innerText(), /Added to your cart/, file);
                    await close();
                }
            }
        }
        // The same selections on Cloudflare URLs must merge with existing items.
        const before = await page.evaluate(() => JSON.parse(localStorage.getItem('lw-shop-v1')));
        for (const dir of ['clothing-pages', 'accessories-pages']) {
            for (const file of fs.readdirSync(dir).filter(file => file.endsWith('.html'))) {
                await page.goto('http://local/' + dir + '/' + file.replace(/\.html$/, ''));
                for (const card of await page.locator('.item').all()) {
                    await card.getByRole('button', { name: 'Add to Wishlist', exact: true }).click();
                    assert(!/Please select a valid/.test(await page.getByRole('dialog').innerText()), file);
                    await close();
                    await card.getByRole('button', { name: 'Add to Cart', exact: true }).click();
                    assert.match(await page.getByRole('dialog').getByRole('status').innerText(), /Added to your cart/, file);
                    await close();
                }
            }
        }
        const after = await page.evaluate(() => JSON.parse(localStorage.getItem('lw-shop-v1')));
        assert.equal(after.cart.length, before.cart.length, 'URL formats must not duplicate cart items');
        assert.equal(after.wishlist.length, before.wishlist.length, 'URL formats must not duplicate wishlist items');
        for (const item of before.cart) {
            assert.equal(after.cart.find(other => other.id === item.id).quantity, item.quantity * 2);
        }
        await page.goto('http://local/home-page/home.html');
        await open('Shopping cart');
        const count = await page.locator('.shop-item').count();
        assert(count > 8);
        await page.locator('.shop-item input').first().fill('3');
        await page.locator('.shop-item input').first().dispatchEvent('change');
        assert.equal(await page.locator('.shop-item input').first().inputValue(), '3');
        const order = decodeURIComponent(await page.getByRole('link', { name: 'Order on WhatsApp' }).getAttribute('href'));
        assert.match(order, /Quantity: 3/);
        assert.match(order, /Unit price: R/);
        await page.locator('.shop-item').first().getByRole('button', { name: 'Remove' }).click();
        assert.equal(await page.locator('.shop-item').count(), count - 1);
        await close();
        await page.reload();
        await open('Account');
        assert.equal(await page.getByLabel('Name', { exact: true }).inputValue(), 'Test Shopper');
        await close();
        await page.setViewportSize({ width: 390, height: 844 });
        for (const name of ['Search', 'Wishlist', 'Shopping cart', 'Account']) {
            await open(name);
            const box = await page.getByRole('dialog').boundingBox();
            assert(box.x >= 0 && box.x + box.width <= 390);
            await close();
        }
        await page.evaluate(() => localStorage.setItem('lw-shop-v1', '{broken'));
        await page.reload();
        await open('Shopping cart');
        assert.match(await page.getByRole('dialog').innerText(), /Your cart is empty/);
        assert.deepEqual(errors, []);
        console.log('Shop tools passed: search, every product card, persistence, quantities, removal, order link, profile, mobile, keyboard and malformed storage.');
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });

