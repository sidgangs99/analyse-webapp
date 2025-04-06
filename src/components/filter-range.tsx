import { Column } from "@tanstack/react-table";
import { useEffect, useState } from "react";

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => {
        e.stopPropagation();
        setValue(e.target.value);
      }}
    />
  );
}

export default function TableFilters({
  column,
}: {
  column: Column<any, unknown>;
}) {
  const { filterVariant }: any = column.columnDef.meta ?? {};
  const columnFilterValue = column.getFilterValue();

  return filterVariant === "range" ? (
    <div>
      <div className="flex flex-col gap-y-1">
        {/* See faceted column filters example for min max values functionality */}
        <DebouncedInput
          type="number"
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={`Min`}
          className="w-24 border shadow rounded px-1"
        />
        <DebouncedInput
          type="number"
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={`Max`}
          className="w-24 border shadow rounded px-1"
        />
      </div>
    </div>
  ) : (
    <DebouncedInput
      type="text"
      value={(columnFilterValue ?? "") as string}
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`Search... `}
      className="w-36 border shadow rounded px-1"
      list={column.id + "list"}
    />
  );
}
