import axios, { AxiosError } from "axios";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { UrlData } from "./types";

type FetchCruxDataParams = {
  urls: string[];
  setData: Dispatch<SetStateAction<UrlData[]>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
};
const BASE_API_ROUTE = import.meta.env.VITE_BASE_API_ROUTE;

const FETCH_CRUX_BATCH_API = `${BASE_API_ROUTE}/crux/batch`;
export const fetchCruxData = async ({
  setLoading,
  setData,
  urls,
}: FetchCruxDataParams) => {
  if (urls.length === 0) {
    toast.error("Please add at least one URL");
    return;
  }

  setLoading(true);

  try {
    const { data } = await axios.post(FETCH_CRUX_BATCH_API, { urls });

    setData(data);
  } catch (err) {
    toast.error(
      err instanceof AxiosError ? err.response?.data?.error : "Unknown error"
    );
  } finally {
    setLoading(false);
  }
};
