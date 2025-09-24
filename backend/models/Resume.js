const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  degree: {
    type: String,
    required: [true, 'Degree is required'],
    trim: true
  },
  school: {
    type: String,
    required: [true, 'School/Institution is required'],
    trim: true
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  }
});

const experienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  role: {
    type: String,
    required: [true, 'Role/Position is required'],
    trim: true
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  isCurrentRole: {
    type: Boolean,
    default: false
  }
});

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  link: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
  technologies: [String]
});

const certificatesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Certificate title is required'],
    trim: true
  },
  issuer: {
    type: String,
    required: [true, 'Issuer is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  link: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  }
}, { timestamps: true });

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  title: {
    type: String,
    required: [true, 'Resume title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  personalInfo: {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    title: {
      type: String,
      required: [true, 'Professional title is required'],
      trim: true
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    linkedin: {
      type: String,
      trim: true,
      match: [/^https?:\/\/(www\.)?linkedin\.com\/.+/, 'Please enter a valid LinkedIn URL']
    },
    github: {
      type: String,
      trim: true,
      match: [/^https?:\/\/(www\.)?github\.com\/.+/, 'Please enter a valid GitHub URL']
    },
    location: {
      type: String,
      trim: true
    },
    summary: {
      type: String,
      trim: true,
      maxlength: [500, 'Summary cannot exceed 500 characters']
    }
  },
  education: [educationSchema],
  experience: [experienceSchema],
  skills: [String],
  projects: [projectSchema],
  certificates: [certificatesSchema],
  template: {
    type: String,
    default: 'modern',
    enum: ['modern', 'classic', 'minimal', 'creative', 'professional', 'tech']
  },
  colorTheme: {
    type: String,
    default: 'blue',
    enum: ['blue', 'green', 'purple', 'red', 'indigo']
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  portfolioUrl: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true
});

// Index for better query performance
resumeSchema.index({ userId: 1 });
resumeSchema.index({ isPublished: 1 });
resumeSchema.index({ portfolioUrl: 1 });

module.exports = mongoose.model('Resume', resumeSchema);
