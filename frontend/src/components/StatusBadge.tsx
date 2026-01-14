interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusColors: Record<string, string> = {
  completed: "bg-green-100 text-green-800",
  incomplete: "bg-yellow-100 text-yellow-800",
  missing: "bg-red-100 text-red-800",
};

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const colorClass = statusColors[status.toLowerCase()] || "bg-gray-100 text-gray-800";
  
  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-xl ${colorClass} ${className}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
