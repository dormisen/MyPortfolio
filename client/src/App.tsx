import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Projects from "./pages/Project";
import ProjectDetail from "./components/ProjectDetail";
import Contact from "./pages/Contact";
import About from "./pages/About";
import AdminDashboard from "./admin/AdminAddProject";
import { AdminProvider } from "./context/AdminContext";
import AdminLogin from "./admin/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorBoundary from "./components/ErrorBoundary";
import SEOHead from "./components/SEOHead";
import BackToTop from "./components/BackToTop";
import { useState, useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
      <AdminProvider>
        <ErrorBoundary>
          <SEOHead />
          <Router>
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 bg-cyan-600 text-white px-4 py-2 rounded">
              Skip to content
            </a>
            <ScrollToTop />
            <div className="min-h-screen bg-light-background dark:bg-dark-primary text-dark-primary dark:text-dark-light transition-colors duration-300">
              <Navbar />
              <main id="main-content" className="flex-grow">
                <ErrorBoundary>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/projects/:id" element={<ProjectDetail />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route
                      path="/admin/dashboard"
                      element={
                        <ProtectedRoute>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="*" element={<Home />} />
                  </Routes>
                </ErrorBoundary>
              </main>
              <Footer />
              <BackToTop />

              <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
              />
            </div>
          </Router>
        </ErrorBoundary>
      </AdminProvider>
  );
}

export default App;