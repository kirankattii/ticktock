import api from "./api";

export type DailyTaskPayload = {
  date: string;
  project: string;
  typeOfWork: string;
  description: string;
  hours: number;
};

export type DailyTask = DailyTaskPayload & {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
};

export type WeeklyTimesheet = {
  _id: string;
  weekStartDate: string;
  weekEndDate: string;
  dailyTasks: DailyTask[];
  totalHours?: number;
};

export const createOrGetWeeklyTimesheet = async (payload: {
  weekStartDate: string;
  weekEndDate: string;
}) => {
  const { data } = await api.post("/timesheet", payload);
  return data.timesheet as WeeklyTimesheet;
};

export const createWeeklyTimesheet = async (payload: {
  weekStartDate: string;
  weekEndDate: string;
}) => {
  const { data } = await api.post("/timesheet", payload);
  return data.timesheet as WeeklyTimesheet;
};

export const getWeeklyTimesheet = async (id: string) => {
  const { data } = await api.get(`/timesheet/${id}`);
  return data.timesheet as WeeklyTimesheet;
};

export type PaginationParams = {
  page?: number;
  limit?: number;
};

export type PaginationResponse = {
  timesheets: WeeklyTimesheet[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
};

export const getAllWeeklyTimesheets = async (params?: PaginationParams) => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  
  const queryString = queryParams.toString();
  const url = queryString ? `/timesheet?${queryString}` : "/timesheet";
  
  const { data } = await api.get(url);
  
  // If pagination metadata exists, return it; otherwise return just the array (backward compatibility)
  if (data.pagination) {
    return {
      timesheets: data.timesheets as WeeklyTimesheet[],
      pagination: data.pagination,
    } as PaginationResponse;
  }
  
  return {
    timesheets: data.timesheets as WeeklyTimesheet[],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: data.timesheets?.length || 0,
      itemsPerPage: data.timesheets?.length || 0,
    },
  } as PaginationResponse;
};

export const addDailyTask = async (timesheetId: string, payload: DailyTaskPayload) => {
  const { data } = await api.post(`/timesheet/${timesheetId}/task`, payload);
  return data.task as DailyTask;
};

export const updateDailyTask = async (
  timesheetId: string,
  taskId: string,
  payload: Partial<DailyTaskPayload>
) => {
  const { data } = await api.put(`/timesheet/${timesheetId}/task/${taskId}`, payload);
  return data.task as DailyTask;
};

export const deleteDailyTask = async (timesheetId: string, taskId: string) => {
  await api.delete(`/timesheet/${timesheetId}/task/${taskId}`);
};
