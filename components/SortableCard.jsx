import React from "react";
import Image from "next/image";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Card } from "@/components/ui/card";

const SortableCard = ({ item, onDelete }) => {
  const uniqueId = item.id;
  const elements = item.children || [item];
  // const element = item.children ? item.children[0] : item;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: uniqueId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleButtonClick = () => {
    onDelete(uniqueId);
  };

  const isCursorGrabbing = attributes["aria-pressed"];

  return (
    <div ref={setNodeRef} style={style} key={uniqueId} className="w-full">
      <Card className="p-4 relative flex justify-between gap-2 group">
        <div className="flex items-center justify-between space-x-4 w-full">
          <div className="flex items-center space-x-4 overflow-hidden">
            <div className="flex flex-row gap-2 overflow-y-auto">
              {elements?.map((element) => (
                <Image
                  alt={element.fileName}
                  className="aspect-square object-cover"
                  height={100}
                  key={element.fileName}
                  src={element.url}
                  width={100}
                />
              ))}
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-ellipsis whitespace-nowrap">
                {item.caption}
              </p>
            </div>
          </div>
          <div className="flex justify-center items-center space-x-4">
            <button className="" onClick={handleButtonClick}>
              <svg
                className="text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
            <button
              {...attributes}
              {...listeners}
              className={` ${
                isCursorGrabbing ? "cursor-grabbing" : "cursor-grab"
              }`}
              aria-describedby={`DndContext-${uniqueId}`}
            >
              <svg viewBox="0 0 20 20" width="15">
                <path
                  d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"
                  fill="currentColor"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SortableCard;
