import Registerform from "@/app/components/registerform";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const Register = async () => {
  const cookiesToken = await cookies();
  const token = cookiesToken.get("user_token");

  // If token exists, redirect to /anime
  if (token) {
    redirect("/");
  }
  return (
    <div>
      <Registerform />
    </div>
  );
};

export default Register;
