import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { token, uid } = await req.json();

  if (!token || !uid) {
    return NextResponse.json(
      { success: false, message: "Missing token or uid" },
      { status: 400 }
    );
  }

  const cookieStore = await cookies();

  cookieStore.set({
    name: "user_token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });

  cookieStore.set({
    name: "user_uid",
    value: uid,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return NextResponse.json({ success: true });
}
