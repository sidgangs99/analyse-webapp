import { fetchCruxData } from "@/lib/api";
import { UrlData } from "@/lib/types";
import { LoaderCircle, X } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";

function DashboardHeader({
  setData,
}: {
  setData: Dispatch<SetStateAction<UrlData[]>>;
}) {
  const [url, setUrl] = useState<string>("");
  const [urls, setUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleOnClick = async () => {
    await fetchCruxData({ setData, setLoading, urls });
  };

  const addUrl = () => {
    if (url && !urls.includes(url)) {
      setUrls([...urls, url]);
      setUrl("");
    }
  };

  const removeUrl = (urlToRemove: string) => {
    setUrls(urls.filter((u) => u !== urlToRemove));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>CrUX Data Explorer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex w-full items-center space-x-2">
          <Input
            type="text"
            placeholder="Enter URL (e.g., https://example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addUrl()}
          />
          <Button onClick={addUrl} disabled={loading || !url}>
            Add URL
          </Button>
        </div>

        {urls.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {urls.map((url) => (
              <Badge
                key={url}
                variant="outline"
                className="flex items-center gap-1"
              >
                {url}
                <button onClick={() => removeUrl(url)} className="ml-1">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center space-x-4">
          <Button
            onClick={handleOnClick}
            disabled={loading || urls.length === 0}
          >
            {loading ? (
              <>
                <LoaderCircle className="animate-spin" />
                Fetching...
              </>
            ) : (
              "Fetch CrUX Data"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default DashboardHeader;
