import Link from "next/link";
import React from "react";
import { FiSearch } from "react-icons/fi";

const ExploreTopic = () => {
  const tags = [
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
    <div className="max-w-3xl mx-auto px-5 mt-[90px] text-center font-mono">
      {/* Header */}
      <h1 className="text-3xl font-semibold mb-4">Explore Topics</h1>
      <p className="text-gray-600 mb-6">
        Discover topics, categories, and ideas curated for you.
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-3 mb-10">
        {tags.map((tag, index) => (
          <Link
            href={`/recommending?topic=${tag}`}
            key={index}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 transition rounded-full text-gray-800 text-sm"
          >
            {tag}
          </Link>
        ))}
      </div>

      {/* Rules / Tips Section */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-3">
          How to explore effectively
        </h3>

        <ul className="text-gray-700 space-y-2 text-sm">
          <li>• Start by searching for topics you are curious about.</li>
          <li>• Use category tags to discover curated collections.</li>
          <li>• Follow topics to personalize your content feed.</li>
          <li>• Explore related categories to expand your knowledge.</li>
          <li>• Check trending topics to stay updated.</li>
        </ul>
      </div>
    </div>
  );
};

export default ExploreTopic;
