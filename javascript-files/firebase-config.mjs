// Public web-app configuration. Admin/service-account credentials never belong here.
export const firebaseConfig = Object.freeze({
    apiKey: 'AIzaSyD6QV8DZyvmUYTyqaZWjjyyiG1SaUnOGko',
    authDomain: 'lone-wolf-klothing-db.firebaseapp.com',
    projectId: 'lone-wolf-klothing-db',
    storageBucket: 'lone-wolf-klothing-db.firebasestorage.app',
    messagingSenderId: '909420383434',
    appId: '1:909420383434:web:5ae43071bff200baa7b833',
    measurementId: 'G-1D2XN2T9D1'
});

// Lazy initialization for the future checkout integration. Importing this module
// alone makes no network requests and does not enable Analytics.
let appPromise;
export function getFirebaseApp() {
    if (!appPromise) {
        appPromise = import('https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js')
            .then(({ initializeApp, getApps, getApp }) =>
                getApps().some(app => app.name === '[DEFAULT]') ? getApp() : initializeApp(firebaseConfig))
            .catch(error => { appPromise = undefined; throw error; });
    }
    return appPromise;
}
