"use client";
import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useAuthStore } from "../../store/useAuthStore";

import Link from "next/link";
import BookmarkCard from "../../components/bookmarkcard";
import { FiArrowLeft } from "react-icons/fi";

type BookmarkType = {
  postId: string;
  title: string;
  description: string;
  categories: string[];
  image: { url: string };
  bookmarkedAt?: any;
  id: string;
};

const BookmarksPage = () => {
  const { user } = useAuthStore();
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setBookmarks([]);
      setLoading(false);
      return;
    }

    const fetchBookmarks = async () => {
      try {
        setLoading(true);

        const q = query(
          collection(db, "bookmarks"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);

        const bmks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as BookmarkType[];

        setBookmarks(bmks);
      } catch (error) {
        console.error("Failed to fetch bookmarks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [user]);

  const removeBookmark = async (bookmarkId: string) => {
    if (!user) {
      alert("Please log in to manage bookmarks.");
      return;
    }

    try {
      await deleteDoc(doc(db, "bookmarks", bookmarkId));
      setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
      alert("Bookmark removed");
    } catch (error) {
      console.error("Failed to remove bookmark:", error);
      alert("Failed to remove bookmark, please try again.");
    }
  };

  return (
    <main className="mt-[90px] font-mono max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center mb-10 gap-2 text-gray-700 hover:bg-gray-200 rounded-md px-3 py-2 transition-shadow shadow-sm hover:shadow-md cursor-pointer select-none font-medium"
        aria-label="Go Back"
      >
        <FiArrowLeft className="text-lg" />
        Back
      </Link>
      <h1 className="text-3xl font-bold mb-6">Your Bookmarks</h1>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-4 text-blue-500">Loading bookmarks...</span>
        </div>
      ) : bookmarks.length === 0 ? (
        <p className="text-gray-600">You have no bookmarks yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {bookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              onRemove={removeBookmark}
            />
          ))}
        </div>
      )}

      {!user && (
        <p className="text-lg text-gray-600">
          Please{" "}
          <Link href="/login" className="text-blue-600 underline">
            log in
          </Link>{" "}
          to see your bookmarks.
        </p>
      )}
    </main>
  );
};

export default BookmarksPage;
