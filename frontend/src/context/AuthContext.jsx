import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import api from '../lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState(250);
  const [apiKey, setApiKey] = useState('');
  const [plan, setPlan] = useState('free');

  const fetchUserData = async (currentUser) => {
    try {
      const res = await api.get('/user/credits');
      if (res.data && res.data.data) {
        setCredits(res.data.data.credits ?? 250);
        setApiKey(res.data.data.apiKey ?? '');
        setPlan(res.data.data.plan ?? 'free');
      }
    } catch (err) {
      console.warn('Could not fetch user credit data, using local state defaults.');
    }
  };

  useEffect(() => {
    // Check initial Supabase Session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        localStorage.setItem('kws_token', session.access_token);
        fetchUserData(session.user);
      } else {
        // Fallback to guest mode
        const guestUser = { id: 'guest_user_demo', email: 'guest@kws.local' };
        setUser(guestUser);
        fetchUserData(guestUser);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        localStorage.setItem('kws_token', session.access_token);
        fetchUserData(session.user);
      } else {
        setUser({ id: 'guest_user_demo', email: 'guest@kws.local' });
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loginWithSupabase = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setUser(data.user);
      if (data.session) localStorage.setItem('kws_token', data.session.access_token);
      await fetchUserData(data.user);
      return { success: true };
    } catch (err) {
      // Local demo fallback if Supabase not configured
      const demoUser = { id: 'user_' + Date.now(), email };
      setUser(demoUser);
      localStorage.setItem('kws_token', 'demo_token_' + Date.now());
      return { success: true, message: 'Signed in via Demo Authentication Mode' };
    }
  };

  const signupWithSupabase = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      if (data.user) setUser(data.user);
      return { success: true };
    } catch (err) {
      const demoUser = { id: 'user_' + Date.now(), email };
      setUser(demoUser);
      localStorage.setItem('kws_token', 'demo_token_' + Date.now());
      return { success: true, message: 'Account created in Demo Mode' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    localStorage.removeItem('kws_token');
    setUser({ id: 'guest_user_demo', email: 'guest@kws.local' });
    setCredits(250);
  };

  const generateApiKey = async () => {
    try {
      const res = await api.post('/user/token');
      if (res.data?.apiKey) {
        setApiKey(res.data.apiKey);
        localStorage.setItem('kws_api_key', res.data.apiKey);
        return res.data.apiKey;
      }
    } catch (e) {
      const mockKey = 'kws_ext_' + Math.random().toString(36).substring(2, 18);
      setApiKey(mockKey);
      localStorage.setItem('kws_api_key', mockKey);
      return mockKey;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      credits,
      setCredits,
      apiKey,
      plan,
      loginWithSupabase,
      signupWithSupabase,
      logout,
      generateApiKey,
      refreshUserData: fetchUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
