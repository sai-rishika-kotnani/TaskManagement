import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTask } from "../contexts/TaskContext";
import { CheckSquare, Plus, User } from "lucide-react";
import { format } from "date-fns";

const Dashboard = () => {
  const { user } = useAuth();
  const { getTasks, getStats, stats, tasks, loading } = useTask();
  const navigate = useNavigate();
  const [recentTasks, setRecentTasks] = useState([]);

  useEffect(() => {
    getStats();
    getTasks({ limit: 5, sortBy: "createdAt", sortOrder: "desc" });
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      setRecentTasks(tasks.slice(0, 5));
    }
  }, [tasks]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const statsCards = [
    {
      title: "Total Tasks",
      value: stats.totalTasks,
    },
    {
      title: "Pending",
      value: stats.pendingTasks,
    },
    {
      title: "In Progress",
      value: stats.inProgressTasks,
    },
    {
      title: "Completed",
      value: stats.completedTasks,
    },
    {
      title: "Overdue",
      value: stats.overdueTasks,
    },
  ];

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div
      style={{ backgroundColor: "#b6d7c7" }}
      className="min-h-screen p-6 space-y-4"
    >
      <div className="rounded-lg p-6 shadow-md border border-green-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              {getGreeting()}, {user?.name?.split(" ")[0]} 👋
            </h1>
            <p className="text-gray-700">
              You have {stats.pendingTasks + stats.inProgressTasks} active
              tasks.
            </p>
          </div>
          <button
            onClick={() => navigate("/tasks")}
            className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
          >
            <Plus size={18} />
            <span>New Task</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-between">
        {statsCards.map((card, index) => (
          <div
            key={index}
            className="flex-1 min-w-[160px] max-w-[200px] p-4 rounded-lg shadow-sm border border-green-300 bg-green-100 text-center"
          >
            <p className="text-sm text-gray-600">{card.title}</p>
            <p className="text-2xl font-semibold text-gray-800">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="rounded-lg shadow-sm border border-green-300 bg-green-100">
            <div className="px-6 py-4 border-b border-green-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Recent Tasks
              </h2>
              <button
                onClick={() => navigate("/tasks")}
                className="text-green-700 hover:text-green-900 text-sm font-medium"
              >
                View All
              </button>
            </div>
            <div className="p-6">
              {recentTasks.length === 0 ? (
                <div className="text-center text-gray-500">
                  <CheckSquare className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-2">No recent tasks found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentTasks.map((task) => (
                    <div
                      key={task._id}
                      className="border rounded-lg p-4 hover:bg-green-200 transition cursor-pointer"
                      onClick={() => navigate(`/tasks/${task._id}`)}
                    >
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {task.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {task.description.length > 100
                              ? `${task.description.slice(0, 100)}...`
                              : task.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs">
                            <span className="bg-green-200 px-2 py-1 rounded text-green-800">
                              {task.status}
                            </span>
                            <span className="bg-green-200 px-2 py-1 rounded text-green-800">
                              {task.priority}
                            </span>
                            <span className="text-gray-600">
                              Due:{" "}
                              {format(new Date(task.dueDate), "MMM d, yyyy")}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <User size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {task.assignedTo?.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
