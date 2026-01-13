import React, { useState } from "react";
import { format, parseISO, isValid } from "date-fns";

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (startDate: string, endDate: string) => void;
  className?: string;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onChange,
  className = "",
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatDateRange = () => {
    if (!startDate && !endDate) {
      return "Select date range";
    }
    
    try {
      if (startDate && endDate) {
        const start = parseISO(startDate);
        const end = parseISO(endDate);
        if (isValid(start) && isValid(end)) {
          return `${format(start, "MMM d, yyyy")} - ${format(end, "MMM d, yyyy")}`;
        }
      } else if (startDate) {
        const start = parseISO(startDate);
        if (isValid(start)) {
          return `From ${format(start, "MMM d, yyyy")}`;
        }
      } else if (endDate) {
        const end = parseISO(endDate);
        if (isValid(end)) {
          return `Until ${format(end, "MMM d, yyyy")}`;
        }
      }
    } catch (error) {
      console.error("Error formatting date:", error);
    }
    
    return "Select date range";
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    onChange(newStartDate, endDate);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    onChange(startDate, newEndDate);
  };

  const clearDates = () => {
    onChange("", "");
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-left text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
      >
        <span className={startDate || endDate ? "text-gray-900" : "text-gray-500"}>
          {formatDateRange()}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 mt-1 p-4 bg-white border border-gray-300 rounded-md shadow-lg min-w-[320px]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">Select Date Range</h3>
                {(startDate || endDate) && (
                  <button
                    type="button"
                    onClick={clearDates}
                    className="text-xs text-primary hover:text-blue-700"
                  >
                    Clear
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="startDate" className="block text-xs font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    max={endDate || undefined}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label htmlFor="endDate" className="block text-xs font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    min={startDate || undefined}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
