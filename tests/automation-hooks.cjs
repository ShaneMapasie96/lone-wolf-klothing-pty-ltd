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
        async function verify() {
            await expect(page.locator('html')).toHaveAttribute('data-automation-ready', 'true');
            const issues = await page.evaluate(() => {
                const ids = [...document.querySelectorAll('[id]')].map(node => node.id);
                const controls = [...document.querySelectorAll('a,button,input,select,textarea,summary,.color[data-color]')];
                return {
                    duplicateIds: ids.filter((id, i) => ids.indexOf(id) !== i),
                    missing: controls.filter(node => !node.id || !node.dataset.testid).map(node => node.outerHTML)
                };
            });
            assert.deepEqual(issues, { duplicateIds: [], missing: [] });
        }
        const files = ['404.html', ...['home-page', 'clothing-pages', 'accessories-pages', 'company-pages', 'get-help-pages']
            .flatMap(dir => fs.readdirSync(dir).filter(file => file.endsWith('.html')).map(file => `${dir}/${file}`))];
        for (const file of files) {
            await page.goto('http://local/' + file);
            await page.waitForTimeout(200); // Existing product handlers initialize on a timer.
            await verify();
            console.log('PASS hooks:', file);
        }
        await page.goto('http://local/clothing-pages/t-shirts_and_vests.html');
        await page.waitForTimeout(200);
        const card = page.locator('.item').first();
        const identity = await card.getAttribute('data-product-id');
        for (const option of await card.locator('select[name=design] option').evaluateAll(nodes => nodes.map(node => node.value))) {
            await card.locator('select[name=design]').selectOption(option);
            await verify();
            await expect(card).toHaveAttribute('data-product-id', identity);
        }
        await card.getByRole('button', { name: 'Add to Cart', exact: true }).click();
        await verify();
        const row = page.locator('.shop-item').first();
        const key = await row.getAttribute('data-item-key');
        const testid = await row.getAttribute('data-testid');
        await row.getByTestId('field-quantity').fill('2');
        await row.getByTestId('field-quantity').dispatchEvent('change');
        await expect(page.locator('.shop-item').first()).toHaveAttribute('data-item-key', key);
        await expect(page.locator('.shop-item').first()).toHaveAttribute('data-testid', testid);
        await verify();
        await page.getByTestId('action-close').click();
        for (const name of ['Search', 'Account', 'Wishlist', 'Shopping cart']) {
            await page.getByRole('button', { name, exact: true }).click();
            await verify();
            await page.getByTestId('action-close').click();
        }
        assert.deepEqual(errors, []);
        console.log('PASS: regenerated designs, cart quantity rerender, and all dialog views');
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
