import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export const config = {
  runtime: "experimental-edge",
};

async function getImageDimensions(filePath) {
  const metadata = await sharp(filePath).metadata();
  return {
    width: metadata.width,
    height: metadata.height,
  };
}

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
    );

    try {
      const files = await fs.readdir(directoryPath);
      const images = await Promise.all(
        files
          .filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file))
          .map(async (file) => {
            const filePath = path.join(directoryPath, file);
            const { width, height } = await getImageDimensions(filePath);
            const url = new URL(
              `/images/${projectSlug}/${file}`,
              `http://${req.headers.get("host")}`
            ).toString();
            return {
              fileName: file,
              url,
              width,
              height,
            };
          })
      );

      return NextResponse.json(images);
    } catch (err) {
      return NextResponse.json({
        message: "Failed to read directory or process images",
        error: err.message,
      });
    }
  }

  return NextResponse.next();
}
