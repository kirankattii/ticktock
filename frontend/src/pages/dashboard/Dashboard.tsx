import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { parseISO, addDays, isAfter, isBefore, isWithinInterval } from "date-fns";
import Filter from "./components/Filter";
import Table, { type TableColumn } from "./components/Table";
import Navbar from "../../components/Navbar";
import CreateWeekModal from "./components/CreateWeekModal";
import Pagination from "../../components/Pagination";
import StatusBadge from "../../components/StatusBadge";
import { formatWeekRange } from "../../utils/dateFormat";
import { getAllWeeklyTimesheets, createWeeklyTimesheet, type WeeklyTimesheet } from "../../services/timesheet.service";
import { Plus } from "lucide-react";

interface TimesheetRow {
  id: string;
  week: number;
  date: string;
  weekEndDate?: string;
  status: "completed" | "incomplete" | "missing";
  totalHours: number;
  action: string;
}

const getStatusFromTimesheet = (timesheet: WeeklyTimesheet): "completed" | "incomplete" | "missing" => {
  const totalHours = timesheet.totalHours || 0;

  if (totalHours === 0) {
    return "missing";
  } else if (totalHours >= 40) {
    return "completed";
  } else {
    return "incomplete";
  }
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [timesheets, setTimesheets] = useState<WeeklyTimesheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [sortColumn, setSortColumn] = useState<string>("week");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const fetchTimesheets = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllWeeklyTimesheets();

      if (response && typeof response === 'object' && 'timesheets' in response) {
        setTimesheets(response.timesheets);
      } else {
        // Fallback for old format (backward compatibility)
        const timesheetsArray = Array.isArray(response) ? response : (response as any)?.timesheets || [];
        setTimesheets(timesheetsArray);
      }
    } catch (err: any) {
      console.error("Failed to fetch timesheets:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data on mount
  useEffect(() => {
    fetchTimesheets();
  }, [fetchTimesheets]);

  const handleCreateWeek = async (weekStartDate: string, weekEndDate: string) => {
    try {
      await createWeeklyTimesheet({
        weekStartDate,
        weekEndDate,
      });
      // Refresh the data after creating a new timesheet
      fetchTimesheets();
      setShowCreateModal(false);
    } catch (err: any) {
      throw err; // Let the modal handle the error
    }
  };

  // Reset to page 1 when filters or items per page change
  useEffect(() => {
    setCurrentPage(1);
  }, [startDate, endDate, status, itemsPerPage]);

  // Convert timesheets to table rows with filtering, sorting, and pagination
  const { paginatedRows, totalFilteredItems } = useMemo(() => {
    // Step 1: Convert to table rows and assign week indices
    // First, sort by start date to assign week indices correctly
    const sortedForWeekIndex = [...timesheets].sort((a, b) => {
      const dateA = parseISO(a.weekStartDate).getTime();
      const dateB = parseISO(b.weekStartDate).getTime();
      return dateA - dateB;
    });

    let rows = sortedForWeekIndex.map((ts, index) => {
      const status = getStatusFromTimesheet(ts);
      let action = "View";
      if (status === "missing") {
        action = "Create";
      } else if (status === "incomplete") {
        action = "Update";
      }
      
      return {
        id: ts._id,
        week: index + 1,
        date: ts.weekStartDate,
        weekEndDate: ts.weekEndDate,
        status: status,
        totalHours: ts.totalHours || 0,
        action: action,
      };
    });

    // Step 2: Apply date filter
    if (startDate || endDate) {
      rows = rows.filter((row) => {
        try {
          const rowStartDate = parseISO(row.date);
          const rowEndDate = row.weekEndDate ? parseISO(row.weekEndDate) : addDays(rowStartDate, 6);
          
          let matchesStartDate = true;
          let matchesEndDate = true;
          
          // Check start date filter
          if (startDate) {
            const filterStartDate = parseISO(startDate);
            // Week matches if:
            // 1. The filter start date falls within the week range, OR
            // 2. The week starts on or after the filter start date
            matchesStartDate = 
              isWithinInterval(filterStartDate, { start: rowStartDate, end: rowEndDate }) ||
              isAfter(rowStartDate, filterStartDate) ||
              rowStartDate.getTime() === filterStartDate.getTime();
          }
          
          // Check end date filter
          if (endDate) {
            const filterEndDate = parseISO(endDate);
            // Week matches if:
            // 1. The filter end date falls within the week range, OR
            // 2. The week ends on or before the filter end date
            matchesEndDate = 
              isWithinInterval(filterEndDate, { start: rowStartDate, end: rowEndDate }) ||
              isBefore(rowEndDate, filterEndDate) ||
              rowEndDate.getTime() === filterEndDate.getTime();
          }
          
          return matchesStartDate && matchesEndDate;
        } catch (error) {
          // If date parsing fails, exclude the row
          console.error("Error parsing date:", error);
          return false;
        }
      });
    }

    // Step 3: Apply status filter
    if (status) {
      rows = rows.filter((row) => row.status === status);
    }

    // Step 4: Apply sorting
    const sortedRows = [...rows].sort((a, b) => {
      let comparison = 0;

      switch (sortColumn) {
        case "week":
          comparison = a.week - b.week;
          break;
        case "date":
          comparison = parseISO(a.date).getTime() - parseISO(b.date).getTime();
          break;
        case "totalHours":
          comparison = a.totalHours - b.totalHours;
          break;
        case "status":
          const statusOrder = { completed: 3, incomplete: 2, missing: 1 };
          comparison = (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0);
          break;
        default:
          comparison = 0;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    // Step 5: Apply pagination
    const totalItems = sortedRows.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = sortedRows.slice(startIndex, endIndex);

    return {
      paginatedRows: paginated,
      totalFilteredItems: totalItems,
    };
  }, [timesheets, startDate, endDate, status, sortColumn, sortDirection, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(totalFilteredItems / itemsPerPage);

  // Adjust current page if it exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const handleSort = (column: string, direction: "asc" | "desc") => {
    setSortColumn(column);
    setSortDirection(direction);
  };

  const handleView = (timesheetId: string) => {
    navigate(`/weekly-timesheet/${timesheetId}`);
  };

  // Table Header JSON Configuration
  const tableHeaderConfig: TableColumn<TimesheetRow>[] = [

    {
      key: "week",
      header: "WEEK #",
      sortable: true,
      align: "left",
    },
    {
      key: "date",
      header: "START DATE",
      sortable: true,
      align: "left",
    },
    {
      key: "totalHours",
      header: "TOTAL HOURS",
      sortable: true,
      align: "center",
    },
    {
      key: "status",
      header: "STATUS",
      sortable: true,
      align: "center",
    },
    {
      key: "action",
      header: "ACTIONS",
      sortable: false,
      align: "right",
    },
  ];

  const columns: TableColumn<TimesheetRow>[] = [
    {
      key: "week",
      header: "WEEK",
      sortable: true,
      align: "left",
      render: (value: number) => <span className="font-medium">{value}</span>,
    },
    {
      key: "date",
      header: "START DATE",
      sortable: true,
      align: "left",
      render: (value: string, row: TimesheetRow) => formatWeekRange(value, row.weekEndDate),
    },

    {
      key: "totalHours",
      header: "TOTAL HOURS",
      sortable: true,
      align: "center",
      render: (value: number) => (
        <span className="font-medium">{value} hrs</span>
      ),
    },
    {
      key: "status",
      header: "STATUS",
      sortable: true,
      align: "center",
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      key: "action",
      header: "ACTIONS",
      sortable: false,
      align: "right",
      render: (value: string, row: TimesheetRow) => (
        <button
          onClick={() => handleView(row.id)}
          className="text-primary hover:text-blue-700 font-medium text-sm cursor-pointer"
        >
          {value}
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      <Navbar />

      <div className="max-w-5xl mx-auto my-10">
        {/* Main Content */}
        <div className="max-w-5xl shadow-md rounded-lg  mx-auto p-6  ">
          {/* Filter Component */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Your Time Sheet</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="cursor-pointer px-4 py-2 bg-blue-600 flex gap-2 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Week</span>
            </button>
          </div>
          <Filter
            startDate={startDate}
            endDate={endDate}
            status={status}
            onStartDateChange={(value) => {
              setStartDate(value);
            }}
            onEndDateChange={(value) => {
              setEndDate(value);
            }}
            onStatusChange={(value) => {
              setStatus(value);
            }}
          />
          {/* Table Component */}
          <Table
            data={paginatedRows}
            columns={columns}
            headerConfig={tableHeaderConfig}
            loading={loading}
            onSort={handleSort}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
          />

        </div>

        
          {/* Rows Per Page Selector and Pagination */}
          <div className="shadow-md rounded-lg mx-auto p-3 mt-4">
          {!loading && totalFilteredItems > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
              {/* Rows Per Page Selector and Results Info */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label htmlFor="rowsPerPage" className="text-sm text-gray-700">
                    Rows per page:
                  </label>
                  <select
                    id="rowsPerPage"
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="px-3 py-1.5 text-sm border border-gray-600 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-gray-600"
                  >
                    <option value={5} className="text-gray-600">5</option>
                    <option value={10} className="text-gray-600">10</option>
                    <option value={20} className="text-gray-600">20</option>
                    <option value={50} className="text-gray-600">50</option>
                  </select>
                </div>
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalFilteredItems)}</span> of{" "}
                  <span className="font-medium">{totalFilteredItems}</span> results
                </div>
              </div>

              {/* Pagination Component */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
          </div>
      </div>

      {showCreateModal && (
        <CreateWeekModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateWeek}
          existingWeeks={timesheets.map((ts) => ({
            weekStartDate: ts.weekStartDate,
            weekEndDate: ts.weekEndDate,
          }))}
        />
      )}
    </div>
  );
}
