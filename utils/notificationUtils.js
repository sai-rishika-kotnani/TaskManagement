const Notification = require('../models/Notification');
const nodemailer = require('nodemailer');

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Create notification
const createNotification = async (data) => {
  try {
    const notification = await Notification.create(data);
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Send email notification
const sendEmailNotification = async (to, subject, html) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Email configuration not found, skipping email notification');
    return;
  }

  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: html
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Generate notification messages
const generateNotificationMessage = (type, taskTitle, assignedBy) => {
  const messages = {
    task_assigned: {
      title: 'New Task Assigned',
      message: `You have been assigned a new task: "${taskTitle}" by ${assignedBy}`
    },
    task_due: {
      title: 'Task Due Reminder',
      message: `Task "${taskTitle}" is due soon. Please complete it on time.`
    },
    task_completed: {
      title: 'Task Completed',
      message: `Task "${taskTitle}" has been marked as completed.`
    },
    task_overdue: {
      title: 'Task Overdue',
      message: `Task "${taskTitle}" is overdue. Please complete it as soon as possible.`
    },
    task_commented: {
      title: 'New Comment on Task',
      message: `A new comment has been added to task "${taskTitle}".`
    }
  };

  return messages[type] || {
    title: 'Task Update',
    message: `Update on task "${taskTitle}"`
  };
};

module.exports = {
  createNotification,
  sendEmailNotification,
  generateNotificationMessage
}; 