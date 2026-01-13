import { useState } from "react";
import type { DailyTaskPayload, DailyTask } from "../../../services/timesheet.service";

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
  const [date, setDate] = useState(
    initialTask?.date?.slice(0, 10) || defaultDate || new Date().toISOString().slice(0, 10)
  );
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-xl rounded-xl bg-white shadow-lg">
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">{isEdit ? "Edit Entry" : "Add New Entry"}</h2>
          <button onClick={onClose} className="cursor-pointer text-gray-400 hover:text-gray-600 text-xl">
            ×
          </button>
        </div>

        <hr className="border-gray-200" />

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
         {isEdit && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date <span className="">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
         )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Project <span className="">*</span>
            </label>
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              required
            >
              <option value="">Select a project</option>
              <option value="Project Alpha">Project Alpha</option>
              <option value="Project Beta">Project Beta</option>
              <option value="Project Gamma">Project Gamma</option>
              <option value="Project Delta">Project Delta</option>
              <option value="Project Epsilon">Project Epsilon</option>
              <option value="Internal Tools">Internal Tools</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type of Work <span className="">*</span>
            </label>
            <select
              value={typeOfWork}
              onChange={(e) => setTypeOfWork(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              required
            >
              <option value="">Select type of work</option>
              <option value="Development">Development</option>
              <option value="Bug Fixes">Bug Fixes</option>
              <option value="Code Review">Code Review</option>
              <option value="Testing">Testing</option>
              <option value="Documentation">Documentation</option>
              <option value="Design">Design</option>
              <option value="Meeting">Meeting</option>
              <option value="Planning">Planning</option>
              <option value="Research">Research</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task description <span className="">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Write text here"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="mt-1 text-xs text-gray-400">A note for extra info</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hours <span className="">*</span>
            </label>
            <div className="inline-flex items-center rounded-lg border border-gray-300 overflow-hidden">
              <button
                type="button"
                onClick={() => setHours((h) => Math.max(0, h - 1))}
                className="cursor-pointer px-3 py-1 text-gray-600 hover:bg-gray-100"
              >
                −
              </button>
              <span className="px-4 text-sm font-medium text-gray-800">{hours}</span>
              <button
                type="button"
                onClick={() => setHours((h) => Math.min(24, h + 1))}
                className="cursor-pointer px-3 py-1 text-gray-600 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer flex-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Saving..." : isEdit ? "Update entry" : "Add entry"}
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