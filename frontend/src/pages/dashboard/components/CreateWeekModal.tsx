import { useState } from "react";
import toast from "react-hot-toast";

type Props = {
  onClose: () => void;
  onSubmit: (weekStartDate: string, weekEndDate: string) => Promise<void>;
  existingWeeks: Array<{ weekStartDate: string; weekEndDate: string }>;
};

export default function CreateWeekModal({ onClose, onSubmit, existingWeeks }: Props) {
  const [weekStartDate, setWeekStartDate] = useState("");
  const [weekEndDate, setWeekEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!weekStartDate || !weekEndDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    const start = new Date(weekStartDate);
    const end = new Date(weekEndDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      toast.error("Invalid date format");
      return;
    }

    if (start > end) {
      toast.error("Start date cannot be after end date");
      return;
    }

    // Check if week already exists
    const weekExists = existingWeeks.some((week) => {
      const existingStart = new Date(week.weekStartDate);
      const existingEnd = new Date(week.weekEndDate);
      return (
        existingStart.toDateString() === start.toDateString() &&
        existingEnd.toDateString() === end.toDateString()
      );
    });

    if (weekExists) {
      toast.error("A timesheet for this week already exists");
      return;
    }

    try {
      setLoading(true);
      await onSubmit(weekStartDate, weekEndDate);
      toast.success("Week created successfully");
      onClose();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Failed to create timesheet";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Helper to get Monday of selected week
  const handleStartDateChange = (date: string) => {
    if (date) {
      const start = new Date(date);
      const day = start.getDay();
      const diff = day === 0 ? -6 : 1 - day; // Get to Monday
      const monday = new Date(start);
      monday.setDate(start.getDate() + diff);
      
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      
      setWeekStartDate(monday.toISOString().split("T")[0]);
      setWeekEndDate(sunday.toISOString().split("T")[0]);
    } else {
      setWeekStartDate(date);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-white shadow-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Create New Week</h2>
          <button
            onClick={onClose}
            className="cursor-pointer text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Week Start Date (Monday) <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={weekStartDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="mt-1 text-xs text-gray-400">
              Select any date in the week, it will automatically set to Monday
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Week End Date (Sunday) <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={weekEndDate}
              onChange={(e) => setWeekEndDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer flex-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Week"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer flex-1 rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
