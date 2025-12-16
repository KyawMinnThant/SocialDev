"use client";

import React, { useState, FormEvent } from "react";
import { getAuth } from "firebase/auth";
import { db } from "@/firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

type ReplyFormProps = {
  postId: string;
  commentId: string;
};

const ReplyForm: React.FC<ReplyFormProps> = ({ postId, commentId }) => {
  const [text, setText] = useState("");
  const auth = getAuth();
  const user = auth.currentUser;

  const handleReplySubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !text.trim()) return;

    // ✅ FormData
    const formData = new FormData();
    formData.append("postId", postId);
    formData.append("commentId", commentId);
    formData.append("text", text);
    formData.append("userId", user.uid);
    formData.append("userName", user.displayName || "Anonymous");
    formData.append("userPhotoURL", user.photoURL || "");

    // ✅ Extract FormData values
    const replyData = {
      postId: formData.get("postId"),
      commentId: formData.get("commentId"),
      text: formData.get("text"),
      user: {
        id: formData.get("userId"),
        name: formData.get("userName"),
        photoURL: formData.get("userPhotoURL"),
      },
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "replies"), replyData);
      setText("");
    } catch (error) {
      console.error("Failed to add reply", error);
    }
  };

  return (
    <form onSubmit={handleReplySubmit} className="mt-2 flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a reply..."
        className="flex-1 border px-3 py-1 rounded"
      />

      <button
        type="submit"
        className="text-sm text-white bg-black p-2 rounded-md font-medium"
      >
        Reply
      </button>
    </form>
  );
};

export default ReplyForm;
