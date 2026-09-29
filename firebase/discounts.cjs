// Server-only helper. Caller must authorize access to the order.
const { randomUUID } = require('node:crypto');
const { Timestamp } = require('firebase-admin/firestore');

async function reserveFirstPurchaseDiscount(db, orderId) {
    if (typeof orderId !== 'string' || !/^[A-Za-z0-9_-]{1,128}$/.test(orderId)) throw new Error('Invalid order ID');
    return db.runTransaction(async tx => {
        const order = (await tx.get(db.doc(`orders/${orderId}`))).data();
        if (!order || order.status !== 'enquiry') throw new Error('Reserve before order confirmation');
        if (typeof order.customer_id !== 'string' || !/^[A-Za-z0-9_-]{1,128}$/.test(order.customer_id)) throw new Error('Invalid customer ID');
        const customerRef = db.doc(`customers/${order.customer_id}`);
        const redemptionRef = db.doc(`discount_redemptions/first_purchase_${order.customer_id}`);
        const customer = (await tx.get(customerRef)).data();
        const campaign = (await tx.get(db.doc('discount_campaigns/WELCOME10'))).data();
        const redemption = (await tx.get(redemptionRef)).data();
        if (!(customer?.phone_verified_at instanceof Timestamp)) throw new Error('Verify phone ownership first');
        if (customer.purchase_count !== 0) throw new Error('Customer has previous purchases or uninitialized history');
        const now = Timestamp.now();
        if (!campaign?.active || campaign.first_purchase_only !== true || campaign.percentage !== 10 ||
            campaign.excludes_delivery !== true || !(campaign.starts_at instanceof Timestamp) ||
            campaign.starts_at.toMillis() > now.toMillis() ||
            (campaign.ends_at !== null && (!(campaign.ends_at instanceof Timestamp) || campaign.ends_at.toMillis() <= now.toMillis()))) {
            throw new Error('First-purchase campaign is unavailable');
        }
        if (redemption) {
            if (redemption.order_id === orderId && redemption.status === 'reserved') return redemption;
            throw new Error('Discount already used or reserved; staff review required');
        }
        const result = {
            campaign_id: 'WELCOME10', customer_id: order.customer_id, order_id: orderId,
            customer_code: 'LWK-' + randomUUID().replaceAll('-', '').toUpperCase(),
            status: 'reserved', reserved_at: now, redeemed_at: null
        };
        tx.create(redemptionRef, result);
        // Confirmation/payment handlers must update this same customer document.
        tx.update(customerRef, { discount_updated_at: now });
        return result;
    });
}
module.exports = { reserveFirstPurchaseDiscount };
