import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  User,
  Mail,
  Paperclip,
  MapPin,
  Calendar,
  Edit3,
  Save,
  X,
} from "lucide-react";
import { format } from "date-fns";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    department: user?.department || "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const success = await updateProfile(formData);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      department: user?.department || "",
    });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">Manage your account information</p>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-outline"
          >
            <Edit3 size={20} />
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Personal Information
          </h2>
        </div>
        <div className="p-6">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`form-input ${
                    errors.name ? "border-red-300" : ""
                  }`}
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <p className="error-message">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-input ${
                    errors.email ? "border-red-300" : ""
                  }`}
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="error-message">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="department" className="form-label">
                  Department
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  className="form-input"
                  value={formData.department}
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-center space-x-3 pt-4">
                <button type="submit" className="btn btn-primary">
                  <Save size={20} />
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-outline"
                >
                  <X size={20} />
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">
                  {user?.name}
                </h3>
                <p className="text-gray-600 capitalize">{user?.role}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="text-gray-400" size={20} />
                  <span className="text-gray-900">{user?.email}</span>
                </div>

                {user?.department && (
                  <div className="flex items-center space-x-3">
                    <Paperclip className="text-gray-400" size={20} />
                    <span className="text-gray-900">{user.department}</span>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <Calendar className="text-gray-400" size={20} />
                  <span className="text-gray-900">
                    Joined {format(new Date(user?.createdAt), "MMMM d, yyyy")}
                  </span>
                </div>

                {user?.lastLogin && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="text-gray-400" size={20} />
                    <span className="text-gray-900">
                      Last login:{" "}
                      {format(new Date(user.lastLogin), "MMMM d, yyyy h:mm a")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Account Settings
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Account Status
                </h3>
                <p className="text-sm text-gray-500">
                  Your account is currently active
                </p>
              </div>
              <span className="badge badge-completed">Active</span>
            </div>

            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Role</h3>
                <p className="text-sm text-gray-500">
                  Your current role in the system
                </p>
              </div>
              <span className="badge badge-medium capitalize">
                {user?.role}
              </span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Member Since
                </h3>
                <p className="text-sm text-gray-500">
                  When you joined the platform
                </p>
              </div>
              <span className="text-sm text-gray-900">
                {format(new Date(user?.createdAt), "MMMM yyyy")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
