# Browser automation selectors

Every content page and the 404 page loads `javascript-files/automation-hooks.js` after the functional scripts. It adds IDs and `data-testid` attributes to controls, navigation, landmarks, sections, images, headings, product prices and status messages. Decorative wrappers do not need individual IDs. The redirect-only root page forwards to the instrumented homepage.

These hooks are available in the live DOM with JavaScript enabled. Wait for `html[data-automation-ready="true"]` after navigation. Newly inserted product controls and dialog contents are annotated by a MutationObserver before the next browser task. Existing IDs, label relationships and accessible names are preserved. New IDs start with `auto-` and are unique within the page.

Prefer accessible roles and labels for behaviour tests, and `data-testid` for stable targeting of a component. Test IDs can repeat in separate components: scope controls to their card, filter, dialog, header or footer. Do not depend on generated numeric ID suffixes, prices, item positions or CSS styling classes.

| Component | Hook |
| --- | --- |
| Header / footer | `site-header` / `site-footer` |
| Main content | `main-content` |
| Product card | `product-<original image ID>`, plus `data-product-id` |
| Product selectors | `field-size`, `field-quantity`, `field-design` inside the card |
| Product colours | `colour-black`, `colour-white`, etc. inside the card |
| Filters | `product-filters`; selectors `field-filter-type`, `field-filter-size`, `field-filter-design` |
| Filter colours | `filter-colour-all`, `filter-colour-black`, etc. |
| Hero carousel | `hero-visual`; indicators `hero-slide-0` through `hero-slide-3` |
| Shopping dialog | `shop-dialog` |
| Dialog actions | `action-close`, `action-save-profile`, etc., assigned when the action is created |
| Cart/wishlist item | `data-item-key` stores the product variant identity; `data-collection` is `cart` or `wishlist` |
| Cart quantity | `field-quantity` scoped to a shopping item |

Product card identity uses its original image ID, so switching the design, colour or displayed image does not change it. Cart row test IDs combine the collection with a hash of the existing variant key, so changing quantity or removing an earlier row does not shift remaining row identities. No customer contact data is used in those identifiers.

```js
await page.goto('/clothing-pages/t-shirts_and_vests.html');
await expect(page.locator('html')).toHaveAttribute('data-automation-ready', 'true');

const header = page.getByTestId('site-header');
await header.getByRole('button', { name: 'Search', exact: true }).click();
await page.getByTestId('shop-dialog').getByRole('searchbox').fill('hoodies');
await page.getByTestId('action-close').click();

// Use the product's data-product-id from the DOM to select a specific card.
const product = page.locator('[data-product-id]').first();
await product.getByTestId('field-size').selectOption('M');
await product.getByTestId('colour-black').click();
await product.getByRole('button', { name: 'Add to Cart', exact: true }).click();
const cartItem = page.locator('[data-collection="cart"]').first();
await cartItem.getByTestId('field-quantity').fill('2');
await cartItem.getByTestId('field-quantity').dispatchEvent('change');
```

Run `npm run test:automation` to check all 18 pages for unique IDs and control coverage, design replacement, cart rerendering, and each shopping dialog. Run `npm run test:shop` for shopping behaviour regression checks. External requests are intercepted; no order is sent.

When changing component names or identifiers, review this selector contract and its tests. When adding a new interactive component, provide an explicit `data-testid` if its identity cannot be derived from its existing name, label or component scope. Existing explicit test IDs always take precedence, except colour swatches whose hook follows `data-color`.
