// routes/Projectroute.js - ENHANCED WITH IMAGE UPLOAD
import { Router } from 'express';
const router = Router();
import Project from '../models/Project.js';
import { Protect } from '../Middleware/Auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { body, validationResult } from 'express-validator';

// Enhanced multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/projects';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'project-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Enhanced file filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    // Check file extension
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.'), false);
    }
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10 // Max 10 files
  },
  fileFilter: fileFilter
});

// Enhanced project validation
const projectValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('detailedDescription')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Detailed description must be less than 2000 characters'),
  body('tech')
    .optional()
    .custom((value) => {
      if (value) {
        const techArray = JSON.parse(value);
        return Array.isArray(techArray) && techArray.length > 0;
      }
      return true;
    })
    .withMessage('Tech stack must be a non-empty array'),
  body('demo')
    .optional()
    .isURL()
    .withMessage('Demo must be a valid URL'),
  body('github')
    .optional()
    .isURL()
    .withMessage('GitHub must be a valid URL'),
  body('category')
    .isIn(['web', 'mobile', 'desktop', 'ai', 'iot', 'other'])
    .withMessage('Invalid category'),
  body('status')
    .isIn(['planned', 'in-progress', 'completed', 'on-hold'])
    .withMessage('Invalid status')
];

// GET all projects with enhanced filtering
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      featured, 
      status,
      page = 1, 
      limit = 10,
      sort = 'createdAt',
      order = 'desc',
      search
    } = req.query;

    let filter = {};
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (featured === 'true') {
      filter.featured = true;
    }

    if (status && status !== 'all') {
      filter.status = status;
    }

    // Search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'tech': { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    const projects = await Project.find(filter)
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('-__v');

    const total = await Project.countDocuments(filter);

    res.json({
      projects,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
      hasNext: parseInt(page) < Math.ceil(total / limit),
      hasPrev: parseInt(page) > 1
    });
  } catch (err) {
    console.error('Get projects error:', err);
    res.status(500).json({ 
      error: 'Server error',
      code: 'SERVER_ERROR'
    });
  }
});

// GET single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ 
        error: 'Project not found',
        code: 'PROJECT_NOT_FOUND'
      });
    }

    res.json(project);
  } catch (err) {
    console.error('Get project error:', err);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ 
        error: 'Project not found',
        code: 'PROJECT_NOT_FOUND'
      });
    }
    
    res.status(500).json({ 
      error: 'Server error',
      code: 'SERVER_ERROR'
    });
  }
});

// POST new project with image upload
router.post('/', Protect, upload.array('images', 10), projectValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Clean up uploaded files if validation fails
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          fs.unlinkSync(file.path);
        });
      }
      
      return res.status(400).json({ 
        error: 'Validation error', 
        details: errors.array(),
        code: 'VALIDATION_ERROR'
      });
    }

    const projectData = { ...req.body };

    // Parse tech stack if it's a string
    if (typeof projectData.tech === 'string') {
      try {
        projectData.tech = JSON.parse(projectData.tech);
      } catch (e) {
        projectData.tech = projectData.tech.split(',').map(t => t.trim()).filter(t => t);
      }
    }

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      projectData.images = req.files.map(file => ({
        url: `/uploads/projects/${file.filename}`,
        alt: req.body.imageAlt || `Project image ${file.filename}`,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size
      }));
    }

    // Convert featured to boolean
    if (projectData.featured) {
      projectData.featured = projectData.featured === 'true';
    }

    const project = new Project(projectData);
    await project.save();
    
    res.status(201).json({
      message: 'Project created successfully',
      project,
      imagesUploaded: req.files ? req.files.length : 0
    });
  } catch (err) {
    console.error('Create project error:', err);
    
    // Clean up uploaded files on error
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        fs.unlinkSync(file.path);
      });
    }
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: Object.values(err.errors).map(e => e.message),
        code: 'VALIDATION_ERROR'
      });
    }
    
    res.status(500).json({ 
      error: 'Server error',
      code: 'SERVER_ERROR'
    });
  }
});

// PUT update project
router.put('/:id', Protect, upload.array('images', 10), projectValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          fs.unlinkSync(file.path);
        });
      }
      
      return res.status(400).json({ 
        error: 'Validation error', 
        details: errors.array(),
        code: 'VALIDATION_ERROR'
      });
    }

    const projectData = { ...req.body };

    // Parse tech stack
    if (typeof projectData.tech === 'string') {
      try {
        projectData.tech = JSON.parse(projectData.tech);
      } catch (e) {
        projectData.tech = projectData.tech.split(',').map(t => t.trim()).filter(t => t);
      }
    }

    // Handle new uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        url: `/uploads/projects/${file.filename}`,
        alt: req.body.imageAlt || `Project image ${file.filename}`,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size
      }));

      // Get existing project to combine images
      const existingProject = await Project.findById(req.params.id);
      if (existingProject && existingProject.images) {
        projectData.images = [...existingProject.images, ...newImages];
      } else {
        projectData.images = newImages;
      }
    }

    // Convert featured to boolean
    if (projectData.featured) {
      projectData.featured = projectData.featured === 'true';
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      projectData,
      { new: true, runValidators: true }
    );

    if (!project) {
      // Clean up uploaded files if project not found
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          fs.unlinkSync(file.path);
        });
      }
      
      return res.status(404).json({ 
        error: 'Project not found',
        code: 'PROJECT_NOT_FOUND'
      });
    }

    res.json({
      message: 'Project updated successfully',
      project,
      newImagesUploaded: req.files ? req.files.length : 0
    });
  } catch (err) {
    console.error('Update project error:', err);
    
    // Clean up uploaded files on error
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        fs.unlinkSync(file.path);
      });
    }
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: Object.values(err.errors).map(e => e.message),
        code: 'VALIDATION_ERROR'
      });
    }
    
    res.status(500).json({ 
      error: 'Server error',
      code: 'SERVER_ERROR'
    });
  }
});

// DELETE project
router.delete('/:id', Protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ 
        error: 'Project not found',
        code: 'PROJECT_NOT_FOUND'
      });
    }

    // Delete associated image files
    if (project.images && project.images.length > 0) {
      project.images.forEach(image => {
        const filePath = `uploads/projects/${image.filename}`;
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({ 
      message: 'Project deleted successfully',
      deletedImages: project.images ? project.images.length : 0
    });
  } catch (err) {
    console.error('Delete project error:', err);
    res.status(500).json({ 
      error: 'Server error',
      code: 'SERVER_ERROR'
    });
  }
});

// DELETE project image
router.delete('/:id/images/:imageId', Protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ 
        error: 'Project not found',
        code: 'PROJECT_NOT_FOUND'
      });
    }

    const imageIndex = project.images.findIndex(img => 
      img._id.toString() === req.params.imageId
    );

    if (imageIndex === -1) {
      return res.status(404).json({ 
        error: 'Image not found',
        code: 'IMAGE_NOT_FOUND'
      });
    }

    const imageToDelete = project.images[imageIndex];
    
    // Delete file from filesystem
    if (imageToDelete.filename) {
      const filePath = `uploads/projects/${imageToDelete.filename}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Remove image from project
    project.images.splice(imageIndex, 1);
    await project.save();

    res.json({ 
      message: 'Image deleted successfully',
      project
    });
  } catch (err) {
    console.error('Delete image error:', err);
    res.status(500).json({ 
      error: 'Server error',
      code: 'SERVER_ERROR'
    });
  }
});

export default router;