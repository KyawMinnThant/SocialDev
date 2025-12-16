"use client";

import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  increment,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebaseConfig";
import { useCommentStore } from "../store/useCommentStore";

const Commentinput = ({ post }: any) => {
  const [comment, setComment] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { setCommentCount } = useCommentStore();

  // ✅ Listen to auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  // ✅ Add comment
  const handleCommentInput = async () => {
    if (!user) {
      alert("You must be logged in to comment");
      return;
    }

    if (!comment.trim()) return;

    try {
      setLoading(true);

      await addDoc(collection(db, "comments"), {
        postId: post.id,
        postTitle: post.title,
        text: comment,
        userId: user.uid,
        username: user.displayName || "Anonymous",
        userPhotoURL: user.photoURL || null,
        createdAt: serverTimestamp(),
      });

      const postRef = doc(db, "posts", post.id);
      await updateDoc(postRef, {
        comment: increment(1),
      });

      setComment("");
      setCommentCount(post.comment);
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-gray-300">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg text-black outline-none focus:ring-2 focus:ring-indigo-500 transition"
        rows={3}
        placeholder={
          user ? "Write your comment..." : "Login to write a comment"
        }
        disabled={!user || loading}
      />

      <button
        onClick={handleCommentInput}
        disabled={!user || loading}
        className="mt-3 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold disabled:opacity-50"
      >
        {loading ? "Posting..." : "Add Comment"}
      </button>
    </div>
  );
};

export default Commentinput;
