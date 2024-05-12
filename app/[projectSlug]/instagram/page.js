"use client";

import { useState } from "react";
import { CopyIcon, SidebarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

import FeedLibrary from "@/app/[projectSlug]/instagram/FeedLibrary";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useFeed } from "@/lib/hooks/useFeed";

export default function InstagramFeed({ params }) {
  const { projectSlug } = params;

  const [libraryActive, setLibraryActive] = useState(false);
  const [feed, _setFeed] = useFeed(projectSlug);

  function handleLibraryToggle() {
    setLibraryActive((prev) => !prev);
  }

  if (!feed) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-2xl font-semibold text-center">Loading...</p>
      </main>
    );
  }

  return (
    <div
      className={cn(
        "grid",
        libraryActive && "grid-cols-4",
        !libraryActive && "grid-cols-3"
      )}
    >
      <div
        className={cn(
          "col-span-1 border-r h-screen overflow-y-auto",
          !libraryActive && "hidden"
        )}
      >
        <FeedLibrary projectSlug={projectSlug} />
      </div>
      <div className="col-span-3">
        <header className="flex items-center justify-between px-4 py-3 shadow-sm dark:bg-gray-950 dark:border-b dark:border-gray-800 md:px-6 lg:px-8">
          <Link href="/">
            <div className="flex items-center gap-3">
              <InstagramIcon className="h-6 w-6" />
              <h1 className="text-lg font-semibold">Instagram</h1>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Button size="icon" variant="ghost" onClick={handleLibraryToggle}>
              <SidebarIcon className="w-6 h-6" />
            </Button>
            <Avatar>
              <AvatarImage alt="User Avatar" src="/placeholder-user.jpg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="max-w-6xl mx-auto grid grid-cols-1 gap-4 p-4 md:grid-cols-3 md:gap-2 lg:px-8 lg:py-6">
          {feed.map((image) => (
            <Link href={`/${projectSlug}/instagram/${image.id}`} key={image.id}>
              <div className="relative">
                <Image
                  alt={image.children[0].fileName}
                  className="aspect-square w-full object-cover"
                  height={400}
                  src={image.children[0].url}
                  width={400}
                />
                {image.children.length > 1 && (
                  <div className="absolute top-4 right-4">
                    <CopyIcon className="w-6 h-6" color="white" />
                  </div>
                )}
              </div>
            </Link>
          ))}
        </main>
      </div>
    </div>
  );
}

function InstagramIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
