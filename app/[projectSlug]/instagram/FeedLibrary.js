"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";

import SortableCard from "@/components/SortableCard";

import Images from "@/components/Images";
import { useImages } from "@/lib/hooks/useImages";
import { useFeed } from "@/lib/hooks/useFeed";
import { idv4 } from "@/lib/utils";

export default function FeedLibrary({ projectSlug }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { data: images } = useImages(projectSlug);

  const [feed, setFeed] = useFeed(projectSlug);

  if (!images) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-2xl font-semibold text-center">Loading...</p>
      </main>
    );
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over) return; // No over means the item was dropped outside the list
    if (active.id === over.id) return; // If the item is dropped on itself, do nothing

    const currentActiveItemIndex = feed.findIndex(
      (item) => item.id === active.id
    );
    const currentOverItemIndex = feed.findIndex((item) => item.id === over.id);

    if (currentActiveItemIndex === currentOverItemIndex) return; // Extra check, should be redundant

    const newFeed = Array.from(feed);
    const [reorderedItem] = newFeed.splice(currentActiveItemIndex, 1);
    newFeed.splice(currentOverItemIndex, 0, reorderedItem);

    // After moving the item, we update positions based on the new order
    newFeed.forEach((item, index) => {
      item.position = index; // Reset position to match the current array index
    });

    setFeed(newFeed); // Update the state with the newly ordered feed
  }

  function handleDelete(itemId) {
    // Filter out the item to be deleted
    const updatedFeed = feed.filter((item) => item.id !== itemId);

    // Update the position of each remaining item
    updatedFeed.forEach((item, index) => {
      item.position = index;
    });

    // Set the new state
    setFeed(updatedFeed);
  }

  function handleAddImageToFeed(image) {
    const item = {
      id: idv4(),
      caption: "",
      position: feed.length + 1,
      children: [
        {
          id: idv4(),
          fileName: image.fileName,
          url: image.url,
          position: 1,
          height: image.height,
          width: image.width,
        },
      ],
    };

    setFeed((prevFeed) => [...prevFeed, item]);
  }

  return (
    <div className="space-y-12 p-6">
      <div className="space-y-6">
        <h2 className="text-left text-2xl font-semibold">Feed</h2>
        <div className="flex flex-col items-center justify-center gap-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          >
            <SortableContext
              items={feed}
              strategy={verticalListSortingStrategy}
            >
              {feed
                .sort((a, b) => a.position - b.position)
                .map((item) => (
                  <SortableCard
                    key={item.id}
                    item={item}
                    onDelete={handleDelete}
                  />
                ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>
      <div className="space-y-6">
        <h2 className="text-left text-2xl font-semibold">Library</h2>
        <div className="flex flex-col items-center justify-center gap-6">
          <Images onAdd={handleAddImageToFeed} projectSlug={projectSlug} />
        </div>
      </div>
    </div>
  );
}
