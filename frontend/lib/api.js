import axios from 'axios';
import { supabase } from './supabase';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? '/api' : 'http://localhost:48920/api');

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach Supabase JWT token if user is logged in
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  } else {
    // Guest mode fallback — could use a local UUID to persist guest state
    let guestId = null;
    if (typeof window !== 'undefined') {
      guestId = localStorage.getItem('kws_guest_id');
      if (!guestId) {
        guestId = 'guest_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('kws_guest_id', guestId);
      }
    }
    if (guestId) {
      config.headers.Authorization = `Bearer ${guestId}`;
    }
  }
  return config;
});

export const seoApi = {
  getCredits: () => api.get('/user/credits').then(res => res.data),
  
  researchKeywords: (keywords) => 
    api.post('/keyword-research', { keywords }).then(res => res.data),
    
  findKeywords: (payload) => // { seed, url, domain, type }
    api.post('/keywords-finder', payload).then(res => res.data),
    
  getLocalKeywords: (keyword, geo) => 
    api.post('/local-keywords', { keyword, geo }).then(res => res.data),
    
  getDomainMetrics: (domains) => 
    api.post('/domain-metrics', { domains }).then(res => res.data),
    
  getHistory: () => api.get('/history').then(res => res.data),
  
  saveHistory: (payload) => 
    api.post('/history', payload).then(res => res.data)
};
