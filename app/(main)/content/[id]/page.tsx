import Detailcontent from "@/app/components/detailcontent";
import React from "react";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

type DetailcontentProps = {
  params: Promise<{ id: string }>;
};

const ContentWithId: React.FC<DetailcontentProps> = async ({ params }) => {
  const cookiesToken = await cookies();
  const token = cookiesToken.get("user_token");

  // If token exists, redirect to /anime
  if (!token) {
    redirect("/");
  }
  const { id } = await params;

  const docRef = doc(db, "posts", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return <div>Content not found.</div>;
  }

  const data = docSnap.data();

  // Convert Firestore Timestamp to ISO string for serialization
  const contentData = {
    id: docSnap.id,
    ...data,
    createdAt:
      data?.createdAt && data.createdAt instanceof Timestamp
        ? data.createdAt.toDate().toISOString()
        : null,
  };

  return (
    <div>
      <Detailcontent content={contentData} />
    </div>
  );
};

export default ContentWithId;
