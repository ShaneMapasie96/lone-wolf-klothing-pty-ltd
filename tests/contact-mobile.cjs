const { chromium, devices, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

(async () => {
    const browser = await chromium.launch({ channel: 'msedge' });
    try {
        for (const options of [{ viewport: { width: 1280, height: 900 } }, devices['Pixel 7']]) {
            const page = await browser.newPage(options);
            const errors = [];
            page.on('pageerror', error => errors.push(error.message));
            let outcome = 'success';
            let requests = 0;
            await page.route('**/*', async route => {
                const request = route.request();
                const url = new URL(request.url());
                if (url.hostname === 'formsubmit.co') {
                    requests++;
                    assert.equal(request.method(), 'POST');
                    const body = request.postData();
                    if (!url.pathname.startsWith('/ajax/')) {
                        const fields = new URLSearchParams(body);
                        assert.equal(fields.get('message'), 'Please contact me');
                        assert.equal(fields.get('_url'), 'https://www.lonewolfklothing.co.za/get-help-pages/contact.html');
                        return route.fulfill({ contentType: 'text/html', body: '<h1>Provider confirmation</h1>' });
                    }
                    assert.match(request.headers()['content-type'], /^multipart\/form-data/);
                    assert(body.includes('Please contact me'));
                    assert(body.includes('https://www.lonewolfklothing.co.za/get-help-pages/contact.html'));
                    if (outcome === 'network') return route.abort('failed');
                    if (outcome === 'rejected') return route.fulfill({ json: { success: false } });
                    return route.fulfill({ json: { success: true } });
                }
                if (url.hostname !== 'www.lonewolfklothing.co.za') return route.abort();
                const file = path.join(process.cwd(), url.pathname);
                return fs.existsSync(file) && fs.statSync(file).isFile()
                    ? route.fulfill({ path: file }) : route.abort();
            });
            await page.goto('https://www.lonewolfklothing.co.za/get-help-pages/contact.html');
            const fill = async () => {
                await page.getByLabel('Your name').fill('Test Customer');
                await page.getByLabel('Your email').fill('test@example.com');
                await page.getByLabel('Your phone number').fill('061 581 6059');
                await page.getByLabel('Your message').fill('Please contact me');
            };
            await page.getByRole('button', { name: 'Send Now' }).click();
            assert.equal(requests, 0, 'Invalid form must not submit');
            await fill();
            await page.getByRole('button', { name: 'Send Now' }).click();
            await expect(page.locator('#contactStatus')).toContainText('Thank you!');
            await expect(page.locator('#standardSubmit')).toBeHidden();
            for (outcome of ['rejected', 'network']) {
                await fill();
                await page.getByRole('button', { name: 'Send Now' }).click();
                await expect(page.locator('#standardSubmit')).toBeVisible();
                await expect(page.getByLabel('Your message')).toHaveValue('Please contact me');
                await expect(page.getByRole('button', { name: 'Send Now' })).toBeEnabled();
            }
            await page.getByRole('button', { name: 'Retry using standard form' }).click();
            await expect(page.getByRole('heading', { name: 'Provider confirmation' })).toBeVisible();
            assert.equal(requests, 4);
            assert.deepEqual(errors, []);
            await page.close();
        }
        console.log('PASS: desktop/mobile validation, multipart submission, provider/network failures, preserved input and standard-form fallback. All submissions intercepted.');
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
