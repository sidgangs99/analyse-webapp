import { UrlData } from "./types";

type FetchCruxDataParams = {
  urls: string[];
  setData: React.Dispatch<React.SetStateAction<UrlData[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
};

const FETCH_CRUX_BATCH_API = "/crux/batch";

export const fetchCruxData = async ({
  setError,
  setLoading,
  setData,
  urls,
}: FetchCruxDataParams) => {
  if (urls.length === 0) {
    setError("Please add at least one URL");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const response = await fetch(
      `http://localhost:5000/api${FETCH_CRUX_BATCH_API}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ urls }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const results = await response.json();
    setData(results);
  } catch (err) {
    setError(err instanceof Error ? err.message : "Unknown error");
  } finally {
    setLoading(false);
  }
};
