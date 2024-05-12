import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export const config = {
  runtime: "experimental-edge",
};

export async function GET(req) {
  const requestUrl = new URL(req.url);

  const projectSlug = requestUrl.searchParams.get("projectSlug");

  if (!projectSlug) {
    return NextResponse.error(new Error("Missing projectSlug"));
  }

  if (req.nextUrl.pathname.startsWith("/api/projects")) {
    const directoryPath = path.join(
      process.cwd(),
      `public/images/${projectSlug}`
    ); // Adjust 'public/images' as needed

    try {
      const files = await fs.readdir(directoryPath);
      const images = files
        .filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file))
        .map((file) => {
          const url = new URL(
            `/images/${projectSlug}/${file}`,
            `http://${req.headers.get("host")}`
          ).toString();
          return {
            fileName: file,
            url,
          };
        });

      return NextResponse.json(images);
    } catch (err) {
      return NextResponse.json({
        message: "Failed to read directory",
        error: err.message,
      });
    }
  }

  return NextResponse.next();
}
