import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { auth } from "./config";
import { createUserProfile } from "./firestore";

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);

  const user = result.user;

  await createUserProfile(
    user.uid,
    user.displayName || "Volunteer",
    user.email || "",
  );

  return user;
};

export const logout = async () => {
  return await signOut(auth);
};