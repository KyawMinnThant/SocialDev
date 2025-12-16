"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FiCornerUpLeft,
  FiEdit,
  FiTrash2,
  FiMoreVertical,
} from "react-icons/fi";
import {
  collection,
  onSnapshot,
  query,
  where,
  updateDoc,
  doc,
  getDocs,
  writeBatch,
  increment,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";

import Replybox from "./replybox";
import Replyinput from "./replyinput";

const Commentbox = ({ comment }: { comment: any }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replies, setReplies] = useState<any[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(
      collection(db, "replies"),
      where("commentId", "==", comment.id),
      where("postId", "==", comment.postId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const replyData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReplies(replyData);
        setLoadingReplies(false);
      },
      (error) => {
        console.error("Failed to listen to replies:", error);
        setLoadingReplies(false);
      }
    );

    return () => unsubscribe();
  }, [comment.id, comment.postId]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const saveEdit = async () => {
    if (!editText.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    try {
      const commentRef = doc(db, "comments", comment.id);
      await updateDoc(commentRef, { text: editText });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update comment:", error);
      alert("Failed to update comment, try again.");
    }
  };

  const deleteComment = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this comment and all its replies?"
      )
    )
      return;

    try {
      const repliesQuery = query(
        collection(db, "replies"),
        where("commentId", "==", comment.id)
      );
      const repliesSnapshot = await getDocs(repliesQuery);

      const batch = writeBatch(db);

      repliesSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      const commentRef = doc(db, "comments", comment.id);
      batch.delete(commentRef);

      const postRef = doc(db, "posts", comment.postId);
      batch.update(postRef, {
        comment: increment(-1),
      });

      await batch.commit();
    } catch (error) {
      console.error("Failed to delete comment and replies:", error);
      alert("Failed to delete comment and replies, try again.");
    }
  };

  return (
    <div className=" mx-auto px-2 sm:px-0">
      {/* Main comment container */}
      <article className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5 bg-white rounded-xl shadow-md border border-gray-100">
        {/* User image */}
        <img
          src={comment.userPhotoURL || "/default-profile.png"}
          alt={`${comment.username} profile`}
          className="w-14 h-14 rounded-full object-cover flex-shrink-0 border-2 border-indigo-500"
        />

        {/* Content area */}
        <div className="flex-1 min-w-0 flex flex-col w-full">
          {/* Header row: username and menu */}
          <header className="flex justify-between items-center gap-4 w-full">
            <h3
              className="font-semibold text-indigo-700 truncate text-lg"
              title={comment.username}
            >
              {comment.username}
            </h3>

            <div
              className="relative flex-shrink-0"
              ref={menuRef}
              tabIndex={-1}
              aria-haspopup="true"
              aria-expanded={menuOpen}
            >
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label="Open menu"
                className="p-2 rounded-full hover:bg-indigo-100 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <FiMoreVertical className="text-xl text-indigo-600" />
              </button>

              {menuOpen && (
                <nav
                  className="absolute right-0 top-full mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50 flex flex-col gap-2 p-3"
                  role="menu"
                >
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setEditText(comment.text);
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-sm text-indigo-700 hover:text-indigo-900 hover:underline focus:outline-none px-2 py-1 rounded"
                    role="menuitem"
                  >
                    <FiEdit className="text-lg" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      deleteComment();
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 hover:underline focus:outline-none px-2 py-1 rounded"
                    role="menuitem"
                  >
                    <FiTrash2 className="text-lg" />
                    Delete
                  </button>
                </nav>
              )}
            </div>
          </header>

          {/* Comment text or edit box */}
          <section className="mt-2">
            {isEditing ? (
              <>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full p-3 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-gray-800 placeholder-indigo-300"
                  rows={4}
                  placeholder="Edit your comment..."
                />
                <div className="mt-3 flex flex-wrap gap-3">
                  <button
                    onClick={saveEdit}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-400 whitespace-nowrap shadow-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition focus:outline-none focus:ring-2 focus:ring-gray-400 whitespace-nowrap shadow-sm"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap break-words leading-relaxed">
                {comment.text}
              </p>
            )}
          </section>

          {/* Reply button */}
          <footer className="mt-4">
            <button
              onClick={() => setShowReplyInput((prev) => !prev)}
              className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <FiCornerUpLeft className="text-lg" />
              Reply
            </button>
          </footer>

          {/* Reply input form */}
          {showReplyInput && (
            <div className="mt-4">
              <Replyinput commentId={comment.id} postId={comment.postId} />
            </div>
          )}
        </div>
      </article>

      {/* Replies */}
      <section aria-live="polite" className="mt-4">
        {loadingReplies && replies.length === 0 && (
          <p className="text-gray-400 italic ml-16">Loading replies...</p>
        )}

        {replies.map((reply) => (
          <div
            key={reply.id}
            className="sm:ml-0 md:ml-10 lg:ml-14 xl:ml-16 mt-4 border-l-2 border-indigo-100 pl-4"
          >
            <Replybox replies={reply} />
          </div>
        ))}
      </section>
    </div>
  );
};

export default Commentbox;
