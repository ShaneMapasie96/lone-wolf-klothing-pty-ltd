const { chromium, expect } = require('@playwright/test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
    const browser = await chromium.launch({ channel: 'msedge' });
    try {
        const page = await browser.newPage();
        await page.addInitScript(() => { window.open = url => { window.orderURL = url; }; });
        await page.route('**/*', route => {
            const url = new URL(route.request().url());
            if (url.hostname !== 'local') return route.abort();
            const file = path.join(process.cwd(), decodeURIComponent(url.pathname));
            return fs.existsSync(file) ? route.fulfill({ path: file }) : route.abort();
        });
        await page.goto('http://local/clothing-pages/tracksuits.html');
        await expect(page.locator('.item .price')).toHaveText('R949.95');
        await page.waitForTimeout(200); // Existing design handlers attach on a timer.
        for (const [design, price] of [
            ['Lone Wolf Emblem - Large Print', '949.95'],
            ['Lone Wolf Emblem - Pocket Size', '899.95'],
            ['Wolf Head', '899.95'],
            ['Lone Wolf Typography', '899.95'],
            ['Lone Wolf Emblem - Large Print', '949.95']
        ]) {
            await page.locator('select[name="design"]').selectOption({ label: design });
            await page.locator('.item .color').last().click();
            await expect(page.locator('.item .price')).toHaveText('R' + price);
            await page.locator('select[name="quantity"]').selectOption('2');
            await page.getByRole('button', { name: 'Add to Cart', exact: true }).click();
            const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('lw-shop-v1')).cart);
            assert.equal(saved.length, 1);
            assert.equal(saved[0].price, Number(price));
            await expect(page.locator('.shop-item-price')).toHaveText('R' + (Number(price) * 2).toFixed(2));
            await page.getByLabel('Customer name', { exact: true }).fill('Price Check');
            await page.getByLabel('Phone number', { exact: true }).fill('0612345678');
            await page.getByLabel('Delivery method', { exact: true }).selectOption('collection');
            await page.getByRole('button', { name: 'Order on WhatsApp', exact: true }).click();
            const message = decodeURIComponent(await page.evaluate(() => window.orderURL));
            assert(message.includes('Unit price: R' + price));
            assert(message.includes('Line total: R' + (Number(price) * 2).toFixed(2)));
            await page.locator('.shop-item').getByRole('button', { name: 'Remove', exact: true }).click();
            await page.getByRole('button', { name: 'Close', exact: true }).click();
        }
        console.log('PASS tracksuit initial/design prices, colour changes, repeated selection, cart totals and intercepted WhatsApp order.');
    } finally {
        await browser.close();
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
