// app/page.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

export default function CruxExplorer() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCruxData = async () => {
    if (!url) {
      setError("Please enter a URL");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/crux", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const renderMetric = (
    value: number,
    goodThreshold: number,
    unit: string = ""
  ) => {
    value = Number(value);
    const isGood = value <= goodThreshold;
    return (
      <div className="flex items-center gap-2">
        <span>
          {value.toFixed(2)}
          {unit}
        </span>
        <Badge variant={isGood ? "default" : "destructive"}>
          {isGood ? "Good" : "Needs improvement"}
        </Badge>
      </div>
    );
  };

  const renderProgress = (value: number, max: number) => {
    const percentage = (value / max) * 100;
    return (
      <div className="flex items-center gap-2">
        <Progress value={percentage} className="w-[60%]" />
        <span>{value.toFixed(2)}</span>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>CrUX Data Explorer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex w-full items-center space-x-2 mb-4">
            <Input
              type="text"
              placeholder="Enter URL (e.g., https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button onClick={fetchCruxData} disabled={loading}>
              {loading ? "Loading..." : "Search"}
            </Button>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          {data && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Assessment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.record && (
                  <>
                    <TableRow>
                      <TableCell>First Contentful Paint (FCP)</TableCell>
                      <TableCell>
                        {renderProgress(
                          data.record.metrics.first_contentful_paint.percentiles
                            .p75,
                          3000
                        )}
                      </TableCell>
                      <TableCell>
                        {renderMetric(
                          data.record.metrics.first_contentful_paint.percentiles
                            .p75,
                          1800,
                          "ms"
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Largest Contentful Paint (LCP)</TableCell>
                      <TableCell>
                        {renderProgress(
                          data.record.metrics.largest_contentful_paint
                            .percentiles.p75,
                          4000
                        )}
                      </TableCell>
                      <TableCell>
                        {renderMetric(
                          data.record.metrics.largest_contentful_paint
                            .percentiles.p75,
                          2500,
                          "ms"
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Cumulative Layout Shift (CLS)</TableCell>
                      <TableCell>
                        {renderProgress(
                          data.record.metrics.cumulative_layout_shift
                            .percentiles.p75 * 100,
                          100
                        )}
                      </TableCell>
                      <TableCell>
                        {renderMetric(
                          data.record.metrics.cumulative_layout_shift
                            .percentiles.p75,
                          0.1
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>First Input Delay (FID)</TableCell>
                      <TableCell>
                        {renderProgress(
                          data.record.metrics.interaction_to_next_paint
                            .percentiles.p75,
                          300
                        )}
                      </TableCell>
                      <TableCell>
                        {renderMetric(
                          data.record.metrics.interaction_to_next_paint
                            .percentiles.p75,
                          100,
                          "ms"
                        )}
                      </TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
