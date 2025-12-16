import EditContentForm from "@/app/components/editcontent";
import React from "react";

type Props = {
  params: Promise<{
    id: string;
  }>;
};
const Edit: React.FC<Props> = async ({ params }) => {
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
