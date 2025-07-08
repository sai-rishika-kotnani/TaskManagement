// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useTask } from "../contexts/TaskContext";
// import { Plus, Filter, Search, Eye, Edit, Trash2 } from "lucide-react";
// import { format } from "date-fns";

// const Tasks = () => {
//   const { getTasks, tasks, loading, deleteTask } = useTask();
//   const navigate = useNavigate();
//   const [filters, setFilters] = useState({
//     search: "",
//     status: "",
//     priority: "",
//     category: "",
//   });

//   useEffect(() => {
//     getTasks();
//   }, []);

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSearch = () => {
//     const searchFilters = Object.keys(filters).reduce((acc, key) => {
//       if (filters[key]) {
//         acc[key] = filters[key];
//       }
//       return acc;
//     }, {});
//     getTasks(searchFilters);
//   };

//   const getStatusBadgeClass = (status) => {
//     switch (status) {
//       case "completed":
//         return "badge badge-completed";
//       case "in-progress":
//         return "badge badge-in-progress";
//       case "pending":
//         return "badge badge-pending";
//       case "cancelled":
//         return "badge badge-cancelled";
//       default:
//         return "badge badge-pending";
//     }
//   };

//   const getPriorityBadgeClass = (priority) => {
//     switch (priority) {
//       case "urgent":
//         return "badge badge-urgent";
//       case "high":
//         return "badge badge-high";
//       case "medium":
//         return "badge badge-medium";
//       case "low":
//         return "badge badge-low";
//       default:
//         return "badge badge-medium";
//     }
//   };

//   const handleDeleteTask = async (taskId, e) => {
//     e.stopPropagation();
//     if (window.confirm("Are you sure you want to delete this task?")) {
//       const success = await deleteTask(taskId);
//       if (success) {
//         getTasks(); // Refresh the task list
//       }
//     }
//   };

//   if (loading) {
//     return (
//       <div className="loading">
//         <div className="spinner"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-gray-600">Manage and track your tasks</p>
//         </div>
//         <button
//           onClick={() => navigate("/tasks/new")}
//           className="btn btn-primary"
//         >
//           <Plus size={20} />
//           New Task
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="bg-white p-6 rounded-lg shadow-sm border">
//         <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//           <div className="md:col-span-2">
//             <div className="relative">
//               <Search
//                 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                 size={20}
//               />
//               <input
//                 type="text"
//                 name="search"
//                 placeholder="Search tasks..."
//                 className="form-input pl-10"
//                 value={filters.search}
//                 onChange={handleFilterChange}
//               />
//             </div>
//           </div>
//           <div>
//             <select
//               name="status"
//               className="form-select"
//               value={filters.status}
//               onChange={handleFilterChange}
//             >
//               <option value="">All Status</option>
//               <option value="pending">Pending</option>
//               <option value="in-progress">In Progress</option>
//               <option value="completed">Completed</option>
//               <option value="cancelled">Cancelled</option>
//             </select>
//           </div>
//           <div>
//             <select
//               name="priority"
//               className="form-select"
//               value={filters.priority}
//               onChange={handleFilterChange}
//             >
//               <option value="">All Priorities</option>
//               <option value="low">Low</option>
//               <option value="medium">Medium</option>
//               <option value="high">High</option>
//               <option value="urgent">Urgent</option>
//             </select>
//           </div>
//           <button onClick={handleSearch} className="btn btn-outline">
//             <Filter size={20} />
//             Filter
//           </button>
//         </div>
//       </div>

//       {/* Task List */}
//       <div className="bg-white rounded-lg shadow-sm border">
//         {tasks.length === 0 ? (
//           <div className="text-center py-12">
//             <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
//               <Plus className="text-gray-400" size={32} />
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">
//               No tasks found
//             </h3>
//             <p className="text-gray-500 mb-6">
//               Get started by creating your first task.
//             </p>
//             <button
//               onClick={() => navigate("/tasks/new")}
//               className="btn btn-primary"
//             >
//               <Plus size={20} />
//               Create Task
//             </button>
//           </div>
//         ) : (
//           <div className="overflow-hidden">
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th>Task</th>
//                   <th>Assigned To</th>
//                   <th>Status</th>
//                   <th>Priority</th>
//                   <th>Due Date</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {tasks.map((task) => (
//                   <tr
//                     key={task._id}
//                     className="hover:bg-gray-50 cursor-pointer"
//                     onClick={() => navigate(`/tasks/${task._id}`)}
//                   >
//                     <td>
//                       <div>
//                         <div className="font-medium text-gray-900">
//                           {task.title}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           {task.description.length > 60
//                             ? `${task.description.substring(0, 60)}...`
//                             : task.description}
//                         </div>
//                       </div>
//                     </td>
//                     <td>
//                       <div className="flex items-center space-x-2">
//                         <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
//                           {task.assignedTo?.name?.charAt(0)?.toUpperCase()}
//                         </div>
//                         <span className="text-sm font-medium text-gray-900">
//                           {task.assignedTo?.name}
//                         </span>
//                       </div>
//                     </td>
//                     <td>
//                       <span className={getStatusBadgeClass(task.status)}>
//                         {task.status}
//                       </span>
//                     </td>
//                     <td>
//                       <span className={getPriorityBadgeClass(task.priority)}>
//                         {task.priority}
//                       </span>
//                     </td>
//                     <td>
//                       <span className="text-sm text-gray-900">
//                         {format(new Date(task.dueDate), "MMM d, yyyy")}
//                       </span>
//                     </td>
//                     <td>
//                       <div className="flex items-center space-x-2">
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             navigate(`/tasks/${task._id}`);
//                           }}
//                           className="p-1 text-gray-400 hover:text-blue-600"
//                           title="View Task"
//                         >
//                           <Eye size={16} />
//                         </button>
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             navigate(`/tasks/${task._id}/edit`);
//                           }}
//                           className="p-1 text-gray-400 hover:text-green-600"
//                           title="Edit Task"
//                         >
//                           <Edit size={16} />
//                         </button>
//                         <button
//                           onClick={(e) => handleDeleteTask(task._id, e)}
//                           className="p-1 text-gray-400 hover:text-red-600"
//                           title="Delete Task"
//                         >
//                           <Trash2 size={16} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Tasks;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTask } from "../contexts/TaskContext";
import { Plus, Filter, Search, Eye, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

const Tasks = () => {
  const { getTasks, tasks, loading, deleteTask } = useTask();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
    category: "",
  });

  useEffect(() => {
    getTasks();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    const searchFilters = Object.keys(filters).reduce((acc, key) => {
      if (filters[key]) {
        acc[key] = filters[key];
      }
      return acc;
    }, {});
    getTasks(searchFilters);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "completed":
        return "badge badge-completed";
      case "in-progress":
        return "badge badge-in-progress";
      case "pending":
        return "badge badge-pending";
      case "cancelled":
        return "badge badge-cancelled";
      default:
        return "badge badge-pending";
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case "urgent":
        return "badge badge-urgent";
      case "high":
        return "badge badge-high";
      case "medium":
        return "badge badge-medium";
      case "low":
        return "badge badge-low";
      default:
        return "badge badge-medium";
    }
  };

  const handleDeleteTask = async (taskId, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this task?")) {
      const success = await deleteTask(taskId);
      if (success) {
        getTasks();
      }
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600">Manage and track your tasks</p>
        </div>
        <button
          onClick={() => navigate("/tasks/new")}
          className="btn btn-primary"
        >
          <Plus size={20} />
          New Task
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                name="search"
                placeholder="Search tasks..."
                className="form-input pl-10"
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>
          </div>
          <div>
            <select
              name="status"
              className="form-select"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <select
              name="priority"
              className="form-select"
              value={filters.priority}
              onChange={handleFilterChange}
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <button onClick={handleSearch} className="btn btn-outline">
            <Filter size={20} />
            Filter
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-lg shadow-sm border">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Plus className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tasks found
            </h3>
            <p className="text-gray-500 mb-6">
              Get started by creating your first task.
            </p>
            <button
              onClick={() => navigate("/tasks/new")}
              className="btn btn-primary"
            >
              <Plus size={20} />
              Create Task
            </button>
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Assigned To</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Due Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr
                    key={task._id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/tasks/${task._id}`)}
                  >
                    <td>
                      <div>
                        <div className="font-medium text-gray-900">
                          {task.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {task.description.length > 60
                            ? `${task.description.substring(0, 60)}...`
                            : task.description}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm font-medium text-gray-900">
                        {task.assignedTo?.name}
                      </span>
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(task.status)}>
                        {task.status}
                      </span>
                    </td>
                    <td>
                      <span className={getPriorityBadgeClass(task.priority)}>
                        {task.priority}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm text-gray-900">
                        {format(new Date(task.dueDate), "MMM d, yyyy")}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/tasks/${task._id}`);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600"
                          title="View Task"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/tasks/${task._id}/edit`);
                          }}
                          className="p-1 text-gray-400 hover:text-green-600"
                          title="Edit Task"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={(e) => handleDeleteTask(task._id, e)}
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Delete Task"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
