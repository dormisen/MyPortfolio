// context/AdminContext.tsx - FIXED VERSION
import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import { toast } from 'react-toastify';
import api, { plainAxios } from '../api/axiosConfig';

interface Admin {
  id: string;
  email: string;
  role: string;
  sessionId: string;
}

interface AdminContextType {
  admin: Admin | null;
  permissions: string[];
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  verifyToken: () => Promise<boolean>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Enhanced token verification with better error handling
  const verifyToken = async (): Promise<boolean> => {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      console.log('No token found in localStorage');
      setLoading(false);
      return false;
    }

    try {
      console.log('Verifying token...');
      
      // Use plainAxios to avoid interceptors for verification
      const response = await plainAxios.get('/admin/verify', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        timeout: 10000,
        validateStatus: (status) => status < 500 // Don't throw on 401
      });

      console.log('Token verification response:', response.status);

      if (response.status === 200 && response.data.admin) {
        setAdmin(response.data.admin);
        setPermissions(response.data.permissions || []);
        setIsAuthenticated(true);
        console.log('Token verification successful');
        return true;
      } else {
        // Clear invalid token
        console.log('Token verification failed, clearing token');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('loginTime');
        setAdmin(null);
        setPermissions([]);
        setIsAuthenticated(false);
        return false;
      }
    } catch (error: any) {
      console.error('Token verification failed:', error);
      
      // Clear invalid token on any error
      localStorage.removeItem('adminToken');
      localStorage.removeItem('loginTime');
      setAdmin(null);
      setPermissions([]);
      setIsAuthenticated(false);
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Enhanced login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('Attempting login...');

      const response = await plainAxios.post('/admin/login', {
        email: email.trim(),
        password: password
      }, {
        timeout: 15000,
        headers: {
          'X-Request-ID': `login_${Date.now()}`
        }
      });

      console.log('Login response received');

      if (response.data.token && response.data.admin) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('loginTime', Date.now().toString());
        
        setAdmin(response.data.admin);
        setPermissions(response.data.admin.permissions || []);
        setIsAuthenticated(true);
        
        console.log('Login successful');
        return true;
      } else {
        console.log('Login failed: No token in response');
        return false;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        // Server responded with error status
        if (error.response.status === 401) {
          errorMessage = 'Invalid email or password';
        } else if (error.response.status === 429) {
          errorMessage = 'Too many login attempts. Please try again later.';
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error;
        }
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Connection timeout. Please check your internet connection.';
      } else if (error.request) {
        errorMessage = 'Cannot connect to server. Please try again later.';
      }
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced logout function
  const logout = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (token) {
        await api.post('/admin/logout', {}, {
          timeout: 5000
        }).catch(err => {
          console.log('Logout API call failed, but clearing local state anyway:', err);
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local state regardless of API call success
      localStorage.removeItem('adminToken');
      localStorage.removeItem('loginTime');
      localStorage.removeItem('loginLockout');
      setAdmin(null);
      setPermissions([]);
      setIsAuthenticated(false);
      toast.info('Logged out successfully');
    }
  };

  // Verify token on app load
  useEffect(() => {
    verifyToken();
  }, []);

  const value: AdminContextType = {
    admin,
    permissions,
    isAuthenticated,
    loading,
    login,
    logout,
    verifyToken
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};