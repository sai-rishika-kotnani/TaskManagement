import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTask } from '../contexts/TaskContext';
import { ArrowLeft, Calendar, User, Flag, Save } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const CreateTask = () => {
  const navigate = useNavigate();
  const { createTask, loading, getUsers, users } = useTask();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
    category: '',
    priority: 'medium',
    project: '',
    estimatedHours: '',
    tags: ''
  });

  useEffect(() => {
    getUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.description || !formData.assignedTo || !formData.dueDate || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const taskData = {
        ...formData,
        estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : undefined,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      };

      const success = await createTask(taskData);
      if (success) {
        toast.success('Task created successfully');
        navigate('/tasks');
      }
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Create New Task</h1>
          <p className="text-gray-600">Add a new task to your project</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter task title"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="form-textarea"
                    placeholder="Enter task description"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="development">Development</option>
                    <option value="design">Design</option>
                    <option value="testing">Testing</option>
                    <option value="documentation">Documentation</option>
                    <option value="meeting">Meeting</option>
                    <option value="research">Research</option>
                    <option value="bug-fix">Bug Fix</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">
                    Project
                  </label>
                  <input
                    type="text"
                    id="project"
                    name="project"
                    value={formData.project}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter project name"
                  />
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter tags separated by commas"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Assignment & Priority</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">
                    Assign To *
                  </label>
                  <select
                    id="assignedTo"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select user</option>
                    {users.map(user => (
                      <option key={user._id} value={user._id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="form-input"
                    min={format(new Date(), 'yyyy-MM-dd')}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Hours
                  </label>
                  <input
                    type="number"
                    id="estimatedHours"
                    name="estimatedHours"
                    value={formData.estimatedHours}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter estimated hours"
                    min="0"
                    step="0.5"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary flex-1"
              >
                <Save size={20} />
                {loading ? 'Creating...' : 'Create Task'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/tasks')}
                className="btn btn-outline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateTask; 