import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { format, parseISO, startOfWeek, addDays } from "date-fns";
import toast from "react-hot-toast";
import ManageModel from "./components/ManageModel";
import Navbar from "../../components/Navbar";
import ConfirmationModal from "../../components/ConfirmationModal";
import Loader from "../../components/Loader";
import DropdownMenu from "../../components/DropdownMenu";
import HoursProgress from "./components/HoursProgress";
import { validateTaskPayload } from "../../utils/validation";
import { formatDateLabel, formatWeekLabel } from "../../utils/dateFormat";
import {
  addDailyTask,
  createOrGetWeeklyTimesheet,
  deleteDailyTask,
  updateDailyTask,
  getWeeklyTimesheet,
  type WeeklyTimesheet as WeeklyTimesheetType,
  type DailyTask,
  type DailyTaskPayload,
} from "../../services/timesheet.service";

type ModalState =
  | { mode: "add"; date: string }
  | { mode: "edit"; task: DailyTask }
  | null;

const getWeekRange = () => {
  const now = new Date();
  const start = startOfWeek(now, { weekStartsOn: 1 }); // Monday as start of week
  const end = addDays(start, 6);
  return { start, end };
};

export default function WeeklyTimesheet() {
  const { id } = useParams<{ id?: string }>();
  const [timesheet, setTimesheet] = useState<WeeklyTimesheetType | null>(null);
  const [modalState, setModalState] = useState<ModalState>(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{ taskId: string; taskDescription: string } | null>(null);

  const { start, end } = useMemo(() => getWeekRange(), []);

  const [openMenuTaskId, setOpenMenuTaskId] = useState<string | null>(null);


  useEffect(() => {
    const fetchTimesheet = async () => {
      try {
        setLoading(true);

        let ts: WeeklyTimesheetType;
        if (id) {
          // Fetch specific timesheet by ID
          ts = await getWeeklyTimesheet(id);
        } else {
          // Fetch or create current week's timesheet
          ts = await createOrGetWeeklyTimesheet({
            weekStartDate: start.toISOString(),
            weekEndDate: end.toISOString(),
          });
        }
        setTimesheet(ts);
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || "Failed to load timesheet";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchTimesheet();
  }, [id, start, end]);

  const groupedByDate = useMemo(() => {
    const map = new Map<string, DailyTask[]>();
    if (timesheet) {
      timesheet.dailyTasks.forEach((task) => {
        const key = task.date.slice(0, 10);
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(task);
      });
    }
    return map;
  }, [timesheet]);

  const days = useMemo(() => {
    const arr: string[] = [];
    // Use timesheet dates if available, otherwise use current week
    const weekStart = timesheet
      ? parseISO(timesheet.weekStartDate)
      : start;
    for (let i = 0; i < 7; i++) {
      const day = addDays(weekStart, i);
      arr.push(format(day, "yyyy-MM-dd"));
    }
    return arr;
  }, [timesheet, start]);

  const handleAdd = async (payload: DailyTaskPayload) => {
    if (!timesheet) return;
    try {
      const validation = validateTaskPayload(payload);
      if (!validation.isValid) {
        validation.errors.forEach((error) => toast.error(error));
        return;
      }

      const task = await addDailyTask(timesheet._id, {
        ...payload,
        hours: Number(payload.hours),
      });
      setTimesheet({
        ...timesheet,
        dailyTasks: [...timesheet.dailyTasks, task],
        totalHours: (timesheet.totalHours || 0) + task.hours,
      });
      toast.success("Task added successfully");
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Failed to add task";
      toast.error(errorMessage);
    }
  };

  const handleEdit = async (taskId: string, payload: DailyTaskPayload) => {
    if (!timesheet) return;
    try {
      const validation = validateTaskPayload(payload);
      if (!validation.isValid) {
        validation.errors.forEach((error) => toast.error(error));
        return;
      }

      const oldTask = timesheet.dailyTasks.find((t) => t._id === taskId);
      const updated = await updateDailyTask(timesheet._id, taskId, payload);
      const newTasks = timesheet.dailyTasks.map((t) => (t._id === taskId ? updated : t));
      const oldHours = oldTask?.hours || 0;
      const newHours = updated.hours;
      const hoursDiff = newHours - oldHours;
      setTimesheet({
        ...timesheet,
        dailyTasks: newTasks,
        totalHours: (timesheet.totalHours || 0) + hoursDiff,
      });
      toast.success("Task updated successfully");
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Failed to update task";
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!timesheet) return;
    try {
      const taskToDelete = timesheet.dailyTasks.find((t) => t._id === taskId);
      await deleteDailyTask(timesheet._id, taskId);
      setTimesheet({
        ...timesheet,
        dailyTasks: timesheet.dailyTasks.filter((t) => t._id !== taskId),
        totalHours: (timesheet.totalHours || 0) - (taskToDelete?.hours || 0),
      });
      toast.success("Task deleted successfully");
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Failed to delete task";
      toast.error(errorMessage);
    }
  };

  const weekLabel = useMemo(() => {
    if (timesheet) {
      return formatWeekLabel(timesheet.weekStartDate, timesheet.weekEndDate);
    }
    return formatWeekLabel(start.toISOString(), end.toISOString());
  }, [timesheet, start, end]);

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto bg-white p-6 mt-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">This week's timesheet</h2>
          <HoursProgress totalHours={timesheet?.totalHours || 0} />
        </div>
            <p className="text-sm text-gray-500 mb-6">{weekLabel}</p>

        {loading && <Loader text="Loading..." className="justify-center mt-4" />}

        {!loading &&
          days.map((day) => {
            const tasks = groupedByDate.get(day) || [];
            const label = formatDateLabel(day);

            return (
              <div key={day} className="mb-6 flex gap-10">
                <p className="text-sm font-semibold text-gray-700 mt-2 w-20">{label}</p>

                <div className="space-y-2 flex-1">
                  {tasks.map((task) => (
                    <div
                      key={task._id}
                      className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 relative"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-800">{task.project}</span>
                        <span className="text-xs text-gray-500">{task.description}</span>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-500">{task.hours} hrs</span>

                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                          {task.project}
                        </span>

                        <div className="flex gap-2">
                          <DropdownMenu
                            isOpen={openMenuTaskId === task._id}
                            onClose={() => setOpenMenuTaskId(null)}
                            items={[
                              {
                                label: "Edit",
                                onClick: () => setModalState({ mode: "edit", task }),
                              },
                              {
                                label: "Delete",
                                onClick: () =>
                                  setDeleteConfirm({
                                    taskId: task._id,
                                    taskDescription: task.description,
                                  }),
                                variant: "danger",
                              },
                            ]}
                            trigger={
                              <button
                                onClick={() =>
                                  setOpenMenuTaskId(openMenuTaskId === task._id ? null : task._id)
                                }
                                className="cursor-pointer p-1 rounded hover:bg-gray-100"
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="text-gray-500"
                                >
                                  <circle cx="5" cy="12" r="2" />
                                  <circle cx="12" cy="12" r="2" />
                                  <circle cx="19" cy="12" r="2" />
                                </svg>
                              </button>
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => setModalState({ mode: "add", date: day })}
                    className="cursor-pointer w-full border border-dashed rounded-lg py-2 text-sm text-blue-600 hover:bg-blue-50"
                  >
                    + Add new task
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      {modalState && (
        <ManageModel
          onClose={() => setModalState(null)}
          defaultDate={modalState.mode === "add" ? modalState.date : undefined}
          initialTask={modalState.mode === "edit" ? modalState.task : undefined}
          onSubmit={async (payload) => {
            if (modalState.mode === "add") {
              await handleAdd(payload);
            } else {
              await handleEdit(modalState.task._id, payload);
            }
            setModalState(null);
          }}
        />
      )}

      {deleteConfirm && (
        <ConfirmationModal
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => {
            if (deleteConfirm) {
              handleDelete(deleteConfirm.taskId);
            }
          }}
          title="Confirm Delete"
          message={`Are you sure you want to delete the task "${deleteConfirm.taskDescription}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          confirmButtonColor="red"
        />
      )}
    </div>
  );
}
