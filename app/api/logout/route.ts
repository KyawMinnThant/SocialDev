import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Cookies cleared" });

  response.cookies.delete("user_token");
  response.cookies.delete("user_uid");

  return response;
}
