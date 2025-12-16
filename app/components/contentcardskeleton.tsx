"use client";

export default function ContentCardSkeleton() {
  const cards = Array(5).fill(0);
  return (
    <div className="w-[95%] mx-auto space-y-6 mt-5 px-5">
      {cards.map((_, i) => (
        <div
          key={i}
          className="
            flex flex-col-reverse gap-4 p-5 bg-white rounded-lg shadow-md overflow-hidden
            md:flex-row
            h-fit
          "
        >
          {/* Left: Text skeleton */}
          <div className="flex-1 flex flex-col gap-2">
            {/* Title */}
            <div className="h-6 md:h-7 bg-gray-300 rounded w-3/5 animate-pulse mb-2"></div>

            {/* Author */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
            </div>

            {/* Description */}
            <div className="space-y-2 mb-2">
              <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-4/5 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3 animate-pulse"></div>
            </div>

            {/* Read More */}
            <div className="h-5 bg-gray-300 rounded w-24 animate-pulse"></div>

            {/* Comments and Likes */}
            <div className="flex items-center gap-6 mt-4">
              <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
            </div>
          </div>

          {/* Right: Image skeleton */}
          <div className="flex-shrink-0 w-full h-48 rounded-lg bg-gray-300 md:w-48 md:h-40 animate-pulse"></div>
        </div>
      ))}
    </div>
  );
}
