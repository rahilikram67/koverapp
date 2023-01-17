import dotenv from "dotenv"
import admin from "firebase-admin"

dotenv.config()

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
})

class FirebaseDatabase {
  private static db: FirebaseFirestore.Firestore

  static getInstance() {
    if (FirebaseDatabase.db) return FirebaseDatabase.db

    const db = admin.firestore()

    FirebaseDatabase.db = db

    return db
  }
}

export default FirebaseDatabase
