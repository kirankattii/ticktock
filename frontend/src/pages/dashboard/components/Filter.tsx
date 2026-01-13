import React from "react";
import { useForm } from "react-hook-form";
import DateRangePicker from "../../../components/DateRangePicker";

interface FilterFormData {
  status: string;
}

interface FilterProps {
  startDate: string;
  endDate: string;
  status: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export default function Filter({
  startDate,
  endDate,
  status,
  onStartDateChange,
  onEndDateChange,
  onStatusChange,
}: FilterProps) {
  const { register, watch, reset } = useForm<FilterFormData>({
    defaultValues: {
      status: status || "",
    },
  });

  // Update form when props change
  React.useEffect(() => {
    reset({
      status: status || "",
    });
  }, [status, reset]);

  const watchedStatus = watch("status");

  const handleDateRangeChange = (newStartDate: string, newEndDate: string) => {
    onStartDateChange(newStartDate);
    onEndDateChange(newEndDate);
  };

  React.useEffect(() => {
    if (watchedStatus !== status) {
      onStatusChange(watchedStatus || "");
    }
  }, [watchedStatus, status, onStatusChange]);

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      {/* Date Range Picker */}
      <div className="flex-1">
        <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-1">
          Date Range
        </label>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onChange={handleDateRangeChange}
          className="w-full"
        />
        <p className="mt-1 text-xs text-gray-400">
          Select a date range to filter weeks
        </p>
      </div>

      {/* Status Dropdown */}
      <div className="flex-1">
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          id="status"
          {...register("status")}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
        >
          <option value="">All Status</option>
          <option value="completed">COMPLETED</option>
          <option value="incomplete">INCOMPLETE</option>
          <option value="missing">MISSING</option>
        </select>
      </div>
    </div>
  );
}
