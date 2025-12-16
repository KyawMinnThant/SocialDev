"use client";
import React, { useState, useRef, useEffect } from "react";

import {
  FiArrowLeft,
  FiHeart,
  FiMessageCircle,
  FiMoreVertical,
  FiBookmark,
} from "react-icons/fi";
import { BsFillHeartFill, BsBookmarkFill } from "react-icons/bs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Commentinput from "./commentinput";
import Commentsection from "./commentsection";
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
  updateDoc,
  arrayUnion,
  arrayRemove,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "@/firebaseConfig";
import { useCommentStore } from "../store/useCommentStore";
import { useAuthStore } from "../store/useAuthStore";

const Detailcontent = ({ content }: any) => {
  const [showInput, setShowInput] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuthStore();
  const { commentCount, setCommentCount } = useCommentStore();
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Like toggle state
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(content.likes || 0);

  // Bookmark toggle state & loading
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);

  // Init liked state on mount/content change
  useEffect(() => {
    if (content.likesUserIds?.includes(user?.uid)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
    setLikesCount(content.likes || 0);
  }, [content.likesUserIds, content.likes, user?.uid]);

  // Check if post is bookmarked by current user from bookmarks collection on mount or user change
  useEffect(() => {
    if (!user) {
      setBookmarked(false);
      return;
    }

    const checkBookmark = async () => {
      try {
        const bookmarkDocRef = doc(
          db,
          "bookmarks",
          `${user.uid}_${content.id}`
        );
        const bookmarkDocSnap = await getDoc(bookmarkDocRef);
        setBookmarked(bookmarkDocSnap.exists());
      } catch (error) {
        console.error("Failed to check bookmark:", error);
      }
    };

    checkBookmark();
  }, [user, content.id]);

  // User image and username depending on logged user
  const userimage =
    content.userId === user?.uid ? user?.photoURL : content.userimage;
  const username =
    content.userId === user?.uid ? user?.displayName : content.username;

  const categories = content.categories;

  useEffect(() => {
    setCommentCount(content.comment);
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [content.comment, setCommentCount]);

  // Delete post and related comments/replies
  const onDelete = async (postId: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirm) return;

    try {
      const batch = writeBatch(db);

      const commentQuery = query(
        collection(db, "comments"),
        where("postId", "==", postId)
      );
      const commentSnapshot = await getDocs(commentQuery);

      for (const commentDoc of commentSnapshot.docs) {
        const commentId = commentDoc.id;

        const replyQuery = query(
          collection(db, "replies"),
          where("commentId", "==", commentId)
        );
        const replySnapshot = await getDocs(replyQuery);

        replySnapshot.docs.forEach((replyDoc) => {
          batch.delete(doc(db, "replies", replyDoc.id));
        });

        batch.delete(doc(db, "comments", commentId));
      }

      batch.delete(doc(db, "posts", postId));

      await batch.commit();

      alert("Post and all related comments and replies deleted successfully.");
      router.push("/");
    } catch (error) {
      alert("Failed to delete post and related data.");
      console.error(error);
    }
  };

  // Toggle like/unlike handler
  const toggleLike = async () => {
    if (!user) {
      alert("Please log in to like posts.");
      return;
    }

    const postRef = doc(db, "posts", content.id);

    try {
      if (liked) {
        setLikesCount((prev: number) => Math.max(prev - 1, 0));
        setLiked(false);

        await updateDoc(postRef, {
          likes: likesCount - 1 >= 0 ? likesCount - 1 : 0,
          likesUserIds: arrayRemove(user.uid),
        });
      } else {
        setLikesCount((prev: number) => prev + 1);
        setLiked(true);

        await updateDoc(postRef, {
          likes: likesCount + 1,
          likesUserIds: arrayUnion(user.uid),
        });
      }
    } catch (error) {
      console.error("Failed to update likes:", error);
      alert("Failed to update like status, please try again.");
      setLiked((prev) => !prev);
      setLikesCount(content.likes || 0);
    }
  };

  // Toggle bookmark handler with bookmark collection logic
  const toggleBookmark = async () => {
    if (!user) {
      alert("Warning: Please log in to bookmark posts.");
      return;
    }

    setBookmarking(true);

    const bookmarkDocRef = doc(db, "bookmarks", `${user.uid}_${content.id}`);

    try {
      if (bookmarked) {
        // Remove bookmark doc
        await deleteDoc(bookmarkDocRef);
        setBookmarked(false);
        alert("Bookmark removed");
      } else {
        // Add bookmark doc with all post details + userId + createdAt for bookmark
        await setDoc(bookmarkDocRef, {
          postId: content.id,
          userId: user.uid,
          title: content.title,
          description: content.description,
          categories: content.categories,
          createdAt: content.createdAt,
          image: content.image,
          userimage: content.userimage,
          username: content.username,
          likes: content.likes || 0,
          commentCount: content.comment || 0,
          bookmarkedAt: new Date(),
        });
        setBookmarked(true);
        alert("Post bookmarked!");
      }
    } catch (error) {
      console.error("Failed to update bookmark:", error);
      alert("Failed to update bookmark status, please try again.");
    } finally {
      setBookmarking(false);
    }
  };

  return (
    <main className="mt-[90px] font-mono max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center mb-10 gap-2 text-gray-700 hover:bg-gray-200 rounded-md px-3 py-2 transition-shadow shadow-sm hover:shadow-md cursor-pointer select-none font-medium"
        aria-label="Go Back"
      >
        <FiArrowLeft className="text-lg" />
        Back
      </Link>

      <article className="bg-white rounded-lg shadow-md p-5 sm:p-8 relative">
        {/* Menu Icon */}
        {user?.uid === content.userId && auth.currentUser && (
          <div
            className="absolute top-3 right-3 bg-black rounded-full text-white z-20"
            ref={menuRef}
          >
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="More options"
              className="p-2 rounded-full hover:bg-gray-800 transition"
            >
              <FiMoreVertical className="text-white text-xl" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50">
                <Link
                  href={`/editcontent/${content.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                >
                  Edit Post
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(content.id);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                >
                  Delete Post
                </button>
              </div>
            )}
          </div>
        )}

        {/* Thumbnail Image */}
        <img
          src={content.image?.url}
          alt="thumbnail"
          className="w-full h-48 sm:h-64 md:h-72 object-cover rounded-lg"
        />

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold mt-6 leading-tight">
          {content.title}
        </h1>

        {/* Published Date */}
        <time
          dateTime={content.createdAt}
          className="text-gray-500 text-xs sm:text-sm mt-2 block"
        >
          Published on {content.createdAt}
        </time>

        {/* Author Info */}
        <div className="flex items-center gap-3 mt-4">
          <img
            src={userimage}
            alt={username || "Author"}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
          />
          <p className="font-semibold text-sm sm:text-base">{username}</p>
        </div>

        {/* Categories / Tags */}
        <div className="flex flex-wrap gap-2 mt-5">
          {categories?.map((cat: string, i: number) => (
            <span
              key={i}
              className="px-3 py-1 text-xs sm:text-sm bg-gray-200 rounded-full whitespace-nowrap"
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Description */}
        <section className="mt-6 text-gray-700 leading-relaxed space-y-4 text-sm sm:text-base">
          <p>{content.description}</p>
        </section>

        {/* Interaction Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-8 gap-4 sm:gap-0">
          <div className="flex items-center gap-6 font-semibold text-sm sm:text-base">
            {/* Like Button */}
            <button
              type="button"
              onClick={toggleLike}
              className={`flex items-center gap-2 cursor-pointer transition ${
                liked ? "text-red-500" : "text-gray-700 hover:text-red-500"
              }`}
              aria-pressed={liked}
              aria-label={liked ? "Unlike post" : "Like post"}
            >
              {liked ? (
                <BsFillHeartFill className="text-xl" />
              ) : (
                <FiHeart className="text-xl" />
              )}
              <span>{liked ? "Liked" : `Likes`}</span>
            </button>

            {/* Bookmark Button */}
            <button
              type="button"
              onClick={toggleBookmark}
              disabled={bookmarking}
              className={`flex items-center gap-2 cursor-pointer transition ${
                bookmarked
                  ? "text-yellow-500"
                  : "text-gray-700 hover:text-yellow-500"
              } ${bookmarking ? "opacity-50 cursor-not-allowed" : ""}`}
              aria-pressed={bookmarked}
              aria-label={bookmarked ? "Remove bookmark" : "Bookmark post"}
            >
              {bookmarked ? (
                <BsBookmarkFill className="text-xl" />
              ) : (
                <FiBookmark className="text-xl" />
              )}
              <span>
                {bookmarking
                  ? "Bookmarking..."
                  : bookmarked
                  ? "Bookmarked"
                  : "Bookmark"}
              </span>
            </button>

            {/* Comments Info */}
            <div
              className="flex items-center gap-2 cursor-pointer text-gray-700"
              aria-label="Number of comments"
            >
              <FiMessageCircle className="text-xl" />
              <span>{commentCount} Comments</span>
            </div>
          </div>

          {/* Toggle Comment Input */}
          {auth.currentUser ? (
            <button
              onClick={() => setShowInput(!showInput)}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition font-semibold text-sm sm:text-base"
              aria-expanded={showInput}
              aria-controls="comment-input"
            >
              Give Comment
            </button>
          ) : (
            <p className="text-sm sm:text-base text-gray-500">
              Please log in to give a comment.
            </p>
          )}
        </div>

        {/* Comment Input */}
        {showInput && <Commentinput post={content} />}

        {/* Comments Section */}
        <section className="mt-10">
          <h2 className="font-semibold mb-5 text-lg">Comments</h2>
          <Commentsection postId={content.id} />
        </section>
      </article>
    </main>
  );
};

export default Detailcontent;
