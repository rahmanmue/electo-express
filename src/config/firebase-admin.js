import dotenv from "dotenv";
dotenv.config();

import admin from "firebase-admin";

const key = JSON.parse(process.env.FIREBASE_KEY);

admin.initializeApp({
  credential: admin.credential.cert(key),
  storageBucket: "final-project-fullstack.appspot.com",
});

export const bucket = admin.storage().bucket();
