// models/Project.js
import { Schema, model } from 'mongoose';

const projectSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  detailedDescription: {
    type: String,
    maxlength: [2000, 'Detailed description cannot exceed 2000 characters']
  },
  tech: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    enum: ['web', 'mobile', 'fullstack', 'design', 'other'],
    default: 'web'
  },
  featured: {
    type: Boolean,
    default: false
  },
  demo: {
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true; // Optional field
        return /^https?:\/\/.+\..+/.test(v);
      },
      message: 'Please provide a valid URL'
    }
  },
  github: {
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true; // Optional field
        return /^https?:\/\/.+\..+/.test(v);
      },
      message: 'Please provide a valid URL'
    }
  },
  images: [{
    url: String,
    alt: String
  }],
  status: {
    type: String,
    enum: ['completed', 'in-progress', 'planned'],
    default: 'completed'
  },
  startDate: Date,
  endDate: Date,
  client: String,
  challenges: [String],
  solutions: [String],
  metrics: {
    users: Number,
    performance: String,
    satisfaction: Number
  }
}, {
  timestamps: true
});

// Index for better query performance
projectSchema.index({ category: 1, featured: -1, createdAt: -1 });

export default model('Project', projectSchema);