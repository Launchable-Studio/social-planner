import { useState, useEffect } from "react";

export function useFeed(projectId) {
  const getInitialFeed = () => {
    if (typeof window === "undefined") return []; // Skip running on the server

    const savedFeed = localStorage.getItem(`feed--${projectId}`);
    return savedFeed ? JSON.parse(savedFeed) : []; // Initialize as an empty array if no feed found
  };

  const [feed, setFeed] = useState(getInitialFeed);

  useEffect(() => {
    // This effect updates local storage whenever the feed state changes
    const savedFeed = localStorage.getItem(`feed--${projectId}`);
    const parsedFeed = savedFeed ? JSON.parse(savedFeed) : [];
    if (JSON.stringify(feed) !== JSON.stringify(parsedFeed)) {
      localStorage.setItem(`feed--${projectId}`, JSON.stringify(feed));
      // Dispatch a custom event after changing the localStorage
      window.dispatchEvent(new Event("feed-updated"));
    }
  }, [feed, projectId]);

  useEffect(() => {
    // This effect listens for changes in local storage
    const handleFeedUpdate = () => {
      const savedFeed = localStorage.getItem(`feed--${projectId}`);
      const parsedFeed = savedFeed ? JSON.parse(savedFeed) : [];
      if (JSON.stringify(feed) !== JSON.stringify(parsedFeed)) {
        setFeed(parsedFeed);
      }
    };

    window.addEventListener("feed-updated", handleFeedUpdate);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("feed-updated", handleFeedUpdate);
    };
  }, [feed, projectId]);

  return [feed, setFeed];
}
