"use client";

import Link from "next/link";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useAuth } from "@/app/context/AuthContext";

export default function Navbar() {
  const { user, loading } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google sign-in failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="border-b border-gray-800">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold">
          SevaConnect
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/" className="text-gray-300 hover:text-white">
            Home
          </Link>

          <Link href="/events" className="text-gray-300 hover:text-white">
            Events
          </Link>

          <Link href="/dashboard" className="text-gray-300 hover:text-white">
            Dashboard
          </Link>

          <Link href="/admin" className="text-gray-300 hover:text-white">
            Admin
          </Link>

          {!loading && (
            <>
              {user ? (
                <button
                  onClick={handleLogout}
                  className="rounded-md border border-gray-700 px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={handleGoogleSignIn}
                  className="rounded-md bg-white px-4 py-2 text-black hover:bg-gray-200"
                >
                  Sign in with Google
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}