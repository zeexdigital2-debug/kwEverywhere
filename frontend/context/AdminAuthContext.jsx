'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { adminAuth } from '@/lib/adminApi';

const AdminAuthContext = createContext({
  admin: null,
  loading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  checkAuth: async () => {}
});

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = async () => {
    try {
      const res = await adminAuth.verify();
      if (res && res.success && res.admin) {
        setAdmin(res.admin);
        return true;
      } else {
        setAdmin(null);
        return false;
      }
    } catch (err) {
      setAdmin(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Route protection
  useEffect(() => {
    if (loading) return;

    const isAdminRoute = pathname?.startsWith('/admin');
    const isLoginPage = pathname === '/admin/login';

    if (isAdminRoute && !isLoginPage && !admin) {
      router.push('/admin/login');
    } else if (isLoginPage && admin) {
      router.push('/admin');
    }
  }, [admin, loading, pathname, router]);

  const login = async (username, password) => {
    const res = await adminAuth.login(username, password);
    if (res && res.success) {
      if (res.token && typeof window !== 'undefined') {
        localStorage.setItem('kws_admin_token', res.token);
      }
      setAdmin(res.admin);
      return { success: true, admin: res.admin };
    }
    return { success: false, message: res.message || 'Login failed' };
  };

  const logout = async () => {
    try {
      await adminAuth.logout();
    } catch (e) {
      console.error(e);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('kws_admin_token');
      }
      setAdmin(null);
      router.push('/admin/login');
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        loading,
        isAuthenticated: !!admin,
        login,
        logout,
        checkAuth
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
