import React from "react";
import TableHeader, { type TableColumnConfig } from "../../../components/TableHeader";

export type TableColumn<T> = {
  key: keyof T | string;
  header: string;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: string;
};

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  headerConfig: TableColumnConfig<T>[];
  loading?: boolean;
  onSort?: (column: keyof T | string, direction: "asc" | "desc") => void;
  sortColumn?: keyof T | string;
  sortDirection?: "asc" | "desc";
}

export default function Table<T extends Record<string, any>>({
  data,
  columns,
  headerConfig,
  loading = false,
  onSort,
  sortColumn,
  sortDirection,
}: TableProps<T>) {

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          <p>No data available</p>
        </div>
      </div>
    );
  }

  const getAlignmentClass = (align?: "left" | "center" | "right") => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
    }
  };

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <TableHeader
          columns={headerConfig}
          onSort={onSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
        />
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-gray-50 transition-colors"
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  style={column.width ? { width: column.width } : undefined}
                  className={`px-6 py-3 whitespace-nowrap text-sm text-gray-600 ${getAlignmentClass(
                    column.align
                  )}`}
                >
                  {column.render
                    ? column.render(
                        column.key in row ? row[column.key as keyof T] : "",
                        row
                      )
                    : column.key in row
                    ? String(row[column.key as keyof T])
                    : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
