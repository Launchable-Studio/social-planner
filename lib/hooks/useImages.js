import useSWRMutation from "swr/mutation";
import useSWR from "swr";

import { fetcher, useApiRequest } from "@/lib/hooks/utils";

export function usePostImages() {
  const endpoint = "/api/projects/upload";
  const fetcher = useApiRequest();

  return useSWRMutation(endpoint, (path, { arg }) => {
    return fetcher({
      path,
      body: arg,
    });
  });
}

export function useImages(projectSlug) {
  const res = useSWR("/api/projects/get?projectSlug=" + projectSlug, fetcher);

  const { data, error } = res;
  return {
    data,
    error,
    isLoading: !data && !error,
  };
}
