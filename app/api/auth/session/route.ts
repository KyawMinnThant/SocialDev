import { cookies } from "next/headers";

export async function GET() {
  const cookiesfirebase = await cookies();
  const token = cookiesfirebase.get("user_token");
  const uid = cookiesfirebase.get("user_uid");

  return Response.json({
    loggedIn: !!token && !!uid,
    token: token ?? "",
  });
}
