# cput-lone-wolf-wear-pty-ltd

Browser automation identifiers and Playwright examples are documented in [docs/automation.md](docs/automation.md). Run `npm run test:automation` to verify ID uniqueness, control coverage, and dynamically rebuilt shopping controls.

The header includes collection search, a wishlist, a shopping cart, and a device-local profile. Cart and wishlist entries retain the selected product options in browser storage. Add to Cart opens a summary; Order on WhatsApp prepares the order using the existing business number. Sending an order does not automatically empty the cart.

The profile is saved only in the current browser; there is no authentication or online order history. Serve the site from its root so absolute asset URLs resolve.

Checkout accepts the optional code `WELCOME10` (case-insensitive) to request 10% off products on a customer's first purchase, excluding delivery. The WhatsApp enquiry includes the request; displayed estimates remain before discount. Code recognition in the browser does not verify eligibility or prevent repeat use. Before approving a quote, staff must check a central customer/order register using the customer's WhatsApp number, including previous purchases and pending discounted orders. Record an approved request against its order reference, mark it redeemed when the deposit is confirmed, and resolve cancelled reservations manually. Never treat opening WhatsApp as redemption. Automated enforcement requires a backend with verified customer identities, order history and atomic redemption controls.

Run `npm run test:shop` for header and shopping-flow checks and `npm run test:filters` for catalogue regression checks. Both use Playwright with locally installed Microsoft Edge, serve repository files through intercepted requests, and block external requests. No test sends an order.

Run `npm run test:mobile` for all 17 content pages at 320px portrait and 667px landscape, plus homepage header breakpoint checks. It checks menu reachability, touch-target sizes, selector text and horizontal overflow. These Edge checks do not replace iOS Safari or Android device testing.

The compact header is used through 900px. Mobile and touch product controls use 44px targets and 16px selector text. The downloadable catalogue is a 4.2 MB web copy; the original remains in `output/pdf/lone-wolf-catalogue-2026-updated.pdf`. When replacing a download or stylesheet, update its displayed size and version query in the HTML.

## Contact enquiries

The contact form posts name, email, phone and message to FormSubmit for delivery to lwe16sa@gmail.com. It stays on the contact page and displays submission status. No email app or WhatsApp is required.

Before launch, submit an enquiry from the deployed contact page and click the FormSubmit activation link sent to lwe16sa@gmail.com (check spam). This inbox verification must be completed by the mailbox owner; until activation, FormSubmit holds submissions. Verify an enquiry reaches the inbox after activation. See https://formsubmit.co/help and https://formsubmit.co/ajax-documentation. Automated checks mock this service and do not verify live inbox delivery.

## Search discovery

Preferred URLs use `https://lonewolfklothing.co.za` and the existing `.html` paths. Live HTTP checks on 25 September 2026 confirmed that `www` redirects to the non-www host and all 16 content-page URLs return HTTP 200. The root page forwards to `/home-page/home.html`; its canonical points to that homepage rather than listing the redirect separately in the sitemap. Extensionless URLs can also resolve, so canonical tags identify the preferred `.html` versions already used by navigation.

Each content page has a matching canonical and Open Graph URL. `sitemap.xml` lists the 17 preferred content URLs, excluding the root redirect and error page. `robots.txt` permits crawling and advertises the sitemap. Cloudflare may prepend its managed content-signal text to the deployed robots response.

When adding or renaming a page, update its canonical, Open Graph URL and sitemap entry together. After deployment, check `/robots.txt` and `/sitemap.xml` on the live domain, then submit the sitemap in Google Search Console. These files support discovery but do not guarantee indexing.

## Sizing guidance

`get-help-pages/sizing.html` contains the business-provided fit advice and is linked from each product size selector and the help footer. Hoodies generally need one size up; crewnecks, sweatpants, shorts and outerwear offer the choice of a closer usual-size fit or a looser fit one size up. The guide includes garment-measuring instructions, but no numeric size chart has been published without verified product measurements. The sizing page is new and needs deployment before its canonical URL is available live.
