import {
  initializeApp,
  cert,
  ServiceAccount,
  AppOptions,
  App,
  getApps,
} from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";
import admin from "firebase-admin";

const getFirebaseConfig = (): AppOptions => {
  // Extract Firebase credentials from environment variables
  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } =
      process.env;

  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
      throw new Error(
          "Missing Firebase configuration. Please check your environment variables."
      );
  }

  console.log("Firebase Config:");
  console.log("Project ID:", FIREBASE_PROJECT_ID);
  console.log("Client Email:", FIREBASE_CLIENT_EMAIL);

  const serviceAccount: ServiceAccount = {
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  };

  return {
      credential: cert(serviceAccount),
  };
};

const initializeFirebaseAdmin = (): App => {
  const existingApp: App = getApps()[0];

  return existingApp || initializeApp(getFirebaseConfig());
};

// Initialize Firebase Admin app
const app: App = initializeFirebaseAdmin();
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

/**
* Assigns a role to a user based on their email.
* 
* @param email - User's email
* @param role - Role to assign (e.g., "admin", "user")
*/
const assignRoleToUser = async (email: string, role: string): Promise<void> => {
  try {
      const userRecord = await auth.getUserByEmail(email);
      await auth.setCustomUserClaims(userRecord.uid, { role });

      console.log(`Role '${role}' assigned to ${email}`);
  } catch (error) {
      console.error("Error assigning role:", error);
  }
};

// Example role assignments
assignRoleToUser("user1@example.com", "user");
assignRoleToUser("user2@example.com", "admin");

export { auth, db };
