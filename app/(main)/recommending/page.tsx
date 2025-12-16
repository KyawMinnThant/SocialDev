import React from "react";
import { db } from "@/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import ContentCard from "@/app/components/contentcard";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

type Props = {
  searchParams: Promise<{
    topic: string;
  }>;
};

const Recommending: React.FC<Props> = async ({ searchParams }) => {
  const { topic } = await searchParams;

  // Query posts where 'categories' array contains the topic
  const q = query(
    collection(db, "posts"),
    where("categories", "array-contains", topic)
  );
  const snapshot = await getDocs(q);

  // Map docs, convert Firestore Timestamp to string for serialization
  const posts = snapshot.docs.map((doc) => {
    const data = doc.data();

    // If createdAt exists and is a Firestore Timestamp, convert it
    const createdAt =
      data.createdAt && data.createdAt instanceof Timestamp
        ? data.createdAt.toDate().toISOString()
        : null;

    return {
      id: doc.id,
      ...data,
      createdAt,
    };
  });

  return (
    <div className=" font-mono mt-[90px] mx-auto">
      <Link
        href={`/`}
        className="flex w-fit items-center ml-[70px]  gap-2 text-gray-700 hover:bg-gray-200 rounded-md px-4 py-2 transition-shadow shadow-sm hover:shadow-md cursor-pointer select-none font-medium"
        aria-label="Go Back"
      >
        <FiArrowLeft className="text-lg" />
        Back
      </Link>
      <div className="p-6">
        <h1 className="text-3xl font-semibold  mb-4 text-center">
          Posts about "{topic}"
        </h1>
        {posts.length === 0 ? (
          <p>No posts found for this topic.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {posts.map((post) => (
              <ContentCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommending;
