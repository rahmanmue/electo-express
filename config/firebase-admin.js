import admin from "firebase-admin";
// import serviceAccount from "../lib/serviceAccountKey.json" assert { type: "json" };
import fs from "fs";
const serviceAccount = JSON.parse(
  fs.readFileSync("./lib/serviceAccountKey.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "final-project-fullstack.appspot.com",
});

export const bucket = admin.storage().bucket();
