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

export default function FeedLibrary({ id, projectSlug }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { data: images } = useImages(projectSlug);

  const [feed, setFeed] = useFeed(projectSlug);
  const item = feed.find((item) => item.id === id);

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

    const currentActiveItemIndex = item.children.findIndex(
      (child) => child.id === active.id
    );
    const currentOverItemIndex = item.children.findIndex(
      (child) => child.id === over.id
    );

    if (currentActiveItemIndex === currentOverItemIndex) return; // Extra check, should be redundant

    const newChildren = Array.from(item.children);
    const [reorderedItem] = newChildren.splice(currentActiveItemIndex, 1);
    newChildren.splice(currentOverItemIndex, 0, reorderedItem);

    // After moving the item, we update positions based on the new order
    newChildren.forEach((child, index) => {
      child.position = index; // Reset position to match the current array index
    });

    item.children = newChildren; // Update the children with the newly ordered list

    // Update the feed state
    setFeed((prevFeed) =>
      prevFeed.map((feedItem) => (feedItem.id === item.id ? item : feedItem))
    );
  }

  function handleDelete(childId) {
    // Find the parent item of the child to be deleted
    const parentItem = feed.find((item) =>
      item.children.some((child) => child.id === childId)
    );

    if (!parentItem) return; // If no parent item found, do nothing

    // Filter out the child to be deleted
    const updatedChildren = parentItem.children.filter(
      (child) => child.id !== childId
    );

    // Update the position of each remaining child
    updatedChildren.forEach((child, index) => {
      child.position = index;
    });

    // Update the children of the parent item
    parentItem.children = updatedChildren;

    // Update the feed state
    setFeed((prevFeed) =>
      prevFeed.map((item) => (item.id === parentItem.id ? parentItem : item))
    );
  }

  function handleAddImageToCarousel(image) {
    const childItem = {
      id: idv4(),
      fileName: image.fileName,
      url: image.url,
      position: item.children.length + 1,
    };

    const updatedItem = {
      ...item,
      children: [...item.children, childItem],
    };

    const updatedFeed = feed.map((feedItem) =>
      feedItem.id === id ? updatedItem : feedItem
    );

    setFeed(updatedFeed);
  }

  return (
    <div className="space-y-12 p-6">
      <div className="space-y-6">
        <h2 className="text-left text-2xl font-semibold">Post</h2>
        <div className="flex flex-col items-center justify-center gap-6">
          {item?.children?.length ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            >
              <SortableContext
                items={item.children}
                strategy={verticalListSortingStrategy}
              >
                {item.children
                  .sort((a, b) => a.position - b.position)
                  .map((child) => (
                    <SortableCard
                      key={child.id}
                      item={child}
                      onDelete={handleDelete}
                    />
                  ))}
              </SortableContext>
            </DndContext>
          ) : (
            <SortableCard item={item} onDelete={handleDelete} />
          )}
        </div>
      </div>
      <div className="space-y-6">
        <h2 className="text-left text-2xl font-semibold">Library</h2>
        <div className="flex flex-col items-center justify-center gap-6">
          <Images
            addText="Add to Carousel"
            onAdd={handleAddImageToCarousel}
            projectSlug={projectSlug}
          />
        </div>
      </div>
    </div>
  );
}
