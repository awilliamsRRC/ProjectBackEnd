import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import serviceAccount from "../finalprojectbackend-42877-firebase-adminsdk-fbsvc-e0d0161086.json";
import { getAuth, Auth } from "firebase-admin/auth";
import admin from 'firebase-admin';

initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
});

// Function to assign a role to a user based on email
const assignRoleToUser = async (email: string, role: string) => {
    try {
      // Get the user by email
      const userRecord = await admin.auth().getUserByEmail(email);
  
      // Assign custom claims (role)
      await admin.auth().setCustomUserClaims(userRecord.uid, { role });
  
      console.log(`Role ${role} assigned to ${email}`);
    } catch (error) {
      console.error('Error assigning role:', error);
    }
  };

  assignRoleToUser('user1@example.com', 'user');  

  assignRoleToUser('user4@example.com', 'admin');

const auth: Auth = getAuth();
const db: Firestore = getFirestore();

export  {auth, db};