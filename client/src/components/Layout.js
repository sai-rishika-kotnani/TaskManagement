import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useSocket } from "../contexts/SocketContext";
import { Home, CheckSquare, Bell, User, LogOut, Menu, X } from "lucide-react";
import axios from "axios";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, logout } = useAuth();
  const { socket } = useSocket();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("notification_received", (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });
    }
  }, [socket]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("/api/notifications?limit=5");
      setNotifications(res.data.data);
      setUnreadCount(res.data.unreadCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const sidebarLinks = [
    { path: "/", icon: Home, label: "Dashboard" },
    { path: "/tasks", icon: CheckSquare, label: "Tasks" },
    { path: "/notifications", icon: Bell, label: "Notifications" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div style={{ backgroundColor: "#b6d7c7" }} className="min-h-screen">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`sidebar ${sidebarOpen ? "open" : ""}`}
        style={{ backgroundColor: "#a3c9b8", borderRadius: "0 20px 20px 0" }}
      >
        {/* Logo */}
        <div className="p-4 border-b">
          <Link to="/" className="flex items-center space-x-2">
            <CheckSquare className="text-blue-600" size={24} />
            <span className="font-bold text-xl">TaskManager</span>
          </Link>
        </div>

        {/* User Info (No Avatar) */}
        <div className="p-4 border-b">
          <div className="flex flex-col">
            <p className="font-medium text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4">
          {sidebarLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`sidebar-link ${isActive(link.path) ? "active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <link.icon size={20} />
              <span>{link.label}</span>
              {link.label === "Notifications" && unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                  {unreadCount}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b px-6 py-4 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">
              {location.pathname === "/"
                ? "Dashboard"
                : location.pathname === "/tasks"
                ? "Tasks"
                : location.pathname === "/notifications"
                ? "Notifications"
                : location.pathname === "/profile"
                ? "Profile"
                : "Task Manager"}
            </h1>

            {/* Topbar user info (No Avatar) */}
            <div className="flex items-center space-x-2">
              <span className="text-gray-700 font-medium">{user?.name}</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="px-6 pb-6">{children}</div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
