import Link from "next/link";
import React from "react";
import { FiUserPlus } from "react-icons/fi";

export default function RightPanel() {
  // Helper to sanitize topic strings for URLs
  const sanitizeTopic = (topic: string) => {
    return topic
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with hyphen
      .replace(/\//g, ""); // Remove slashes
  };

  const topics = [
    "Design",
    "UI/UX",
    "Creativity",
    "Development",
    "Marketing",
    "Business",
    "Photography",
    "Writing",
    "Music",
    "Art",
    "Technology",
    "Science",
    "Health",
    "Travel",
    "Food",
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Recommended Topics */}
      <div>
        <h2 className="text-gray-900 font-semibold mb-3">Recommended Topics</h2>
        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <Link
              href={`/recommending?topic=${topic}`}
              key={topic}
              className="px-3 py-1 text-sm bg-gray-100 rounded-full hover:bg-gray-200 cursor-pointer"
            >
              {topic}
            </Link>
          ))}
        </div>
      </div>

      {/* People to Follow */}
      <div>
        <h2 className="text-gray-900 font-semibold mb-3">People to Follow</h2>

        <div className="flex flex-col gap-4">
          {[
            { name: "John Doe", bio: "Frontend Developer" },
            { name: "Jane Smith", bio: "UI/UX Designer" },
            { name: "AnimeFan", bio: "Otaku & Reviewer" },
          ].map((user) => (
            <div key={user.name} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">{user.bio}</p>
              </div>

              <button className="border px-3 py-1 text-sm rounded hover:bg-gray-100 flex items-center gap-2">
                <FiUserPlus size={14} />
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Trending */}
      <div>
        <h2 className="text-gray-900 font-semibold mb-3">Trending Posts</h2>

        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((num) => (
            <div key={num} className="text-sm">
              <p className="font-medium">
                #{num} A beginner's guide to learning React today
              </p>
              <p className="text-xs text-gray-500">12k views · 3 days ago</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
