"use client";
import React, { useState } from "react";

export default function ContentTabs() {
  const [activeTab, setActiveTab] = useState("forYou");

  return (
    <div
      className="flex gap-6 w-full  mx-auto mt-10 border-b pb-2 text-gray-600 text-sm font-medium
      sm:w-full sm:px-4
      md:w-[80%] md:px-0
      lg:w-[90%]
    "
    >
      {/* For You */}
      <button
        onClick={() => setActiveTab("forYou")}
        className={`pb-2 transition-all ${
          activeTab === "forYou"
            ? "text-black border-b-2 border-black"
            : "hover:text-black"
        }`}
      >
        For You
      </button>

      {/* Following Content */}
      <button
        onClick={() => setActiveTab("following")}
        className={`pb-2 transition-all ${
          activeTab === "following"
            ? "text-black border-b-2 border-black"
            : "hover:text-black"
        }`}
      >
        Following Content
      </button>
    </div>
  );
}
