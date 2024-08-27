"use client";

import { useEffect, useState } from "react";
import { useFeed } from "@/lib/hooks/useFeed";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import {
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import Image from "next/image";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  GalleryHorizontal,
  SidebarIcon,
  PlusIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import FeedLibrary from "./FeedLibrary";

function InstagramPost({
  caption,
  child,
  isCarousel,
  onCaptionSave,
  onPrev,
  onNext,
  currentCarouselIndex,
  itemsLength,
}) {
  const [captionValue, setCaptionValue] = useState(caption);

  if (!child) {
    return null;
  }

  const aspectRatio = child.width / child.height;
  const maxWidth = 500; // Maximum width of the card
  const maxHeight = 500; // Maximum height of the image container

  let imageWidth, imageHeight;

  if (aspectRatio > 1) {
    // Landscape image
    imageWidth = Math.min(child.width, maxWidth);
    imageHeight = imageWidth / aspectRatio;
  } else {
    // Portrait or square image
    imageHeight = Math.min(child.height, maxHeight);
    imageWidth = imageHeight * aspectRatio;
  }

  const isWideImage = aspectRatio > 4 / 2.5;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="p-4 flex flex-row items-center">
        <Link
          className="flex items-center gap-2 text-sm font-semibold"
          href="#"
        >
          <Avatar className="w-8 h-8 border">
            <AvatarImage alt="@shadcn" src="/placeholder-user.jpg" />
            <AvatarFallback>AC</AvatarFallback>
          </Avatar>
          Acme Inc
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="ml-auto w-8 h-8 rounded-full"
              size="icon"
              variant="ghost"
            >
              <MoveHorizontalIcon className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <BookmarkIcon className="w-4 h-4 mr-2" />
              Save
            </DropdownMenuItem>
            <DropdownMenuItem>
              <StarIcon className="w-4 h-4 mr-2" />
              Add to favorites
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <FileWarningIcon className="w-4 h-4 mr-2" />
              Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-0">
        <div
          className="relative flex justify-center items-center"
          style={{ height: `${maxHeight}px` }}
        >
          <Image
            src={child.url}
            alt={child.fileName}
            className="object-contain"
            width={imageWidth}
            height={imageHeight}
            style={{ width: `${imageWidth}px`, height: `${imageHeight}px` }}
          />

          {isCarousel && (
            <div className="absolute inset-0 flex items-center justify-between opacity-0 hover:opacity-100">
              <div className="absolute inset-0 flex items-center justify-between p-2">
                <Button size="icon" variant="ghost" onClick={onPrev}>
                  <ArrowLeftIcon className="w-6 h-6 text-white" />
                </Button>
                <Button size="icon" variant="ghost" onClick={onNext}>
                  <ArrowRightIcon className="w-6 h-6 text-white" />
                </Button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between w-full p-2">
                <p className="text-white text-sm">
                  {currentCarouselIndex + 1} of {itemsLength}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-2 pb-4 grid gap-2">
        <div className="flex items-center w-full">
          <Button size="icon" variant="ghost">
            <HeartIcon className="w-4 h-4" />
            <span className="sr-only">Like</span>
          </Button>
          <Button size="icon" variant="ghost">
            <MessageCircleIcon className="w-4 h-4" />
            <span className="sr-only">Comment</span>
          </Button>
          <Button size="icon" variant="ghost">
            <SendIcon className="w-4 h-4" />
            <span className="sr-only">Share</span>
          </Button>
          <Button className="ml-auto" size="icon" variant="ghost">
            <BookmarkIcon className="w-4 h-4" />
            <span className="sr-only">Comment</span>
          </Button>
        </div>
        <div className="px-2 text-sm w-full grid gap-1.5">
          <div className="flex items-center">
            <span>200 likes</span>
          </div>
          <div className="space-x-1">
            <Link className="font-medium" href="#">
              Sabina
            </Link>
            <input
              className="border-b border-transparent focus:border-gray-300"
              type="text"
              placeholder="Add a description..."
              value={captionValue}
              onChange={(event) => setCaptionValue(event.target.value)}
              onBlur={onCaptionSave}
            />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export default function Post({ params }) {
  const { id, projectSlug } = params;

  const [isSideBySide, setIsSideBySide] = useState(false);
  const [libraryActive, setLibraryActive] = useState(false);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);

  const [feed, setFeed] = useFeed(projectSlug);

  const item = feed.find((item) => item.id === id);

  const isCarousel = item?.children?.length > 1;

  useEffect(() => {
    if (!item.children[currentCarouselIndex]) {
      setCurrentCarouselIndex(0);
    }
  }, [currentCarouselIndex, item.children]);

  function handleLibraryToggle() {
    setLibraryActive((prev) => !prev);
  }

  function handleSideBySideToggle() {
    setIsSideBySide((prev) => !prev);
  }

  function handleNext() {
    setCurrentCarouselIndex((prev) =>
      prev === item.children.length - 1 ? 0 : prev + 1
    );
  }

  function handlePrev() {
    setCurrentCarouselIndex((prev) =>
      prev === 0 ? item.children.length - 1 : prev - 1
    );
  }

  function handleCaptionSave(event) {
    const newCaption = event.target.value;
    const newFeed = feed.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          caption: newCaption,
        };
      }
      return item;
    });

    setFeed(newFeed);
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
        <FeedLibrary id={id} projectSlug={projectSlug} />
      </div>
      <div className="col-span-3">
        <header className="flex items-center justify-between px-4 py-3 shadow-sm dark:bg-gray-950 dark:border-b dark:border-gray-800 md:px-6 lg:px-8">
          <Link href={`/${projectSlug}/instagram`}>
            <div className="flex items-center gap-3">
              <InstagramIcon className="h-6 w-6" />
              <h1 className="text-lg font-semibold">Instagram</h1>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Button size="icon" variant="ghost" onClick={handleLibraryToggle}>
              <SidebarIcon className="w-6 h-6" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleSideBySideToggle}
            >
              <GalleryHorizontal className="w-6 h-6" />
            </Button>
            <Avatar>
              <AvatarImage alt="User Avatar" src="/placeholder-user.jpg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="flex justify-center items-center h-[calc(100vh-64px)]">
          {isSideBySide ? (
            <div className="flex justify-center flex-row w-full overflow-x-scroll">
              {item.children.map((child) => {
                const aspectRatio = child.width / child.height;
                const imageHeight = 500;
                const imageWidth = Math.round(imageHeight * aspectRatio);

                return (
                  <Image
                    key={child.id}
                    src={child.url}
                    alt={child.fileName}
                    className="object-contain"
                    height={imageHeight}
                    width={imageWidth}
                    style={{
                      height: `${imageHeight}px`,
                      width: `${imageWidth}px`,
                    }}
                  />
                );
              })}
            </div>
          ) : (
            <InstagramPost
              caption={item.caption}
              onCaptionSave={handleCaptionSave}
              child={item.children[currentCarouselIndex]}
              isCarousel={isCarousel}
              onPrev={handlePrev}
              onNext={handleNext}
              currentCarouselIndex={currentCarouselIndex}
              itemsLength={item.children.length}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function BookmarkIcon(props) {
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
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  );
}

function FileWarningIcon(props) {
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
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function HeartIcon(props) {
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
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
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

function MessageCircleIcon(props) {
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
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}

function MoveHorizontalIcon(props) {
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
      <polyline points="18 8 22 12 18 16" />
      <polyline points="6 8 2 12 6 16" />
      <line x1="2" x2="22" y1="12" y2="12" />
    </svg>
  );
}

function SendIcon(props) {
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
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function StarIcon(props) {
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
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
