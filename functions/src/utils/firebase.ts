import { ServiceAccount, initializeApp } from 'firebase-admin/app';

import devConfig from './serviceAccounts/firebase-dev.json';
import prodConfig from './serviceAccounts/firebase-prod.json';
import { auth, credential, firestore } from 'firebase-admin';

const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

initializeApp({
  credential: credential.cert(<ServiceAccount>config),
});

const db = firestore();
const adminauth = auth();

export { db, adminauth };
