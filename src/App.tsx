"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef, SortingFn } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import CruxTable from "./components/curx-table";
import DashboardHeader from "./components/dashboard-header";
import { UrlData } from "./lib/types";

export default function CruxExplorer() {
  const [data, setData] = useState<UrlData[]>([]);

  const metricSort: SortingFn<UrlData> = (rowA, rowB, columnId) => {
    const a = Number(rowA.getValue(columnId) ?? 0);
    const b = Number(rowB.getValue(columnId) ?? 0);
    return a > b ? 1 : a < b ? -1 : 0;
  };

  const columns: ColumnDef<UrlData>[] = useMemo(
    () => [
      {
        accessorKey: "url",
        header: "URL",
        cell: ({ row }) => (
          <div className="font-medium max-w-[200px] truncate">
            {row.original.url}
          </div>
        ),
        enableSorting: true,
      },
      {
        id: "first_contentful_paint",
        header: "FCP",
        accessorFn: (row) =>
          row.data?.record?.metrics?.first_contentful_paint?.percentiles?.p75,
        cell: ({ getValue }) => {
          const v = getValue<number>();
          return renderMetricValue(v, 1800, 3000, "ms");
        },
        sortingFn: metricSort,
        enableSorting: true,
      },
      {
        id: "largest_contentful_paint",
        header: "LCP",
        accessorFn: (row) =>
          row.data?.record?.metrics?.largest_contentful_paint?.percentiles?.p75,
        cell: ({ getValue }) => {
          const v = getValue<number>();
          return renderMetricValue(v, 2500, 4000, "ms");
        },
        sortingFn: metricSort,
        enableSorting: true,
      },
      {
        id: "cumulative_layout_shift",
        header: "CLS",
        accessorFn: (row) =>
          row.data?.record?.metrics?.cumulative_layout_shift?.percentiles?.p75,
        cell: ({ getValue }) => {
          const v = getValue<number>();
          return renderMetricValue(v, 0.1, 0.25, "");
        },
        sortingFn: metricSort,
        enableSorting: true,
      },
      {
        id: "interaction_to_next_paint",
        header: "INP",
        accessorFn: (row) =>
          row.data?.record?.metrics?.interaction_to_next_paint?.percentiles
            ?.p75,
        cell: ({ getValue }) => {
          const v = getValue<number>();
          return renderMetricValue(v, 200, 500, "ms");
        },
        sortingFn: metricSort,
        enableSorting: true,
      },
      {
        id: "experimental_time_to_first_byte",
        header: "TTFB",
        accessorFn: (row) =>
          row.data?.record?.metrics?.experimental_time_to_first_byte
            ?.percentiles?.p75,
        cell: ({ getValue }) => {
          const v = getValue<number>();
          return renderMetricValue(v, 800, 1800, "ms");
        },
        sortingFn: metricSort,
        enableSorting: true,
      },
    ],
    []
  );

  const renderMetricValue = (
    value: number | undefined,
    goodThreshold: number,
    needsImprovementThreshold: number,
    unit: string = ""
  ) => {
    if (value === undefined) return "N/A";

    const isGood = value <= goodThreshold;
    const isNeedsImprovement = value <= needsImprovementThreshold && !isGood;

    return (
      <div className="flex items-center gap-2">
        <Badge
          variant={
            isGood ? "success" : isNeedsImprovement ? "average" : "destructive"
          }
        >
          {Number(value).toFixed(2)} {unit}
        </Badge>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <DashboardHeader setData={setData} />
      <CruxTable data={data} columns={columns} />
    </div>
  );
}
