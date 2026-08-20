import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./config";

export type UserRole = "volunteer" | "admin";

export type UserProfile = {
  name: string;
  email: string;
  role: UserRole;
  createdAt: unknown;
};

export async function createUserProfile(
  uid: string,
  name: string,
  email: string,
) {
  const userRef = doc(db, "users", uid);

  const existingUser = await getDoc(userRef);

  if (!existingUser.exists()) {
    await setDoc(userRef, {
      name,
      email,
      role: "volunteer",
      createdAt: serverTimestamp(),
    });
  }
}

export async function getUserProfile(uid: string) {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as UserProfile;
}