export function useApiRequest() {
  return async ({ path, body }) => {
    const res = await fetch(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.status !== 200) {
      throw new Error(data.message);
    }

    return data;
  };
}

export const fetcher = async (url) => {
  const res = await fetch(url);

  console.log({ res });

  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message);
  }

  return data;
};
