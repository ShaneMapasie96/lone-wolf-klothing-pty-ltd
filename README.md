# cput-lone-wolf-wear-pty-ltd

The header includes collection search, a wishlist, a shopping cart, and a device-local profile. Cart and wishlist entries retain the selected product options in browser storage. Add to Cart opens a summary; Order on WhatsApp prepares the order using the existing business number. Sending an order does not automatically empty the cart.

The profile is saved only in the current browser; there is no authentication or online order history. Serve the site from its root so absolute asset URLs resolve.

Run `npm run test:shop` for header and shopping-flow checks and `npm run test:filters` for catalogue regression checks. Both use Playwright with locally installed Microsoft Edge, serve repository files through intercepted requests, and block external requests. No test sends an order.
