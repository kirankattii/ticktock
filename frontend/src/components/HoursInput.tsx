interface HoursInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  required?: boolean;
}

export default function HoursInput({
  value,
  onChange,
  min = 0,
  max = 24,
  label,
  required = false,
}: HoursInputProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="inline-flex items-center rounded-lg border border-gray-300 overflow-hidden">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="cursor-pointer px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
        >
          −
        </button>
        <span className="px-4 text-sm font-medium text-gray-800 min-w-[3rem] text-center">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="cursor-pointer px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}
