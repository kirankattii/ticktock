import { useState } from "react";
import toast from "react-hot-toast";
import Modal from "../../../components/Modal";
import Input from "../../../components/Input";
import Button from "../../../components/Button";

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
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Create New Week"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Week Start Date (Monday)"
          type="date"
          value={weekStartDate}
          onChange={(e) => handleStartDateChange(e.target.value)}
          required
          helperText="Select any date in the week, it will automatically set to Monday"
        />

        <Input
          label="Week End Date (Sunday)"
          type="date"
          value={weekEndDate}
          onChange={(e) => setWeekEndDate(e.target.value)}
          required
        />

        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            loading={loading}
            loadingText="Creating..."
            fullWidth
          >
            Create Week
          </Button>
          <Button
            type="button"
            onClick={onClose}
            variant="ghost"
            fullWidth
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
