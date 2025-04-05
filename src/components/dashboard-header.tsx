import { fetchCruxData } from "@/lib/api";
import { X } from "lucide-react";
import { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";

function DashboardHeader({ setData }: { setData: any }) {
  const [url, setUrl] = useState<string>("");
  const [urls, setUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleOnClick = async () => {
    await fetchCruxData({ setData, setError, setLoading, urls });
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
          <Button onClick={addUrl} disabled={loading}>
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
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading...
              </>
            ) : (
              "Fetch CrUX Data"
            )}
          </Button>

          {error && <p className="text-red-500">{error}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export default DashboardHeader;
