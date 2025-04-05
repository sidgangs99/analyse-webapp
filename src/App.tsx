import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import CruxTable from "./components/curx-table";
import DashboardHeader from "./components/dashboard-header";
import { COLUMNS } from "./lib/constants";
import { UrlData } from "./lib/types";

export default function CruxExplorer() {
  const [data, setData] = useState<UrlData[]>([]);
  const columns: ColumnDef<UrlData>[] = useMemo(() => COLUMNS, []);

  return (
    <div className="container mx-auto py-8 space-y-6">
      <DashboardHeader setData={setData} />
      {data.length ? <CruxTable data={data} columns={columns} /> : null}
    </div>
  );
}
