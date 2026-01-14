import { type SelectHTMLAttributes } from "react";

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "className"> {
  label?: string;
  error?: string;
  required?: boolean;
  helperText?: string;
  options: Array<{ value: string; label: string }>;
  className?: string;
}

export default function Select({
  label,
  error,
  required,
  helperText,
  options,
  className = "",
  ...rest
}: SelectProps) {
  const baseClasses = "w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500";
  const selectClasses = error
    ? `${baseClasses} border-red-300 focus:border-red-500 text-gray-600`
    : `${baseClasses} border-gray-600 focus:border-blue-500 text-gray-600`;

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        {...rest}
        className={`${selectClasses} ${className}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="text-gray-600">
            {option.label}
          </option>
        ))}
      </select>
      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-400">{helperText}</p>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
