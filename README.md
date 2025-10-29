# Rida Portfolio - Full-Stack Developer Portfolio

A modern, responsive portfolio website built with React, TypeScript, Node.js, and MongoDB. Features a beautiful UI with smooth animations, dark/light mode, and a complete admin dashboard for managing projects.

## 🚀 Features

### Frontend
- **Modern React Architecture** - Built with React 19, TypeScript, and Vite
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Dark/Light Mode** - Seamless theme switching with system preference detection
- **Smooth Animations** - GSAP animations and transitions throughout
- **SEO Optimized** - Meta tags, structured data, and semantic HTML
- **Accessibility** - ARIA labels, keyboard navigation, and screen reader support
- **Error Boundaries** - Graceful error handling and user feedback
- **Form Validation** - Client-side validation with real-time feedback

### Backend
- **RESTful API** - Express.js with proper error handling
- **Database** - MongoDB with Mongoose ODM
- **Authentication** - JWT-based admin authentication
- **File Upload** - Cloudinary integration for image management
- **Email Service** - Nodemailer for contact form submissions
- **Security** - Helmet, CORS, rate limiting, and input validation
- **Environment Configuration** - Secure environment variable management

### Admin Dashboard
- **Project Management** - Add, edit, and delete projects
- **Image Upload** - Multiple image support with Cloudinary
- **Form Validation** - Comprehensive validation with error messages
- **Real-time Feedback** - Toast notifications and loading states

## 🛠️ Tech Stack

### Frontend
- React 19.1.1
- TypeScript 5.8.3
- Vite 7.1.2
- Tailwind CSS 4.1.13
- DaisyUI 5.1.10
- GSAP 3.13.0
- React Router DOM 7.8.2
- React Helmet Async 2.0.5
- React Toastify 11.0.5
- Axios 1.11.0

### Backend
- Node.js
- Express.js 5.1.0
- MongoDB 8.18.1
- Mongoose 8.18.1
- JWT 9.0.2
- Bcryptjs 3.0.2
- Nodemailer 7.0.9
- Cloudinary 2.7.0
- Multer 2.0.2
- Express Validator 7.2.1
- Helmet 8.1.0
- CORS 2.8.5

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

### 2. Install Dependencies

#### Frontend
```bash
cd client
npm install
```

#### Backend
```bash
cd ../server
npm install
```

### 3. Environment Setup

Create a `.env` file in the `server` directory:

```env
# Database
MONGO_URI=mongodb://localhost:27017/portfolio

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Admin Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password_here

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here

# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Database Setup
Make sure MongoDB is running on your system or use a cloud instance like MongoDB Atlas.

### 5. Run the Application

#### Development Mode
```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 🎨 Customization

### Colors and Theme
The color scheme can be customized in `client/tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#f0f9ff',
        500: '#06b6d4',
        600: '#0891b2',
      },
      secondary: {
        50: '#fdf2f8',
        500: '#ec4899',
        600: '#db2777',
      }
    }
  }
}
```

### Content
- Update personal information in `client/src/components/SEOHead.tsx`
- Modify contact information in `client/src/pages/Contact.tsx`
- Update social links in `client/src/components/Footer.tsx`

## 📱 Features Overview

### Home Page
- Hero section with animated logo and call-to-action buttons
- Statistics section with key metrics
- Services overview
- About section
- Featured projects preview
- Testimonials
- Contact form

### Projects Page
- Filterable project grid
- Project categories (Web, Mobile, Full-Stack, Design)
- Featured projects highlighting
- Project detail modals
- Live demo and GitHub links

### Contact Page
- Multi-step contact form with validation
- Contact information display
- Social media links
- Email integration

### Admin Dashboard
- Secure login system
- Project management interface
- Image upload functionality
- Form validation and error handling

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Rate limiting
- Helmet security headers
- Environment variable protection

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy the dist folder
```

### Backend (Railway/Heroku)
```bash
cd server
# Set environment variables in your hosting platform
# Deploy the server directory
```

### Environment Variables for Production
Make sure to set all required environment variables in your hosting platform.

## 📄 API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (admin only)
- `PUT /api/projects/:id` - Update project (admin only)
- `DELETE /api/projects/:id` - Delete project (admin only)

### Contact
- `POST /api/contact` - Submit contact form

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/verify` - Verify admin token

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Rida Iquen**
- Portfolio: [Your Portfolio URL]
- LinkedIn: [Your LinkedIn]
- GitHub: [Your GitHub]

## 🙏 Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [GSAP](https://greensock.com/gsap/) for smooth animations
- [React](https://reactjs.org/) for the amazing frontend library
- [Express.js](https://expressjs.com/) for the robust backend framework

---

⭐ If you found this project helpful, please give it a star!
