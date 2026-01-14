import { type ReactNode } from "react";
import Loader from "./Loader";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger" | "ghost";
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  className?: string;
  fullWidth?: boolean;
}

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  loading = false,
  loadingText,
  className = "",
  fullWidth = false,
}: ButtonProps) {
  const baseClasses = "cursor-pointer px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500 disabled:opacity-60 disabled:cursor-not-allowed",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:opacity-60 disabled:cursor-not-allowed",
    ghost: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 disabled:opacity-60 disabled:cursor-not-allowed",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <Loader size="sm" />
          <span>{loadingText || "Loading..."}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
