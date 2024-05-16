import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Initialize Firebase Admin SDK using credentials from .env file
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID as string,
    privateKey: (process.env.FIREBASE_PRIVATE_KEY as string).replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
  })
});

export const messaging = admin.messaging();
