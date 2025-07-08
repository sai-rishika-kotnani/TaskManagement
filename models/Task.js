const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a task title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a task description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['development', 'design', 'testing', 'documentation', 'meeting', 'research', 'bug-fix', 'maintenance', 'feature', 'project', 'work', 'personal', 'urgent', 'other'],
    default: 'other'
  },
  assignedTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Please assign the task to a user']
  },
  assignedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Please specify who assigned the task']
  },
  dueDate: {
    type: Date,
    required: [true, 'Please add a due date']
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  completedDate: {
    type: Date
  },
  estimatedHours: {
    type: Number,
    min: 0,
    max: 1000
  },
  actualHours: {
    type: Number,
    min: 0,
    max: 1000
  },
  tags: [{
    type: String,
    trim: true
  }],
  attachments: [{
    fileName: String,
    filePath: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    comment: {
      type: String,
      required: true,
      maxlength: [300, 'Comment cannot be more than 300 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  project: {
    type: String,
    trim: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
taskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Set completedDate when status is changed to completed
taskSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'completed') {
    this.completedDate = new Date();
  }
  next();
});

module.exports = mongoose.model('Task', taskSchema); 