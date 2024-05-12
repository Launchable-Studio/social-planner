import useSWR from "swr";

import { fetcher } from "@/lib/hooks/utils";

export function useProjects() {
  const res = useSWR("/api/projects", fetcher);

  const { data, error } = res;
  return {
    data,
    error,
    isLoading: !data && !error,
  };
}
