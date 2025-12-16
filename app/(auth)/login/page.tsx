import Loginform from "@/app/components/loginform";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const Login = async () => {
  const cookiesToken = await cookies();
  const token = cookiesToken.get("user_token");

  // If token exists, redirect to /anime
  if (token) {
    redirect("/");
  }

  return (
    <div>
      <Loginform />
    </div>
  );
};

export default Login;
