import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export const config = {
  runtime: "experimental-edge",
};

export async function GET(req) {
  if (req.nextUrl.pathname.startsWith("/api/projects")) {
    const directoryPath = path.join(process.cwd(), `public/images`); // Adjust 'public/images' as needed

    try {
      const directories = await fs.readdir(directoryPath, {
        withFileTypes: true,
      });
      const folders = directories
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => {
          return {
            slug: dirent.name,
          };
        });

      return NextResponse.json(folders);
    } catch (err) {
      return NextResponse.json({
        message: "Failed to read directory",
        error: err.message,
      });
    }
  }

  return NextResponse.next();
}
