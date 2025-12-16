import React from "react";
import Createcontentform from "../../components/createcontentform";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

const CreateContent = () => {
  return (
    <div className=" mt-[90px] ml-[60px]">
      <Link
        href={`/`}
        className="inline-flex items-center  gap-2 text-gray-700 hover:bg-gray-200 rounded-md px-3 py-2 transition-shadow shadow-sm hover:shadow-md cursor-pointer select-none font-medium"
        aria-label="Go Back"
      >
        <FiArrowLeft className="text-lg" />
        Back
      </Link>
      <Createcontentform />
    </div>
  );
};

export default CreateContent;
