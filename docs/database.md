# Firebase Firestore setup

This replaces the PostgreSQL/Supabase scripts with Cloud Firestore. Firestore has no SQL import: collections appear when documents are written. No live database has been changed or migrated.

## Setup

1. In your Firebase project, create a Cloud Firestore Standard edition database in Native mode, with database ID `(default)`. Start in production mode.
2. Open Firestore's Rules tab, paste [firestore.rules](../firebase/firestore.rules), and publish. Alternatively, with Firebase CLI installed, run `firebase deploy --only firestore:rules --project YOUR_PROJECT_ID` from the repository root. These rules block all browser access, including signed-in users. Review before applying to an existing project with other apps.
3. Install the separate server dependencies: `npm --prefix firebase install`.
4. Configure Application Default Credentials for an identity with Firestore access to your project. With Google Cloud CLI installed, local development can use `gcloud auth application-default login`. Keep credentials outside this repository and website.
5. Run `npm --prefix firebase run seed -- YOUR_PROJECT_ID`. It creates `discount_campaigns/WELCOME10` with a 10% first-purchase offer excluding delivery. Repeating the command leaves an existing campaign unchanged.

The seed creates only the campaign, not fake customers or orders. Admin SDK clients use IAM credentials and bypass Firestore Security Rules. See Firebase's [server setup](https://firebase.google.com/docs/firestore/quickstart-server) and [security rules documentation](https://firebase.google.com/docs/firestore/security/rules-conditions). Do not put Admin SDK credentials in browser JavaScript.

## Data structure

Use random UUIDs for customers and orders. This is a backend data contract: Firestore does not enforce SQL-style foreign keys, unique fields, generated totals or enums.

| Document path | Fields |
| --- | --- |
| `customers/{customerId}` | `name`, `phone_normalized`, `phone_verified_at`, `email`, `purchase_count`, `created_at` |
| `phone_claims/{normalizedPhone}` | `customer_id`; private mapping to enforce one customer per phone |
| `orders/{orderId}` | `reference` (use order ID), `customer_id`, `status`, `currency: "ZAR"`, `subtotal_cents`, `discount_cents`, `delivery_cents`, `total_cents`, `delivery_method`, `locker_details`, `confirmed_at`, `created_at` |
| `orders/{orderId}/items/{itemId}` | `product_id`, `product_name`, `design`, `colour`, `size`, `quantity`, `unit_price_cents`, `line_total_cents` |
| `discount_campaigns/WELCOME10` | `name`, `percentage`, `first_purchase_only`, `excludes_delivery`, `active`, `starts_at`, `ends_at` |
| `discount_redemptions/first_purchase_{customerId}` | `campaign_id`, `customer_id`, `order_id`, `customer_code`, `status`, `reserved_at`, `redeemed_at` |
| `payments/{paymentId}` | `order_id`, `amount_cents`, `type`, `reference`, `status`, `confirmed_at`, `created_at` |
| `payment_claims/{referenceHash}` | `payment_id`; prevents duplicate payment processing |

Store dates as Firestore Timestamps or null. Money uses nonnegative integer cents; payments must be positive. Validate safe integer arithmetic on the backend. Derive prices from a trusted catalogue, snapshot item prices, calculate line totals, and sum the subtotal. Calculate the discount as `Math.round(subtotal_cents * 10 / 100)`. Total is subtotal minus discount plus delivery; leave total null while delivery is unquoted. Collection delivery is zero. Decide whether free-delivery eligibility uses the discounted subtotal before automating quotes.

Order statuses: `enquiry`, `confirmed`, `deposit_paid`, `paid`, `fulfilled`, `cancelled`. Redemption statuses: `reserved`, `redeemed`, `cancelled`. Payment types: `deposit`, `balance`, `full`, `refund`; payment statuses: `pending`, `confirmed`, `failed`. Delivery methods: `locker` (requires locker details) or `collection`.

## Discount workflow

1. Normalize numbers on the backend (`0821234567` becomes `+27821234567`). Verify ownership through OTP or a staff-confirmed incoming WhatsApp conversation. Never accept verification timestamps from browser input.
2. In a transaction, read `phone_claims/{normalizedPhone}`. Reuse the existing customer or create the mapping and customer together. Set `purchase_count: 0` only for a genuinely new customer; import prior purchase history before enabling the promotion. A phone-number change must preserve the existing customer and redemption history.
3. Create an enquiry, then call [reserveFirstPurchaseDiscount](../firebase/discounts.cjs) with an Admin SDK Firestore instance and order ID. Authorize access to the order first. The helper checks verification, purchase history and campaign availability, then reserves a fixed document per customer. Concurrent enquiries cannot both reserve it. Retrying the same unconfirmed order returns the same code.
4. Include the returned `customer_code` in the WhatsApp enquiry. The random code contains no phone number and identifies a request; it is not authentication. Opening WhatsApp does not redeem a discount.
5. On first confirmation, atomically read/update the customer, order and reservation; recheck eligibility and campaign availability, save the approved quote, set `confirmed_at`, and increment `purchase_count` exactly once. Every confirmation must update the same customer document so it conflicts with concurrent reservations. If a different order confirms first, reject the discounted quote and review its reservation.
6. On payment confirmation, atomically claim the payment reference, record the payment, update the order and customer, and mark the associated reservation `redeemed` with its timestamp. Use a SHA-256 hash of the payment provider plus transaction reference for the payment-claim ID; retries must reuse the claim and never process it twice.

Confirmation and payment handlers are requirements for the future backend, not implemented endpoints. Use [Firestore transactions](https://firebase.google.com/docs/firestore/manage-data/transactions), with all reads before writes. Transaction callbacks can retry: send WhatsApp messages only after commit.

Cancelled reservations stay blocked until staff review. Release only unpaid cancelled orders, clear their quoted discount, and reassign the existing reservation in a transaction while preserving the customer code. Refunds/cancellations must not automatically reset purchase history or redeemed discounts. Different verified phone numbers can still belong to the same person.

## Integration and validation

The supplied web configuration is stored in [firebase-config.mjs](../javascript-files/firebase-config.mjs). It removes the pasted HTML entities and Markdown link formatting. The Realtime Database URL is intentionally omitted because this setup uses Firestore. Analytics is not initialized. The module exposes lazy `getFirebaseApp()` initialization for future checkout code and is not yet loaded by storefront pages. `.firebaserc` identifies `lone-wolf-klothing-db` as the default CLI project; no deployment has been performed.

The storefront still uses its manual `WELCOME10` WhatsApp request. These files do not connect checkout, deploy Cloud Functions, verify phones, create an admin screen, or migrate existing Supabase records. The discount helper is a server module, not a public endpoint. Backend authorization, input validation, payment reconciliation and audit logging remain necessary.

Before launch, test in the Firestore Emulator: browser access denied; unverified customers rejected; concurrent orders receive at most one reservation; same-order retries retain the code; returning customers and redeemed discounts rejected; duplicate payments processed once. Test future confirmation/payment handlers together with reservations. Local syntax checks do not substitute for emulator or project testing.
