"use client";

import Link from "next/link";
import { FiMessageCircle, FiHeart } from "react-icons/fi";
import { useAuthStore } from "../store/useAuthStore";
import { motion } from "framer-motion";

export default function ContentCard({ post }: any) {
  const { user } = useAuthStore();

  const displayImage =
    user && user.uid === post.userid
      ? user.photoURL || post.userimage
      : post.userimage;

  const displayName =
    user && user.uid === post.userid
      ? user.displayName || post.username
      : post.username;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="
        mx-auto
        mt-5
        bg-white rounded-lg shadow-md overflow-hidden
        flex flex-col-reverse
        gap-4
        p-5
        max-w-4xl
        md:flex-row
        h-fit
      "
    >
      {/* Left: Text content */}
      <div className="flex-1 flex flex-col gap-2">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2 cursor-pointer">
          {post.title}
        </h2>

        <div className="flex gap-2 items-center mb-2">
          <img
            src={displayImage}
            alt={`${displayName} avatar`}
            className="w-8 h-8 rounded-full object-cover"
          />
          <p className="text-sm text-gray-600">
            By <span className="font-medium">{displayName}</span>
          </p>
        </div>

        <p className="text-gray-700 line-clamp-3 mb-2">{post.description}</p>

        <Link
          href={`/content/${post.id}`}
          className="text-blue-600 hover:underline font-medium cursor-pointer"
        >
          Read More
        </Link>

        <div className="flex items-center gap-6 text-gray-600 mt-4 text-sm md:text-base">
          <div className="flex items-center gap-1">
            <FiMessageCircle className="text-lg" />
            <span>{post.comments} Comments</span>
          </div>
          <div className="flex items-center gap-1">
            <FiHeart className="text-lg" />
            <span>{post.likes} Likes</span>
          </div>
        </div>
      </div>

      {/* Right: Image */}
      <div
        className="
          flex-shrink-0
          w-full
          h-48
          rounded-lg
          overflow-hidden
          bg-gray-200
          md:w-48
          md:h-40
        "
      >
        <img
          src={post.image?.url}
          alt="Content Thumbnail"
          className="w-full h-full object-cover"
        />
      </div>
    </motion.div>
  );
}
