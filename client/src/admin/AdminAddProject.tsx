import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from 'react-toastify';
import { useAdmin } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
interface ProjectForm {
  title: string;
  description: string;
  detailedDescription: string;
  tech: string;
  demo: string;
  github: string;
  category: string;
  featured: boolean;
  status: string;
  startDate: string;
  endDate: string;
  client: string;
}

interface FormErrors {
  [key: string]: string;
}

interface ImageFile {
  file: File;
  preview: string;
  id: string;
}

export default function AdminAddProject() {
  const { admin, permissions, isAuthenticated, logout } = useAdmin();
  const navigate = useNavigate();
  const [form, setForm] = useState<ProjectForm>({ 
    title: "", 
    description: "", 
    detailedDescription: "",
    tech: "", 
    demo: "", 
    github: "",
    category: "web",
    featured: false,
    status: "completed",
    startDate: "",
    endDate: "",
    client: ""
  });
  
  const [images, setImages] = useState<ImageFile[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  

  // Check permissions and authentication
  const canCreateProjects = permissions.includes('write:projects');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to access admin dashboard");
      navigate("/admin/login", { replace: true });
      return;
    }

    if (!canCreateProjects) {
      toast.error("You don't have permission to create projects");
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isAuthenticated, canCreateProjects, navigate]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach(image => URL.revokeObjectURL(image.preview));
    };
  }, [images]);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    
    // Title validation
    if (!form.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (form.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    } else if (form.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    
    // Description validation
    if (!form.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (form.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    } else if (form.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    // Tech stack validation
    if (!form.tech.trim()) {
      newErrors.tech = 'Tech stack is required';
    } else if (form.tech.split(',').filter(t => t.trim()).length < 1) {
      newErrors.tech = 'Please enter at least one technology';
    }
    
    // URL validations
    if (form.demo && !/^https?:\/\/.+\..+/.test(form.demo)) {
      newErrors.demo = 'Please enter a valid URL';
    }
    
    if (form.github && !/^https?:\/\/.+\..+/.test(form.github)) {
      newErrors.github = 'Please enter a valid URL';
    }
    
    // Detailed description validation
    if (form.detailedDescription.length > 2000) {
      newErrors.detailedDescription = 'Detailed description must be less than 2000 characters';
    }

    // Date validation
    if (form.startDate && form.endDate && new Date(form.startDate) > new Date(form.endDate)) {
      newErrors.endDate = 'End date cannot be before start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  // Auto-save draft functionality
  useEffect(() => {
    const hasData = Object.values(form).some(value => 
      value !== "" && value !== false && value !== "web" && value !== "completed"
    );
    
    if (hasData) {
      const draftData = {
        form,
        imagesCount: images.length,
        lastSaved: new Date().toISOString()
      };
      localStorage.setItem('projectDraft', JSON.stringify(draftData));
    }
  }, [form, images.length]);

  // Load draft on component mount
  useEffect(() => {
    const draft = localStorage.getItem('projectDraft');
    if (draft) {
      try {
        const draftData = JSON.parse(draft);
        setForm(draftData.form);
        toast.info('Draft project loaded automatically');
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: ImageFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(`File ${file.name} is not an image`);
        continue;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`Image ${file.name} is too large (max 5MB)`);
        continue;
      }
      
      // Check total images limit
      if (images.length + newImages.length >= 10) {
        toast.error('Maximum 10 images allowed');
        break;
      }
      
      const preview = URL.createObjectURL(file);
      newImages.push({
        file,
        preview,
        id: Math.random().toString(36).substr(2, 9)
      });
    }
    
    setImages(prev => [...prev, ...newImages]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  const clearDraft = () => {
    localStorage.removeItem('projectDraft');
    setForm({ 
      title: "", 
      description: "", 
      detailedDescription: "",
      tech: "", 
      demo: "", 
      github: "",
      category: "web",
      featured: false,
      status: "completed",
      startDate: "",
      endDate: "",
      client: ""
    });
    setImages([]);
    setErrors({});
    toast.info('Draft cleared');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canCreateProjects) {
      toast.error("Insufficient permissions");
      return;
    }
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }
    
    setIsLoading(true);
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      
      // Append form data
      formData.append("title", form.title.trim());
      formData.append("description", form.description.trim());
      formData.append("detailedDescription", form.detailedDescription.trim());
      formData.append("tech", JSON.stringify(
        form.tech.split(",")
          .map(t => t.trim())
          .filter(t => t.length > 0)
      ));
      formData.append("demo", form.demo.trim());
      formData.append("github", form.github.trim());
      formData.append("category", form.category);
      formData.append("featured", form.featured.toString());
      formData.append("status", form.status);
      formData.append("client", form.client.trim());
      
      if (form.startDate) formData.append("startDate", form.startDate);
      if (form.endDate) formData.append("endDate", form.endDate);
      
      // Append images
      images.forEach(image => formData.append("images", image.file));

      // FIXED: Use the axios instance instead of fetch
      const response = await api.post('/projects', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000 // 60 second timeout for file uploads
      });

      toast.success("🎉 Project added successfully!");
      
      // Clear draft on successful submission
      localStorage.removeItem('projectDraft');
      
      // Reset form
      setForm({ 
        title: "", 
        description: "", 
        detailedDescription: "",
        tech: "", 
        demo: "", 
        github: "",
        category: "web",
        featured: false,
        status: "completed",
        startDate: "",
        endDate: "",
        client: ""
      });
      setImages([]);
      setErrors({});
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Navigate to projects list or dashboard
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 2000);
      
    } catch (err: any) {
      console.error('Project creation error:', err);
      
      if (err.response?.status === 413) {
        toast.error("File size too large. Please reduce image sizes.");
      } else if (err.code === 'ECONNABORTED') {
        toast.error("Request timeout. Please try again.");
      } else if (err.response?.status === 429) {
        toast.error("Too many requests. Please slow down.");
      } else if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        logout();
      } else if (err.response?.status === 404) {
        toast.error("Projects API endpoint not found. Please check server configuration.");
      } else if (err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error("Failed to add project. Please try again.");
      }
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  if (!canCreateProjects || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-cyan-50 dark:from-gray-900 dark:via-black dark:to-cyan-900/20 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-2xl mb-6 shadow-2xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Add New Project
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Create and showcase your amazing work with detailed information
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-pink-500 mx-auto rounded-full mt-6"></div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
              <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">Welcome</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm truncate">{admin?.email}</div>
            </div>
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
              <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">{permissions.length}</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Permissions</div>
            </div>
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {images.length}/10
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Images</div>
            </div>
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">Draft</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Auto-saved</div>
            </div>
          </div>

          {/* Draft Management */}
          <div className="mb-6 flex justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Your progress is automatically saved
            </div>
            <button
              type="button"
              onClick={clearDraft}
              className="px-4 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
            >
              Clear Draft
            </button>
          </div>

          <form onSubmit={handleSubmit} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-200/50 dark:border-gray-700/50">
            
            {/* Basic Information Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <div className="w-2 h-8 bg-cyan-500 rounded-full mr-3"></div>
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200`}
                    placeholder="Enter project title"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-2">{errors.title}</p>
                  )}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Short Description *
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200`}
                    placeholder="Brief description of your project"
                  />
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {form.description.length}/500 characters
                  </div>
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-2">{errors.description}</p>
                  )}
                </div>

                {/* Detailed Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Detailed Description
                  </label>
                  <textarea
                    name="detailedDescription"
                    value={form.detailedDescription}
                    onChange={handleInputChange}
                    rows={5}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.detailedDescription ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200`}
                    placeholder="Detailed project description, features, challenges, etc."
                  />
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {form.detailedDescription.length}/2000 characters
                  </div>
                  {errors.detailedDescription && (
                    <p className="text-red-500 text-sm mt-2">{errors.detailedDescription}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Technical Details Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <div className="w-2 h-8 bg-pink-500 rounded-full mr-3"></div>
                Technical Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tech Stack */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Technologies Used *
                  </label>
                  <input
                    type="text"
                    name="tech"
                    value={form.tech}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.tech ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200`}
                    placeholder="React, Node.js, MongoDB, etc. (comma separated)"
                  />
                  {errors.tech && (
                    <p className="text-red-500 text-sm mt-2">{errors.tech}</p>
                  )}
                </div>

                {/* URLs */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Demo URL
                  </label>
                  <input
                    type="url"
                    name="demo"
                    value={form.demo}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.demo ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200`}
                    placeholder="https://demo.example.com"
                  />
                  {errors.demo && (
                    <p className="text-red-500 text-sm mt-2">{errors.demo}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    name="github"
                    value={form.github}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.github ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200`}
                    placeholder="https://github.com/username/repo"
                  />
                  {errors.github && (
                    <p className="text-red-500 text-sm mt-2">{errors.github}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Project Metadata Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <div className="w-2 h-8 bg-purple-500 rounded-full mr-3"></div>
                Project Metadata
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="web">Web Development</option>
                    <option value="mobile">Mobile App</option>
                    <option value="desktop">Desktop App</option>
                    <option value="ai">AI/ML</option>
                    <option value="iot">IoT</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="planned">Planned</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="on-hold">On Hold</option>
                  </select>
                </div>

                {/* Client */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Client
                  </label>
                  <input
                    type="text"
                    name="client"
                    value={form.client}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                    placeholder="Client name or company"
                  />
                </div>

                {/* Dates */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.endDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200`}
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-sm mt-2">{errors.endDate}</p>
                  )}
                </div>

                {/* Featured */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={form.featured}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-cyan-600 rounded focus:ring-cyan-500"
                  />
                  <label className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Featured Project
                  </label>
                </div>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <div className="w-2 h-8 bg-green-500 rounded-full mr-3"></div>
                Project Images
              </h2>

              {/* File Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload Images (Max 10, 5MB each)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 dark:file:bg-cyan-900 dark:file:text-cyan-300 transition-all duration-200"
                />
              </div>

              {/* Image Previews */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.preview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-xl shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Enhanced Submit Button */}
            <div className="flex justify-center pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/admin/dashboard')}
                  className="px-8 py-4 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all duration-300 shadow-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || isSubmitting || images.length === 0}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-pink-500 text-white rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Project...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Publish Project</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}