"use client";
import React from "react";
import Link from "next/link";
import { FiTrash2 } from "react-icons/fi";

type BookmarkType = {
  postId: string;
  title: string;
  description: string;
  categories: string[];
  image: { url: string };
  bookmarkedAt?: any;
  id: string;
};

type Props = {
  bookmark: BookmarkType;
  onRemove: (id: string) => void;
};

const BookmarkCard: React.FC<Props> = ({ bookmark, onRemove }) => {
  return (
    <div className="border rounded-lg p-4 flex gap-4 shadow-sm hover:shadow-md transition">
      <img
        src={bookmark.image?.url || "/placeholder.png"}
        alt={bookmark.title}
        className="w-24 h-24 object-cover rounded"
      />
      <div className="flex flex-col flex-1">
        <Link href={`/posts/${bookmark.postId}`}>
          <h3 className="text-lg font-semibold cursor-pointer hover:underline">
            {bookmark.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 line-clamp-3 mt-1">
          {bookmark.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {bookmark.categories.map((cat, idx) => (
            <span
              key={idx}
              className="bg-gray-200 rounded-full px-2 py-0.5 text-xs"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>
      <button
        onClick={() => onRemove(bookmark.id)}
        aria-label="Remove bookmark"
        className="text-red-500 hover:text-red-700 p-2"
      >
        <FiTrash2 size={20} />
      </button>
    </div>
  );
};

export default BookmarkCard;
