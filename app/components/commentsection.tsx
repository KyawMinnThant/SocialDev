"use client";

import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import Commentbox from "./commentbox";

type Comment = {
  id: string;
  text: string;
  userId: string;
  photoUrl: string;
  createdAt: any;
};

type CommentsectionProps = {
  postId: string;
};

const Commentsection: React.FC<CommentsectionProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;

    // Create Firestore query to fetch comments for this post
    const q = query(collection(db, "comments"), where("postId", "==", postId));

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const commentsData: Comment[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Comment, "id">),
        }));

        setComments(commentsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching comments in realtime:", error);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount or postId change
    return () => unsubscribe();
  }, [postId]);

  if (loading) {
    return <p className="text-gray-500 mt-4">Loading comments...</p>;
  }

  return (
    <div className="mt-6 space-y-4">
      {comments.length === 0 && (
        <p className="text-gray-500">No comments yet.</p>
      )}

      {comments.map((comment) => (
        <Commentbox key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default Commentsection;
