const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const { createNotification, sendEmailNotification, generateNotificationMessage } = require('../utils/notificationUtils');

const router = express.Router();

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const {
      status,
      priority,
      category,
      assignedTo,
      project,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = { isDeleted: false };

    // If user is not admin/manager, only show tasks assigned to them or created by them
    if (req.user.role === 'user') {
      query.$or = [
        { assignedTo: req.user._id },
        { assignedBy: req.user._id }
      ];
    }

    // Add filters
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (assignedTo) query.assignedTo = assignedTo;
    if (project) query.project = new RegExp(project, 'i');

    // Execute query with pagination
    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email avatar')
      .populate('assignedBy', 'name email avatar')
      .populate('comments.user', 'name email avatar')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await Task.countDocuments(query);

    res.json({
      success: true,
      count: tasks.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: tasks
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    // Check if id is 'new' and return error
    if (req.params.id === 'new') {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID. Use the frontend route to create new tasks.'
      });
    }

    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email avatar department')
      .populate('assignedBy', 'name email avatar department')
      .populate('comments.user', 'name email avatar');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user has access to this task
    if (req.user.role === 'user' && 
        task.assignedTo._id.toString() !== req.user._id.toString() &&
        task.assignedBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this task'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
router.post('/', protect, [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('assignedTo').notEmpty().withMessage('Assigned user is required'),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),
  body('category').notEmpty().withMessage('Category is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      title,
      description,
      assignedTo,
      dueDate,
      category,
      priority,
      project,
      estimatedHours,
      tags
    } = req.body;

    // Verify assigned user exists
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser) {
      return res.status(400).json({
        success: false,
        message: 'Assigned user not found'
      });
    }

    // Create task
    const task = await Task.create({
      title,
      description,
      assignedTo,
      assignedBy: req.user._id,
      dueDate,
      category,
      priority: priority || 'medium',
      project,
      estimatedHours,
      tags
    });

    // Populate task
    await task.populate('assignedTo', 'name email avatar');
    await task.populate('assignedBy', 'name email avatar');

    // Create notification
    const notificationData = generateNotificationMessage('task_assigned', title, req.user.name);
    await createNotification({
      user: assignedTo,
      task: task._id,
      type: 'task_assigned',
      title: notificationData.title,
      message: notificationData.message
    });

    // Send email notification
    await sendEmailNotification(
      assignedUser.email,
      'New Task Assigned',
      `
        <h2>New Task Assigned</h2>
        <p>You have been assigned a new task by ${req.user.name}.</p>
        <p><strong>Task:</strong> ${title}</p>
        <p><strong>Description:</strong> ${description}</p>
        <p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
        <p><strong>Priority:</strong> ${priority}</p>
        <p>Please log in to the Task Manager to view more details.</p>
      `
    );

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user has permission to update this task
    if (req.user.role === 'user' && 
        task.assignedBy.toString() !== req.user._id.toString() &&
        task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task'
      });
    }

    const oldStatus = task.status;
    
    // Update task
    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('assignedTo', 'name email avatar')
      .populate('assignedBy', 'name email avatar');

    // If status changed to completed, create notification
    if (oldStatus !== 'completed' && task.status === 'completed') {
      const notificationData = generateNotificationMessage('task_completed', task.title, req.user.name);
      await createNotification({
        user: task.assignedBy,
        task: task._id,
        type: 'task_completed',
        title: notificationData.title,
        message: notificationData.message
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user has permission to delete this task
    if (req.user.role === 'user' && task.assignedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task'
      });
    }

    // Soft delete
    task.isDeleted = true;
    await task.save();

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
router.post('/:id/comments', protect, [
  body('comment').notEmpty().withMessage('Comment is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const comment = {
      user: req.user._id,
      comment: req.body.comment
    };

    task.comments.push(comment);
    await task.save();

    // Populate the new comment
    await task.populate('comments.user', 'name email avatar');

    // Create notification for task owner and assignee
    const notificationData = generateNotificationMessage('task_commented', task.title, req.user.name);
    
    if (task.assignedTo.toString() !== req.user._id.toString()) {
      await createNotification({
        user: task.assignedTo,
        task: task._id,
        type: 'task_commented',
        title: notificationData.title,
        message: notificationData.message
      });
    }

    if (task.assignedBy.toString() !== req.user._id.toString()) {
      await createNotification({
        user: task.assignedBy,
        task: task._id,
        type: 'task_commented',
        title: notificationData.title,
        message: notificationData.message
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get task statistics
// @route   GET /api/tasks/stats
// @access  Private
router.get('/stats/overview', protect, async (req, res) => {
  try {
    let query = { isDeleted: false };

    // If user is not admin/manager, only show tasks assigned to them or created by them
    if (req.user.role === 'user') {
      query.$or = [
        { assignedTo: req.user._id },
        { assignedBy: req.user._id }
      ];
    }

    const stats = await Task.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalTasks: { $sum: 1 },
          pendingTasks: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          inProgressTasks: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
          completedTasks: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          overdueTasks: { $sum: { $cond: [{ $and: [{ $lt: ['$dueDate', new Date()] }, { $ne: ['$status', 'completed'] }] }, 1, 0] } }
        }
      }
    ]);

    const result = stats.length > 0 ? stats[0] : {
      totalTasks: 0,
      pendingTasks: 0,
      inProgressTasks: 0,
      completedTasks: 0,
      overdueTasks: 0
    };

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 