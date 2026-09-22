const { chromium, expect } = require('@playwright/test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
    const browser = await chromium.launch({ channel: 'msedge' });
    try {
        const page = await browser.newPage();
        await page.addInitScript(() => { window.open = url => { window.testWhatsAppURL = url; }; });
        const prepareOrder = async () => {
            await page.getByLabel('Customer name', {exact:true}).fill('Test & Customer');
            await page.getByLabel('Phone number', {exact:true}).fill('+27 61 234 5678');
            await page.getByLabel('Preferred Courier Guy locker (name and location)', {exact:true}).fill('Test Locker, Cape Town');
            await page.getByRole('button', {name:'Order on WhatsApp',exact:true}).click();
            return decodeURIComponent(await page.evaluate(() => window.testWhatsAppURL));
        };
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
        const order = await prepareOrder();
        assert(order.includes('Customer name: Test & Customer'));
        assert(order.includes('Phone number: +27 61 234 5678'));
        assert(order.includes('Preferred locker: Test Locker, Cape Town'));
        assert.match(order, /Quantity: 3/);
        assert.match(order, /Unit price: R/);
        const orderedItems = await page.evaluate(() => JSON.parse(localStorage.getItem('lw-shop-v1')).cart);
        for (const item of orderedItems) {
            const imageName = item.image.split(/[?#]/)[0].split('/').pop().replace(/\.(webp|png|jpe?g)$/i, '');
            assert(order.includes('Description: ' + imageName), 'Missing selected image description: ' + imageName);
        }
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
        await page.evaluate(() => localStorage.removeItem('lw-shop-v1'));
        await page.goto('http://local/clothing-pages/t-shirts_and_vests');
        const vest = page.locator('.item').filter({ has: page.locator('#item2-img') });
        await vest.locator('.color[data-color="Red"]').click();
        await vest.getByRole('button', { name: 'Add to Cart', exact: true }).click();
        await expect(page.locator('.shop-variant')).toHaveText('Selected variant: Red vest with black Lone Wolf Emblem');
        await close();
        await vest.getByRole('button', { name: 'Next variant', exact: true }).click();
        await vest.getByRole('button', { name: 'Add to Cart', exact: true }).click();
        assert.equal(await page.locator('.shop-item').count(), 2);
        await expect(page.locator('.shop-variant').nth(1)).toHaveText('Selected variant: Red vest with white Lone Wolf Emblem');
        await close();
        await page.reload();
        await open('Shopping cart');
        await page.getByRole('button', {name:'Order on WhatsApp',exact:true}).click();
        assert.equal(await page.evaluate(() => window.testWhatsAppURL), undefined, 'Blank fields must block ordering');
        const variantOrder = await prepareOrder();
        await page.evaluate(() => { window.testWhatsAppURL = undefined; });
        await page.getByLabel('Phone number', {exact:true}).fill('invalid');
        await page.getByRole('button', {name:'Order on WhatsApp',exact:true}).click();
        assert.equal(await page.evaluate(() => window.testWhatsAppURL), undefined);
        await page.getByLabel('Phone number', {exact:true}).fill('+27 61 234 5678');
        await page.getByLabel('Delivery method', {exact:true}).selectOption('collection');
        await page.getByRole('button', {name:'Order on WhatsApp',exact:true}).click();
        const collectionOrder = decodeURIComponent(await page.evaluate(() => window.testWhatsAppURL));
        assert(collectionOrder.includes('Delivery: Collection from LWK'));
        assert(!collectionOrder.includes('Preferred locker:'));
        await page.getByLabel('Delivery method', {exact:true}).selectOption('locker');
        assert(variantOrder.includes('Description: red-blk-lw-emblem-vest'));
        assert(variantOrder.includes('Description: red-white-lw-emblem-vest'));
        assert.equal(await page.locator('.shop-item').count(), 2);
        await close();
        const deliveryItem = await page.evaluate(() => JSON.parse(localStorage.getItem('lw-shop-v1')).cart[0]);
        for (const [price, expected] of [[749.99, 'Spend R0.02 more'], [750, 'Spend R0.01 more'], [750.01, 'Free locker delivery']]) {
            await page.evaluate(({item, price}) => localStorage.setItem('lw-shop-v1', JSON.stringify({cart: [{...item, price, quantity: 1}], wishlist: []})), {item: deliveryItem, price});
            await page.reload();
            await open('Shopping cart');
            await expect(page.locator('.shop-delivery-status')).toContainText(expected);
            await close();
        }
        await page.evaluate(item => localStorage.setItem('lw-shop-v1', JSON.stringify({cart: [{...item, price: 375, quantity: 2}], wishlist: []})), deliveryItem);
        await page.reload();
        await open('Shopping cart');
        await expect(page.locator('.shop-delivery-status')).toContainText('Spend R0.01 more');
        await page.locator('.shop-item input').fill('3');
        await page.locator('.shop-item input').dispatchEvent('change');
        await expect(page.locator('.shop-delivery-status')).toContainText('Free locker delivery');
        await page.locator('.shop-item input').fill('1');
        await page.locator('.shop-item input').dispatchEvent('change');
        await expect(page.locator('.shop-delivery-status')).toContainText('Spend R375.01 more');
        await page.locator('.shop-item').getByRole('button', { name: 'Remove' }).click();
        await expect(page.locator('.shop-delivery-status')).toHaveCount(0);
        await close();
        await page.evaluate(() => localStorage.setItem('lw-shop-v1', '{broken'));
        await page.reload();
        await open('Shopping cart');
        assert.match(await page.getByRole('dialog').innerText(), /Your cart is empty/);
        assert.deepEqual(errors, []);
        console.log('Shop tools passed: search, every product card, persistence, quantities, removal, order link, profile, mobile, keyboard and malformed storage.');
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });

