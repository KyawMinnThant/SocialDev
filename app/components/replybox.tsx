"use client";
import React, { useState, useRef, useEffect } from "react";
import { FiEdit, FiTrash2, FiMoreVertical } from "react-icons/fi";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";

const Replybox = ({ replies }: { replies: any }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async () => {
    if (!replies?.id) {
      alert("Reply ID missing!");
      return;
    }
    if (!confirm("Are you sure you want to delete this reply?")) return;

    try {
      await deleteDoc(doc(db, "replies", replies.id));
    } catch (error) {
      console.error("Failed to delete reply:", error);
      alert("Failed to delete reply, try again.");
    }
  };

  const saveEdit = async () => {
    if (!editText.trim()) {
      alert("Reply text cannot be empty.");
      return;
    }
    if (!replies?.id) {
      alert("Reply ID missing!");
      return;
    }
    try {
      const replyRef = doc(db, "replies", replies.id);
      await updateDoc(replyRef, { text: editText });
      setIsEditing(false);
      setEditText("");
    } catch (error) {
      console.error("Failed to update reply:", error);
      alert("Failed to update reply, try again.");
    }
  };

  return (
    <article className="flex flex-col sm:flex-row items-start gap-4 p-4 bg-gray-50 rounded-xl shadow-sm  mt-3 border border-gray-200">
      {/* User Profile Image */}
      <img
        src={
          replies?.user?.photoURL
            ? replies.user.photoURL
            : "/default-profile.png"
        }
        alt={`${replies?.user?.name || "User"} profile`}
        className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-indigo-400"
      />

      {/* Content Area */}
      <div className="flex-1 w-full flex flex-col">
        <header className="flex justify-between items-center gap-3">
          {/* Username */}
          <h4
            className="font-semibold text-indigo-700 truncate text-base"
            title={replies?.user?.name}
          >
            {replies?.user?.name || "Unknown User"}
          </h4>

          {/* Menu Button */}
          {!isEditing && (
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
                  className="absolute right-0 top-full mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50 flex flex-col gap-2 p-2"
                  role="menu"
                >
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setEditText(replies?.text || "");
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
                      handleDelete();
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
          )}
        </header>

        {/* Reply Text or Editing */}
        <section className="mt-2">
          {!isEditing ? (
            <p className="text-gray-700 whitespace-pre-wrap break-words leading-relaxed">
              {replies?.text}
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full p-3 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-gray-800 placeholder-indigo-300"
                rows={4}
                placeholder="Edit your reply..."
              />
              <div className="flex gap-3 flex-wrap">
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
            </div>
          )}
        </section>
      </div>
    </article>
  );
};

export default Replybox;
