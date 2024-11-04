import admin from "firebase-admin";
import serviceAccount from "./../lib/serviceAccountKey";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "final-project-fullstack.appspot.com",
});

export const bucket = admin.storage().bucket();
