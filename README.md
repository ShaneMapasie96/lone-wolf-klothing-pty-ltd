# cput-lone-wolf-wear-pty-ltd

The header includes collection search, a wishlist, a shopping cart, and a device-local profile. Cart and wishlist entries retain the selected product options in browser storage. Add to Cart opens a summary; Order on WhatsApp prepares the order using the existing business number. Sending an order does not automatically empty the cart.

The profile is saved only in the current browser; there is no authentication or online order history. Serve the site from its root so absolute asset URLs resolve.

Run `npm run test:shop` for header and shopping-flow checks and `npm run test:filters` for catalogue regression checks. Both use Playwright with locally installed Microsoft Edge, serve repository files through intercepted requests, and block external requests. No test sends an order.

## Contact enquiries

The contact form posts name, email, phone and message to FormSubmit for delivery to lwe16sa@gmail.com. It stays on the contact page and displays submission status. No email app or WhatsApp is required.

Before launch, submit an enquiry from the deployed contact page and click the FormSubmit activation link sent to lwe16sa@gmail.com (check spam). This inbox verification must be completed by the mailbox owner; until activation, FormSubmit holds submissions. Verify an enquiry reaches the inbox after activation. See https://formsubmit.co/help and https://formsubmit.co/ajax-documentation. Automated checks mock this service and do not verify live inbox delivery.

## Search discovery

Preferred URLs use `https://lonewolfklothing.co.za` and the existing `.html` paths. Live HTTP checks on 25 September 2026 confirmed that `www` redirects to the non-www host and all 16 content-page URLs return HTTP 200. The root page forwards to `/home-page/home.html`; its canonical points to that homepage rather than listing the redirect separately in the sitemap. Extensionless URLs can also resolve, so canonical tags identify the preferred `.html` versions already used by navigation.

Each content page has a matching canonical and Open Graph URL. `sitemap.xml` lists the 17 preferred content URLs, excluding the root redirect and error page. `robots.txt` permits crawling and advertises the sitemap. Cloudflare may prepend its managed content-signal text to the deployed robots response.

When adding or renaming a page, update its canonical, Open Graph URL and sitemap entry together. After deployment, check `/robots.txt` and `/sitemap.xml` on the live domain, then submit the sitemap in Google Search Console. These files support discovery but do not guarantee indexing.

## Sizing guidance

`get-help-pages/sizing.html` contains the business-provided fit advice and is linked from each product size selector and the help footer. Hoodies generally need one size up; crewnecks, sweatpants, shorts and outerwear offer the choice of a closer usual-size fit or a looser fit one size up. The guide includes garment-measuring instructions, but no numeric size chart has been published without verified product measurements. The sizing page is new and needs deployment before its canonical URL is available live.
