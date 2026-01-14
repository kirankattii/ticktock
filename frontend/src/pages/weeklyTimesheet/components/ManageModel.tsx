import { useState } from "react";
import type { DailyTaskPayload, DailyTask } from "../../../services/timesheet.service";
import Modal from "../../../components/Modal";
import Input from "../../../components/Input";
import Select from "../../../components/Select";
import Button from "../../../components/Button";
import HoursInput from "../../../components/HoursInput";
import { PROJECT_OPTIONS, TYPE_OF_WORK_OPTIONS } from "../../../constants/timesheet";

type Props = {
  onClose: () => void;
  onSubmit: (payload: DailyTaskPayload) => Promise<void>;
  initialTask?: DailyTask;
  defaultDate?: string;
};

export default function ManageModel({ onClose, onSubmit, initialTask, defaultDate }: Props) {
  const [project, setProject] = useState(initialTask?.project || "");
  const [typeOfWork, setTypeOfWork] = useState(initialTask?.typeOfWork || "");
  const [description, setDescription] = useState(initialTask?.description || "");
  const [hours, setHours] = useState(initialTask?.hours || 0);
  const date = initialTask?.date?.slice(0, 10) || defaultDate || new Date().toISOString().slice(0, 10);
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(initialTask);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit({
      date,
      project,
      typeOfWork,
      description,
      hours,
    });
    setLoading(false);
    onClose();
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={isEdit ? "Edit Entry" : "Add New Entry"}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">

        <Select
          label="Select Project"
          value={project}
          onChange={(e) => setProject(e.target.value)}
          options={PROJECT_OPTIONS}
          required
        />

        <Select
          label="Type of Work"
          value={typeOfWork}
          onChange={(e) => setTypeOfWork(e.target.value)}
          options={TYPE_OF_WORK_OPTIONS}
          required
        />

        <Input
          label="Task description"
          as="textarea"
          rows={4}
          placeholder="Write text here"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          helperText="A note for extra info"
        />

        <HoursInput
          label="Hours"
          value={hours}
          onChange={setHours}
          min={0}
          max={24}
          required
        />

        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            loading={loading}
            loadingText="Saving..."
            fullWidth
          >
            {isEdit ? "Update entry" : "Add entry"}
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