import imagekit from "@/app/lib/imageKit";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const upload = await imagekit.upload({
    file: buffer,
    fileName: file.name,
    folder: "/posts",
  });

  return NextResponse.json({
    url: upload.url,
    fileId: upload.fileId,
  });
}
