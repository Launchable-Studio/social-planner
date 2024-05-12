"use client";

import Image from "next/image";

import { useImages } from "@/lib/hooks/useImages";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";

export default function Images({ addText, onAdd, projectSlug }) {
  const { data: images, isLoading } = useImages(projectSlug);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-2xl font-semibold text-center">Loading...</p>
      </main>
    );
  }

  if (images.error) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-2xl font-semibold text-center">
          {images.error.message}
        </p>
      </main>
    );
  }

  if (!images) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-2xl font-semibold text-center">No images found</p>
      </main>
    );
  }

  return (
    <div className="flex flex-wrap justify-center w-full gap-4">
      {images.map((image) => (
        <Card key={image.fileName}>
          <CardHeader>
            <Image
              className="w-full"
              src={image.url}
              alt={image.fileName}
              width={300}
              height={300}
            />
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => onAdd(image)}
              variant="primary"
              size="md"
              className="w-full"
            >
              {addText || "Add to Feed"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
