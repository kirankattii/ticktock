import { MoveUp, MoveDown } from "lucide-react";

export type TableColumnConfig<T> = {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: string;
};

interface TableHeaderProps<T> {
  columns: TableColumnConfig<T>[];
  onSort?: (column: keyof T | string, direction: "asc" | "desc") => void;
  sortColumn?: keyof T | string;
  sortDirection?: "asc" | "desc";
}

export default function TableHeader<T extends Record<string, any>>({
  columns,
  onSort,
  sortColumn,
  sortDirection,
}: TableHeaderProps<T>) {
  const handleSort = (column: keyof T | string) => {
    if (!onSort) return;
    const columnDef = columns.find((col) => col.key === column);
    if (!columnDef?.sortable) return;

    const newDirection =
      sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    onSort(column, newDirection);
  };

  const getSortIcon = (column: keyof T | string) => {
    if (sortColumn === column) {
      return sortDirection === "asc" ? (
        <MoveUp className="w-4 h-4 text-gray-600" />
      ) : (
        <MoveDown className="w-4 h-4 text-gray-600" />
      );
    }
    return <MoveUp className="w-4 h-4 text-gray-400" />;
  };

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

  const getFlexAlignmentClass = (align?: "left" | "center" | "right") => {
    switch (align) {
      case "center":
        return "justify-center";
      case "right":
        return "justify-end";
      default:
        return "justify-start";
    }
  };

  return (
    <thead className="bg-gray-50">
      <tr>
        {columns.map((column, index) => (
          <th
            key={index}
            scope="col"
            style={column.width ? { width: column.width } : undefined}
            className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${getAlignmentClass(
              column.align
            )} ${
              column.sortable ? "cursor-pointer hover:bg-gray-100" : ""
            }`}
            onClick={() => column.sortable && handleSort(column.key)}
          >
            <div
              className={`flex items-center gap-2 ${getFlexAlignmentClass(
                column.align
              )}`}
            >
              {column.header}
              {column.sortable && getSortIcon(column.key)}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}
