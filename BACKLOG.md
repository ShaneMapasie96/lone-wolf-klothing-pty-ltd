# Lone Wolf Klothing Website Backlog

This backlog reflects the current static HTML/CSS/JavaScript website. Updated: 2026-09-22. Status values are `Done`, `In Progress`, or `To Do`. The contact-form issue is resolved, as confirmed by the business owner.

## Jira and Azure DevOps import

The full backlog has already been imported. The CSVs now contain only To Do and In Progress stories, their parent epics, and Azure grouping features. Done stories, fully completed epics, and Completed task entries are excluded. BACKLOG.md retains the complete history. These exports reflect local backlog statuses; they do not read changes made directly in Jira or Azure.

- Source of truth: this file. Preserve the existing `US-###` identifiers when editing stories.
- Jira Cloud: import `backlog-imports/jira.csv` using the administrator **External system import > CSV** workflow. Map Issue ID and Parent to preserve Epic > Story links. Map Status and Priority to your project's values; Critical is exported as Highest. Epic rows appear before their stories. This targets Jira Cloud's current Parent field, not legacy Epic Link imports.
- Azure DevOps: import `backlog-imports/azure-devops-agile.csv` through **Boards > Queries > Import work items**. This file targets the Agile process and uses Title 1/2/3 for Epic > Feature > User Story hierarchy. Each epic has one grouping Feature to retain the standard Agile backlog levels. For Scrum, change User Story to Product Backlog Item before import; Basic and custom processes need their own type mapping.
- Azure creation imports omit ID and State. After saving the new items, export their assigned IDs and update State using the source-status tags and descriptions: To Do = New, In Progress = Active, Done = Closed. Never use the local story identifier as an Azure ID.
- Both files preserve acceptance criteria and outstanding task checklists inside descriptions. Tasks are not separately imported work items. No owners, estimates, sprint assignments, project keys or remote IDs are invented.
- Do not import these filtered files as new items into the existing boards: the outstanding items were included in the previous import too. Filtering does not deduplicate or delete remote items. To update existing records, first export actual Jira keys or Azure IDs and match the local identifiers in titles. The current files contain no remote IDs and remain creation-format snapshots, not update imports.
- Regenerate CSV files after editing this document with `node scripts/export-backlog.cjs`. Review the import preview against your project's required fields before saving.
- Import references: [Jira hierarchy mapping](https://support.atlassian.com/jira/kb/map-issueid-parentid-fields-jira-csv-import/) and [Azure CSV imports](https://learn.microsoft.com/en-us/azure/devops/boards/queries/import-work-items-from-csv?view=azure-devops).

Existing Done stories retain their recorded implementation status. Unprefixed validation tasks on those stories are regression checklists, not newly reported defects. Outstanding implementation and unresolved validation work are recorded under In Progress or To Do stories.

## Epic 1: Product Catalogue and Navigation

### US-101: Browse clothing categories
- **Status:** Done
- **Priority:** High
- **User story:** As a shopper, I want to browse clothing categories so that I can find the product type I want.
- **Acceptance criteria:**
  - Navigation links are available for T-Shirts & Vests, Golfers, Crews & Hoodies, Sweatpants & Shorts, Tracksuits, and Puffer Jackets & Body Warmers.
  - Category pages load from the navigation links.
  - The navigation label uses "Klothing" instead of "Clothing".
- **Tasks:**
  - Verify every category link resolves correctly.
  - Verify active navigation styling on each category page.
  - Check navigation at desktop, tablet, and mobile widths.

### US-102: Browse accessories categories
- **Status:** Done
- **Priority:** Medium
- **User story:** As a shopper, I want to browse accessories so that I can find caps, bucket hats, and beanies.
- **Acceptance criteria:**
  - Accessories navigation includes Bucket Hats & Beanies and 6-Panel Caps.
  - Both accessory pages load correctly.
- **Tasks:**
  - Verify accessory links and active states.
  - Check accessory pages for missing images and layout overflow.

### US-103: View company and help information
- **Status:** Done
- **Priority:** Medium
- **User story:** As a shopper, I want access to company, shipping, returns, payment, and contact information before ordering.
- **Acceptance criteria:**
  - Footer links load the relevant pages.
  - Contact, shipping, returns, payment, about, services, and privacy pages are reachable.
- **Tasks:**
  - Verify all footer URLs.
  - Review copy for current business details and policies.
  - Completed: Add a clear contact submission success/error state; see US-109.

### US-104: Reach the official social accounts
- **Status:** Done
- **Priority:** Medium
- **User story:** As a shopper, I want the footer social icons to open the official Lone Wolf Klothing accounts.
- **Acceptance criteria:**
  - Every HTML page has Facebook, Instagram, and TikTok links in its footer.
  - Instagram points to `https://www.instagram.com/lonewolf_klothing/`.
  - TikTok points to `https://www.tiktok.com/@lonewolf_klothing`.
  - Facebook uses the verified Lone Wolf Klothing page URL, not the unavailable `loneWolfKlothing` vanity URL.
  - The Twitter icon is absent.
- **Tasks:**
  - Completed: Update social links across all 16 pages and add them to the four category footers that lacked them.
  - Recheck the external destinations periodically because account URLs and visibility can change.

### US-105: Navigate from the homepage to collections
- **Status:** Done
- **Priority:** High
- **User story:** As a shopper, I want collection cards and the main shopping button to take me to the product category I expect.
- **Acceptance criteria:**
  - Collection cards use product photos rather than emoji.
  - Each category has one card; Golfers, Tracksuits, and 6-Panel Caps are included.
  - The T-Shirts & Vests button names its destination.
  - The compact mobile menu exposes the main product categories.
- **Tasks:**
  - Completed: Replace emoji cards, remove the duplicate Beanies card, and add the missing categories.
  - Completed: Rename the shopping button and add the compact mobile menu.
  - Verify card destinations and menu operation at desktop and mobile widths.

### US-106: Show the clothing in the homepage hero
- **Status:** Done
- **Priority:** Medium
- **User story:** As a shopper, I want to see Lone Wolf clothing on models so I can understand the collection at a glance.
- **Acceptance criteria:**
  - The hero offers four images: Lone Wolf, Wolf Head, Isolation Breeds Growth, and Lone Wolf Typography.
  - Each image has descriptive alternative text and its selection control identifies the active image.
- **Tasks:**
  - Completed: Replace the logo-led hero visual with four model images and image controls.
  - Verify all four assets and controls on desktop and mobile.

### US-107: Publish Courier Guy locker delivery information
- **Status:** Done
- **Priority:** High
- **User story:** As a shopper, I want current locker delivery details so that I can choose a suitable collection location and understand delivery costs.
- **Acceptance criteria:**
  - The shipping page replaces PAXI and PEP references with The Courier Guy locker service.
  - Estimated delivery is stated as 1-4 business days after dispatch.
  - Collection instructions explain PIN or QR access, the notification's collection deadline, and location-dependent opening hours.
  - Customers can open the locker finder and current courier quote page.
  - Paid delivery uses The Courier Guy's quoted charge without an LWK markup.
- **Tasks:**
  - Completed: Replace outdated delivery copy and PAXI rates.
  - Completed: Add locker collection details and official links.
  - Completed: Check desktop and mobile page overflow.

### US-108: Publish free locker delivery for orders over R750
- **Status:** Done
- **Priority:** High
- **User story:** As a shopper, I want to know when LWK pays for delivery so that I understand the cost of my order.
- **Acceptance criteria:**
  - The shipping page states that LWK pays the locker delivery fee when the order total exceeds R750.
  - Orders of exactly R750 or less retain the courier's quoted delivery charge without markup.
  - Free collection from LWK remains available.
  - This story covers the published shipping policy; automated cart shipping calculation is outside its scope.
- **Tasks:**
  - Completed: Add the free-delivery heading and explain who pays.
  - Completed: Clarify the strict greater-than-R750 threshold and remove the old R500 offer.

### US-109: Submit customer enquiries and callback requests by email
- **Status:** Done
- **Priority:** High
- **User story:** As a customer, I want to submit my name, email, phone number and message so that LWK can reply or call me back.
- **Acceptance criteria:**
  - The visible contact email and email link use lwe16sa@gmail.com.
  - The form requires a name, valid email, phone number and message.
  - Send Now submits the enquiry through FormSubmit for delivery to lwe16sa@gmail.com without opening the customer's email app or WhatsApp.
  - The page shows sending, success and error states and prevents duplicate submissions while a request is pending.
  - Failed submissions retain the customer's details for retry.
- **Tasks:**
  - Completed: Update the email address and replace the email-draft flow with direct form submission.
  - Completed: Restore Send Now and add the phone field, validation and status feedback.
  - Completed: Verify submission payload, success/error handling and responsive overflow with mocked requests.
  - Completed: Business owner confirmed the reported submission issue is resolved on 2026-09-21. Live delivery was not independently retested by the agent.

## Epic 2: Product Images and Variant Mapping

### US-201: Display correct product images by color
- **Status:** In Progress
- **Priority:** High
- **User story:** As a shopper, I want the product image to change to the selected color so that I can see what I am buying.
- **Acceptance criteria:**
  - T-shirt, golfer, hoodie, crewneck, sweatpants, shorts, tracksuit, beanie, bucket-hat, and cap color mappings use existing asset filenames.
  - The default golfer image loads without a broken-image state.
  - Royal Blue is removed from the golfer color selector.
  - Beanie mappings use the current `.jpg` assets for Grey and Pink Lone Wolf Emblem variants.
  - Bucket hats and beanies retain their dedicated image datasets when a design changes.
- **Tasks:**
  - Completed: Correct stale Grey and Pink Lone Wolf Emblem beanie paths in the page and design mapping.
  - Completed: Prevent the generic T-shirt/Golfer design handler from overwriting bucket-hat and beanie mappings.
  - Completed: Update crewneck, hoodie, sweatpants, and shorts paths and swatches for the renamed and added assets.
  - Audit every `data-img` and `data-variants` path against the filesystem.
  - Replace remaining stale filenames or incorrect extensions.
  - Test every color/design combination on each product page.

### US-202: Support multiple image variants for a color
- **Status:** Done
- **Priority:** High
- **User story:** As a shopper, I want to view multiple product angles for a color so that I can inspect the item before ordering.
- **Acceptance criteria:**
  - Products with multiple assets show previous/next controls.
  - Variant navigation updates the displayed image.
  - Variant indicators identify the current image.
  - Switching color resets the variant navigation to the selected color's first image.
  - 6-Panel Cap Typography variants pair Typography front views with Wolf Head side views; Wolf Head variants use the inverse pairing where matching assets exist.
- **Tasks:**
  - Completed: Remove the duplicate cap design handler so cap variant navigation is not overwritten after a design switch.
  - Test previous and next controls on all multi-image products.
  - Confirm controls do not trigger product-card or swatch clicks.
  - Confirm all variant images exist.

### US-203: Add visual product galleries
- **Status:** In Progress
- **Priority:** Medium
- **User story:** As a shopper, I want a product gallery beside the purchase card so that the catalogue feels easier to inspect.
- **Acceptance criteria:**
  - Golfers use matching left and right portrait frames around the center product card.
  - The Golfer frames use the Lone Wolf Typography and Lone Wolf Emblem model images.
  - Tracksuits retain the left gallery, center product card, and right portrait frame composition.
  - The Tracksuits right frame uses the Lone Wolf Emblem model image.
  - Existing product controls remain functional.
- **Tasks:**
  - Completed: Replace the Golfer left thumbnail gallery with a matching single portrait frame.
  - Completed: Update the Tracksuits model images for the left and right galleries.
  - Validate the golfers and tracksuits galleries against the approved reference screenshot.
  - Completed: Keep T-Shirts & Vests and Crews & Hoodies focused on their product grids; remove the empty lifestyle placeholders.
  - Add thumbnail click behavior if thumbnails are intended to control the main image.

### US-204: Add collection context and related navigation
- **Status:** Done
- **Priority:** Medium
- **User story:** As a shopper, I want a short collection description and a relevant next category after browsing products.
- **Acceptance criteria:**
  - The selected multi-product category pages have copy that describes the products shown.
  - Their related collection links lead to existing category pages.
  - The text and links do not crowd product cards on small screens.
- **Tasks:**
  - Completed: Add collection statements and related collection navigation to the selected multi-product pages.
  - Verify layout and link destinations across viewport sizes.

## Epic 3: Design Type and Pricing Selection

### US-301: Select design type on apparel products
- **Status:** Done
- **Priority:** High
- **User story:** As a shopper, I want to choose a design type so that I can order the artwork style I prefer.
- **Acceptance criteria:**
  - T-shirts support Large Print and Pocket Size emblem options plus the other supported designs.
  - Hoodies and crewnecks support Large Print and Pocket Size emblem options plus the other supported designs.
  - Golfers support the available emblem/design options.
  - Design selectors update the corresponding color/image mappings.
  - Visible selector labels use `Select Design:`.
- **Tasks:**
  - Completed: Update static and dynamically created visible labels from `Design:` to `Select Design:`.
  - Verify selector labels exactly match the product requirements.
  - Test changing design after changing color.
  - Confirm the selected design never leaves stale image variants in the palette.

### US-302: Calculate price from design selection
- **Status:** In Progress
- **Priority:** High
- **User story:** As a shopper, I want the price to update when I select a different design type so that I know the correct total before adding to cart.
- **Acceptance criteria:**
  - Large Print and Pocket Size selections show their configured prices.
  - Price changes immediately after selection.
  - The selected price is the price sent to the cart flow.
- **Tasks:**
  - Confirm prices for every product category with the business owner.
  - Completed: Implement price updates for the existing design selectors.
  - Test price changes after repeated design and color changes.
  - Add automated checks for selector-to-price behavior.

### US-303: Keep color selectors synchronized with design type
- **Status:** Done
- **Priority:** High
- **User story:** As a shopper, I want only valid colors and images for the selected design type so that I cannot select an invalid combination.
- **Acceptance criteria:**
  - Changing design rebuilds or updates the correct color palette.
  - The first valid color is selected after a design change.
  - The product image updates to the selected design and color.
  - Headwear design changes retain bucket-hat, beanie, or cap image mappings rather than falling back to the T-shirt dataset.
- **Tasks:**
  - Completed: Isolate the dedicated bucket-hat, beanie, and cap design handlers from the generic T-shirt/Golfer handler.
  - Test all design selectors on T-shirts, hoodies, crewnecks, golfers, beanies, bucket hats, caps, and tracksuits.
  - Verify no stale swatches remain after a design change.
  - Verify missing mappings fail gracefully.

## Epic 4: Swatch Interaction and Product Controls

### US-401: Show active color selection
- **Status:** Done
- **Priority:** High
- **User story:** As a shopper, I want to see which color is selected so that I understand the current product configuration.
- **Acceptance criteria:**
  - The initial color swatch is visibly selected.
  - Clicking a swatch removes the active state from sibling swatches.
  - The selected state works on clothing and accessory pages.
- **Tasks:**
  - Regression-test static and dynamically-created palettes.
  - Confirm both `selected` and `selected-color` class paths remain synchronized.

### US-402: Show hover feedback on color swatches
- **Status:** Done
- **Priority:** Medium
- **User story:** As a shopper, I want hover feedback on swatches so that I know they are interactive.
- **Acceptance criteria:**
  - Hovering a swatch changes its scale and visual ring.
  - Hover feedback is visible against light and dark swatches.
  - Styling is applied on T-shirts, golfers, crewnecks, hoodies, sweatpants, shorts, beanies, bucket hats, and 6-panel caps.
- **Tasks:**
  - Check hover behavior with a mouse on desktop.
  - Check focus behavior with a keyboard.
  - Ensure the ring does not cause layout shifts or overlap neighboring controls.

### US-403: Configure size and quantity
- **Status:** Done
- **Priority:** High
- **User story:** As a shopper, I want to choose size and quantity so that I can order the correct item.
- **Acceptance criteria:**
  - Product cards expose the supported sizes.
  - Quantity supports the configured range.
  - Selected size and quantity are included in the cart payload.
- **Tasks:**
  - Verify size options per product category.
  - Verify quantity validation and cart output.
  - Add a user-visible message for invalid or missing selections.

## Epic 5: Cart and Ordering

### US-501: Add a configured product to cart
- **Status:** In Progress
- **Priority:** Critical
- **User story:** As a shopper, I want to add my configured product to the cart so that I can place an order.
- **Acceptance criteria:**
  - Add to Cart captures product, design, color, size, quantity, image, and price.
  - The cart action works for every product category.
  - The shopper receives confirmation after adding an item.
- **Tasks:**
  - Audit `javascript-files/shop-tools.js` for every product type.
  - Test cart payloads after changing design, color, size, and quantity.
  - Completed: Add cart item count and cart summary UI.
  - Prevent adding products with invalid or missing data.

### US-502: Complete the WhatsApp ordering flow
- **Status:** In Progress
- **Priority:** Critical
- **User story:** As a shopper, I want to send my cart through the configured ordering channel so that I can complete my purchase.
- **Acceptance criteria:**
  - The generated message contains all selected product details.
  - Prices and quantities are correct.
  - The ordering link works on desktop and mobile.
- **Tasks:**
  - Completed: Configure the ordering destination as +27 61 581 6059.
  - Completed: Encode product data safely in the outgoing message.
  - Test the flow on supported browsers and mobile devices.
  - Add an error state when the ordering action cannot open.

### US-503: Persist cart items between page visits
- **Status:** In Progress
- **Priority:** High
- **User story:** As a shopper, I want my cart to persist while I browse so that I do not lose selected items.
- **Acceptance criteria:**
  - Cart data survives navigation and page refresh.
  - Items can be removed and quantities can be changed.
  - Opening WhatsApp does not clear the cart because the site cannot confirm whether an order was sent; items remain until the shopper removes them.
- **Tasks:**
  - Completed: Persist the cart in localStorage with a defined data schema.
  - Completed: Build cart summary, quantity editing and removal controls.
  - Completed: Validate stored cart data before restoring it.
  - Verify persistence across navigation and refresh, malformed storage, and quantity changes in supported browsers.

## Epic 6: Quality, Accessibility, and Release Readiness

### US-601: Verify responsive layouts
- **Status:** In Progress
- **Priority:** High
- **User story:** As a shopper, I want the website to work on desktop, tablet, and mobile screens so that I can shop from any device.
- **Acceptance criteria:**
  - No horizontal overflow at supported viewport sizes.
  - Product cards and galleries remain usable on mobile.
  - Navigation, selectors, and buttons remain accessible at touch sizes.
- **Tasks:**
  - Test all pages at desktop, tablet, and mobile viewport sizes.
  - Fix layout overflow and overlapping text.
  - Verify the compact homepage mobile menu exposes every main product category.
  - Confirm golfer and tracksuit galleries collapse appropriately on mobile.
  - Capture regression screenshots for key pages.

### US-602: Improve semantic accessibility
- **Status:** To Do
- **Priority:** High
- **User story:** As a keyboard or assistive-technology user, I want product controls to be understandable and operable.
- **Acceptance criteria:**
  - All interactive controls have accessible names.
  - Color choices have accessible labels or text alternatives.
  - Keyboard focus is visible.
  - Heading hierarchy is logical on every page.
- **Tasks:**
  - Add `aria-label` or visible labels to swatches and thumbnail controls.
  - Replace non-semantic clickable spans where appropriate.
  - Test keyboard navigation and focus order.
  - Run an accessibility audit.

### US-603: Establish automated regression tests
- **Status:** In Progress
- **Priority:** High
- **User story:** As a maintainer, I want automated checks so that image mappings, selectors, and cart behavior do not regress.
- **Acceptance criteria:**
  - Tests cover page loading and missing assets.
  - Tests cover design, color, price, size, and quantity changes.
  - Tests cover add-to-cart output.
  - Tests run from a documented command.
- **Tasks:**
  - Completed: Add npm scripts `test:shop` and `test:filters` for the existing Playwright checks.
  - Create page smoke tests for all catalogue pages.
  - Add product configuration matrix tests.
  - Add screenshot tests for golfers and tracksuits.
  - Completed: Document test setup and execution in README.md.
  - Add repeatable contact-form success/error tests using mocked requests; prior checks were run during implementation.

### US-604: Prepare the site for deployment
- **Status:** To Do
- **Priority:** Medium
- **User story:** As the site owner, I want a repeatable deployment process so that updates can be released reliably.
- **Acceptance criteria:**
  - All asset paths work from the production hosting root.
  - External font/icon dependencies are documented or bundled.
  - A deployment target and process are documented.
  - Broken links and missing assets are checked before release.
- **Tasks:**
  - Decide on hosting and base-path strategy.
  - Normalize absolute and relative asset paths.
  - Add a pre-release link and asset check.
  - Document deployment steps in `README.md`.

## Suggested First Sprint

1. Complete US-501 and US-502 by verifying the cart and ordering flow end to end.
2. Complete the asset audit in US-201 across every product category.
3. Extend the existing Playwright coverage in US-603.
4. Finish responsive validation for the golfers and tracksuits galleries in US-601.
5. Add accessible labels and keyboard focus behavior from US-602.
