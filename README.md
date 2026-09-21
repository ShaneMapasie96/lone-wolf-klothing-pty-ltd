# cput-lone-wolf-wear-pty-ltd

The header includes collection search, a wishlist, a shopping cart, and a device-local profile. Cart and wishlist entries retain the selected product options in browser storage. Add to Cart opens a summary; Order on WhatsApp prepares the order using the existing business number. Sending an order does not automatically empty the cart.

The profile is saved only in the current browser; there is no authentication or online order history. Serve the site from its root so absolute asset URLs resolve.

Run `npm run test:shop` for header and shopping-flow checks and `npm run test:filters` for catalogue regression checks. Both use Playwright with locally installed Microsoft Edge, serve repository files through intercepted requests, and block external requests. No test sends an order.

## Contact enquiries

The contact form posts name, email, phone and message to FormSubmit for delivery to lwe16sa@gmail.com. It stays on the contact page and displays submission status. No email app or WhatsApp is required.

Before launch, submit an enquiry from the deployed contact page and click the FormSubmit activation link sent to lwe16sa@gmail.com (check spam). This inbox verification must be completed by the mailbox owner; until activation, FormSubmit holds submissions. Verify an enquiry reaches the inbox after activation. See https://formsubmit.co/help and https://formsubmit.co/ajax-documentation. Automated checks mock this service and do not verify live inbox delivery.
