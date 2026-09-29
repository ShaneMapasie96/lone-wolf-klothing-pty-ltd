const { initializeApp, applicationDefault, deleteApp } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');

async function main() {
    const projectId = process.argv[2];
    if (!projectId || !/^[a-z][a-z0-9-]{4,28}[a-z0-9]$/.test(projectId)) {
        throw new Error('Usage: npm --prefix firebase run seed -- YOUR_FIREBASE_PROJECT_ID');
    }
    const app = initializeApp({ projectId, credential: applicationDefault() });
    try {
        const db = getFirestore(app);
        const ref = db.doc('discount_campaigns/WELCOME10');
        const created = await db.runTransaction(async tx => {
            if ((await tx.get(ref)).exists) return false;
            tx.create(ref, {
                name: 'First purchase: 10% off products', percentage: 10,
                first_purchase_only: true, excludes_delivery: true,
                active: true, starts_at: Timestamp.now(), ends_at: null
            });
            return true;
        });
        console.log(`${projectId}: WELCOME10 ${created ? 'created' : 'already exists; left unchanged'}.`);
    } finally { await deleteApp(app); }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
