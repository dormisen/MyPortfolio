import { useState, useEffect } from "react";
import { useAdmin } from "../context/AdminContext";
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from "react-router-dom";

export default function AdminLogin() {
  const { login, loading, isAuthenticated } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitAttempts, setSubmitAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);

  // Check if user is locked out
  useEffect(() => {
    const storedLockout = localStorage.getItem('loginLockout');
    if (storedLockout) {
      const lockoutEnd = parseInt(storedLockout);
      if (Date.now() < lockoutEnd) {
        setLockoutTime(lockoutEnd);
      } else {
        localStorage.removeItem('loginLockout');
      }
    }
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || "/admin/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (lockoutTime) {
      const timeLeft = Math.ceil((lockoutTime - Date.now()) / 1000 / 60);
      toast.error(`Account temporarily locked. Try again in ${timeLeft} minutes.`);
      return;
    }

    if (!validateForm()) {
      return;
    }

    // Enhanced rate limiting
    if (submitAttempts >= 3) {
      const lockoutDuration = 15 * 60 * 1000; // 15 minutes
      const lockoutEnd = Date.now() + lockoutDuration;
      setLockoutTime(lockoutEnd);
      localStorage.setItem('loginLockout', lockoutEnd.toString());
      toast.error("Too many failed attempts. Account locked for 15 minutes.");
      return;
    }

    try {
      const success = await login(form.email, form.password);
      
      if (success) {
        toast.success("🎉 Login successful!");
        setSubmitAttempts(0);
        localStorage.removeItem('loginLockout');
        setLockoutTime(null);
        
        // Redirect to intended page or dashboard
        const from = (location.state as any)?.from?.pathname || "/admin/dashboard";
        navigate(from, { replace: true });
      } else {
        const newAttempts = submitAttempts + 1;
        setSubmitAttempts(newAttempts);
        
        if (newAttempts >= 3) {
          const lockoutDuration = 15 * 60 * 1000;
          const lockoutEnd = Date.now() + lockoutDuration;
          setLockoutTime(lockoutEnd);
          localStorage.setItem('loginLockout', lockoutEnd.toString());
          toast.error("Too many failed attempts. Account locked for 15 minutes.");
        } else {
          toast.error(`Login failed. ${3 - newAttempts} attempts remaining.`);
        }
      }
    } catch (error: any) {
      const newAttempts = submitAttempts + 1;
      setSubmitAttempts(newAttempts);
      toast.error(error.message || "Login failed. Please check your credentials.");
    }
  };

  // Countdown timer for lockout
  const LockoutTimer = () => {
    const [timeLeft, setTimeLeft] = useState<number>(0);

    useEffect(() => {
      if (lockoutTime) {
        const interval = setInterval(() => {
          const remaining = Math.ceil((lockoutTime - Date.now()) / 1000);
          setTimeLeft(remaining);
          
          if (remaining <= 0) {
            clearInterval(interval);
            setLockoutTime(null);
            localStorage.removeItem('loginLockout');
          }
        }, 1000);

        return () => clearInterval(interval);
      }
    }, [lockoutTime]);

    if (!lockoutTime) return null;

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/30 rounded-xl p-4 mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 text-red-600 dark:text-red-400">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              Account temporarily locked
            </p>
            <p className="text-sm text-red-700 dark:text-red-300">
              Try again in {minutes}:{seconds.toString().padStart(2, '0')}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 via-white to-cyan-50 dark:from-gray-900 dark:via-black dark:to-cyan-900/20 p-4">
      <div className="w-full max-w-md">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-2xl mb-4 shadow-2xl">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Portal
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Secure access to your dashboard
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-pink-500 mx-auto rounded-full mt-4"></div>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-200/50 dark:border-gray-700/50">
          <LockoutTimer />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Email Address *
              </label>
              <input 
                type="email" 
                id="email"
                name="email" 
                placeholder="admin@example.com" 
                value={form.email}
                onChange={handleChange}
                disabled={loading || !!lockoutTime}
                className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 ${
                  errors.email 
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20 focus:ring-red-200 dark:focus:ring-red-900/30' 
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-cyan-500 focus:ring-cyan-200 dark:focus:ring-cyan-900/30'
                } ${(loading || lockoutTime) ? 'opacity-50 cursor-not-allowed' : ''}`}
                required 
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-500 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Password *
              </label>
              <input 
                type="password" 
                id="password"
                name="password" 
                placeholder="Enter your password" 
                value={form.password}
                onChange={handleChange}
                disabled={loading || !!lockoutTime}
                className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 ${
                  errors.password 
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20 focus:ring-red-200 dark:focus:ring-red-900/30' 
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-cyan-500 focus:ring-cyan-200 dark:focus:ring-cyan-900/30'
                } ${(loading || lockoutTime) ? 'opacity-50 cursor-not-allowed' : ''}`}
                required 
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-500 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Security Notice */}
            <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-700/30 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mt-0.5">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm text-cyan-800 dark:text-cyan-200">
                  Secure admin access. Multiple failed attempts will temporarily lock your account.
                </p>
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading || !!lockoutTime}
              className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </div>
              ) : lockoutTime ? (
                "Account Locked"
              ) : (
                <div className="flex items-center justify-center space-x-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Login to Dashboard</span>
                </div>
              )}
            </button>

            {submitAttempts > 0 && submitAttempts < 3 && (
              <p className="text-sm text-orange-600 dark:text-orange-400 text-center">
                {3 - submitAttempts} attempt(s) remaining
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}