import EditContentForm from "@/app/components/editcontent";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: Promise<{
    id: string;
  }>;
};
const Edit: React.FC<Props> = async ({ params }) => {
  const cookiesToken = await cookies();
  const token = cookiesToken.get("user_token");

  // If token exists, redirect to /anime
  if (!token) {
    redirect("/");
  }
  const { id } = await params;
  //   const idValue = id.id;
  console.log("Editing content with ID:", id);
  return (
    <div>
      <EditContentForm id={id} />
    </div>
  );
};

export default Edit;
