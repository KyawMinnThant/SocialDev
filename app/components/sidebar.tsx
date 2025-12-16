"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FiHome, FiUser, FiSettings, FiLogOut } from "react-icons/fi";
import { auth } from "@/firebaseConfig"; // Adjust path if needed
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { clearAuthCookie } from "../lib/setAuthCookies";
import { IoBookmarkOutline, IoCreateOutline } from "react-icons/io5";

const Sidebar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [cookieValid, setCookieValid] = useState(false);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    // Call your API route to validate cookies
    const validateCookies = async () => {
      try {
        const res = await fetch("/api/auth/session"); // Adjust your API route if needed
        if (!res.ok) throw new Error("Failed to validate cookies");
        const data = await res.json();
        console.log(data);
        setCookieValid(data.loggedIn);
      } catch {
        setCookieValid(false);
      }
    };

    validateCookies();
  }, []);

  const handleLogout = async () => {
    try {
      const confirmSignout = window.confirm("Are you sure you want to logout?");
      if (!confirmSignout) return;
      await signOut(auth);
      await clearAuthCookie();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex flex-col p-4 space-y-2 w-full">
      <Link
        href="/"
        className="flex items-center gap-3 hover:bg-gray-200 rounded px-3 py-2 transition"
      >
        <FiHome size={18} />
        <span>Home</span>
      </Link>

      {/* Conditional rendering for Login/Logout */}
      {!user || !cookieValid ? (
        <p className=" w-[90%] text-gray-600 mx-2">
          To post content and bookmark content, you must login first. Login
          users can view their bookmark posts, view their profile and create the
          new posts as well as commenting on post and replying to comments
        </p>
      ) : (
        <div>
          <Link
            href="/profile"
            className="flex items-center gap-3 hover:bg-gray-200 rounded px-3 py-2 transition"
          >
            <FiUser size={18} />
            <span>Profile</span>
          </Link>

          <Link
            href="/createcontent"
            className="flex items-center gap-3 hover:bg-gray-200 rounded px-3 py-2 transition"
          >
            <IoCreateOutline size={18} />
            <span>Create Post</span>
          </Link>

          <Link
            href="/bookmark"
            className="flex items-center gap-3 hover:bg-gray-200 rounded px-3 py-2 transition"
          >
            <IoBookmarkOutline size={18} />
            <span>Bookmarks</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-600 hover:text-red-800 rounded px-3 py-2 transition text-left"
          >
            <FiLogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
