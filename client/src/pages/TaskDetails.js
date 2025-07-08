import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTask } from '../contexts/TaskContext';
import { ArrowLeft, Calendar, User, Flag, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTask, currentTask, loading } = useTask();

  useEffect(() => {
    if (id) {
      getTask(id);
    }
  }, [id]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed':
        return 'badge badge-completed';
      case 'in-progress':
        return 'badge badge-in-progress';
      case 'pending':
        return 'badge badge-pending';
      case 'cancelled':
        return 'badge badge-cancelled';
      default:
        return 'badge badge-pending';
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'badge badge-urgent';
      case 'high':
        return 'badge badge-high';
      case 'medium':
        return 'badge badge-medium';
      case 'low':
        return 'badge badge-low';
      default:
        return 'badge badge-medium';
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!currentTask) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Task not found</h3>
        <p className="text-gray-500 mb-6">The task you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/tasks')}
          className="btn btn-primary"
        >
          Back to Tasks
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/tasks')}
          className="p-2 text-gray-400 hover:text-gray-600"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{currentTask.title}</h1>
          <p className="text-gray-600">Task Details</p>
        </div>
      </div>

      {/* Task Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{currentTask.description}</p>
            
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <span className={getStatusBadgeClass(currentTask.status)}>
                  {currentTask.status}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Flag size={16} className="text-gray-400" />
                <span className={getPriorityBadgeClass(currentTask.priority)}>
                  {currentTask.priority}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600">
                  Due: {format(new Date(currentTask.dueDate), 'MMMM d, yyyy')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Task Details */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Assigned To</label>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {currentTask.assignedTo?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {currentTask.assignedTo?.name}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Assigned By</label>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {currentTask.assignedBy?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {currentTask.assignedBy?.name}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Category</label>
                <p className="text-sm text-gray-900 mt-1 capitalize">{currentTask.category}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Created</label>
                <p className="text-sm text-gray-900 mt-1">
                  {format(new Date(currentTask.createdAt), 'MMMM d, yyyy')}
                </p>
              </div>
              {currentTask.completedDate && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Completed</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {format(new Date(currentTask.completedDate), 'MMMM d, yyyy')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <MessageSquare size={20} />
              <span>Comments ({currentTask.comments?.length || 0})</span>
            </h2>
            {currentTask.comments && currentTask.comments.length > 0 ? (
              <div className="space-y-4">
                {currentTask.comments.map((comment, index) => (
                  <div key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {comment.user?.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {comment.user?.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No comments yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails; 