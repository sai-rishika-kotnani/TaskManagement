const cron = require('node-cron');
const moment = require('moment');
const Task = require('../models/Task');
const User = require('../models/User');
const { createNotification, sendEmailNotification, generateNotificationMessage } = require('./notificationUtils');

// Check for due tasks every day at 9 AM
const checkDueTasks = () => {
  cron.schedule('0 9 * * *', async () => {
    try {
      console.log('Checking for due tasks...');
      
      const tomorrow = moment().add(1, 'day').endOf('day').toDate();
      const today = moment().startOf('day').toDate();
      
      // Find tasks due tomorrow
      const tasksDueTomorrow = await Task.find({
        dueDate: {
          $gte: today,
          $lte: tomorrow
        },
        status: { $ne: 'completed' },
        isDeleted: false
      }).populate('assignedTo', 'name email');

      // Send notifications for tasks due tomorrow
      for (const task of tasksDueTomorrow) {
        const notificationData = generateNotificationMessage('task_due', task.title, '');
        
        // Create in-app notification
        await createNotification({
          user: task.assignedTo._id,
          task: task._id,
          type: 'task_due',
          title: notificationData.title,
          message: notificationData.message,
          priority: task.priority === 'urgent' ? 'high' : 'medium'
        });

        // Send email notification
        await sendEmailNotification(
          task.assignedTo.email,
          'Task Due Reminder',
          `
            <h2>Task Due Reminder</h2>
            <p>Your task "${task.title}" is due tomorrow.</p>
            <p><strong>Description:</strong> ${task.description}</p>
            <p><strong>Due Date:</strong> ${moment(task.dueDate).format('MMMM D, YYYY')}</p>
            <p><strong>Priority:</strong> ${task.priority}</p>
            <p>Please log in to the Task Manager to update the task status.</p>
          `
        );
      }

      console.log(`Sent notifications for ${tasksDueTomorrow.length} tasks due tomorrow`);
    } catch (error) {
      console.error('Error checking due tasks:', error);
    }
  });
};

// Check for overdue tasks every day at 10 AM
const checkOverdueTasks = () => {
  cron.schedule('0 10 * * *', async () => {
    try {
      console.log('Checking for overdue tasks...');
      
      const today = moment().startOf('day').toDate();
      
      // Find overdue tasks
      const overdueTasks = await Task.find({
        dueDate: { $lt: today },
        status: { $ne: 'completed' },
        isDeleted: false
      }).populate('assignedTo', 'name email');

      // Send notifications for overdue tasks
      for (const task of overdueTasks) {
        const notificationData = generateNotificationMessage('task_overdue', task.title, '');
        
        // Create in-app notification
        await createNotification({
          user: task.assignedTo._id,
          task: task._id,
          type: 'task_overdue',
          title: notificationData.title,
          message: notificationData.message,
          priority: 'high'
        });

        // Send email notification
        await sendEmailNotification(
          task.assignedTo.email,
          'Task Overdue',
          `
            <h2>Task Overdue</h2>
            <p>Your task "${task.title}" is overdue.</p>
            <p><strong>Description:</strong> ${task.description}</p>
            <p><strong>Due Date:</strong> ${moment(task.dueDate).format('MMMM D, YYYY')}</p>
            <p><strong>Days Overdue:</strong> ${moment().diff(moment(task.dueDate), 'days')} days</p>
            <p><strong>Priority:</strong> ${task.priority}</p>
            <p>Please complete this task as soon as possible.</p>
          `
        );
      }

      console.log(`Sent notifications for ${overdueTasks.length} overdue tasks`);
    } catch (error) {
      console.error('Error checking overdue tasks:', error);
    }
  });
};

// Clean up old notifications (older than 30 days)
const cleanupOldNotifications = () => {
  cron.schedule('0 2 * * 0', async () => { // Run every Sunday at 2 AM
    try {
      console.log('Cleaning up old notifications...');
      
      const thirtyDaysAgo = moment().subtract(30, 'days').toDate();
      
      const result = await Notification.deleteMany({
        createdAt: { $lt: thirtyDaysAgo },
        isRead: true
      });

      console.log(`Deleted ${result.deletedCount} old notifications`);
    } catch (error) {
      console.error('Error cleaning up old notifications:', error);
    }
  });
};

// Initialize all cron jobs
const initializeCronJobs = () => {
  console.log('Initializing cron jobs...');
  checkDueTasks();
  checkOverdueTasks();
  cleanupOldNotifications();
  console.log('Cron jobs initialized successfully');
};

module.exports = {
  initializeCronJobs,
  checkDueTasks,
  checkOverdueTasks,
  cleanupOldNotifications
}; 