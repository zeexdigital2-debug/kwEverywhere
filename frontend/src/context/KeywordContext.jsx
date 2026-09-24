import React, { createContext, useContext, useState } from 'react';
import api from '../lib/api';
import { useAuth } from './AuthContext';

const KeywordContext = createContext();

export const KeywordProvider = ({ children }) => {
  const { setCredits } = useAuth();
  const [results, setResults] = useState([
    {
      keyword: 'seo tools 2026',
      searchVolume: 135000,
      competition: 'HIGH',
      competitionScore: 82,
      difficulty: 74,
      cpc: 8.50,
      trend: [45, 52, 60, 68, 75, 80, 85, 90, 88, 92, 95, 100],
      suggestions: ['free seo tools', 'seo tools for small business', 'best keyword software', 'ai keyword generator'],
      searchedAt: new Date()
    },
    {
      keyword: 'keyword research chrome extension',
      searchVolume: 22400,
      competition: 'MEDIUM',
      competitionScore: 54,
      difficulty: 42,
      cpc: 3.20,
      trend: [30, 35, 40, 42, 50, 58, 65, 72, 70, 78, 85, 90],
      suggestions: ['google search keyword extension', 'free rank tracker extension', 'page authority chrome plugin'],
      searchedAt: new Date()
    },
    {
      keyword: 'open pagerank api integration',
      searchVolume: 4800,
      competition: 'LOW',
      competitionScore: 28,
      difficulty: 24,
      cpc: 1.15,
      trend: [20, 22, 25, 30, 28, 32, 35, 40, 42, 45, 48, 50],
      suggestions: ['check domain authority free', 'pagerank checker python', 'openpagerank vs moz da'],
      searchedAt: new Date()
    }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTrendItem, setActiveTrendItem] = useState(null);

  const performResearch = async (keywordsInput) => {
    setLoading(true);
    setError(null);
    try {
      const payload = Array.isArray(keywordsInput) ? { keywords: keywordsInput } : { keywords: [keywordsInput] };
      const res = await api.post('/keywords/research', payload);
      
      if (res.data && res.data.data) {
        setResults((prev) => {
          // Deduplicate based on keyword name
          const newItems = res.data.data;
          const combined = [...newItems, ...prev.filter(p => !newItems.some(n => n.keyword.toLowerCase() === p.keyword.toLowerCase()))];
          return combined;
        });
        if (res.data.remainingCredits !== undefined) {
          setCredits(res.data.remainingCredits);
        }
      }
    } catch (err) {
      console.warn('API call notice:', err.message);
      setError(err.response?.data?.message || 'Failed to research keywords. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeywordContext.Provider value={{
      results,
      loading,
      error,
      setError,
      performResearch,
      activeTrendItem,
      setActiveTrendItem
    }}>
      {children}
    </KeywordContext.Provider>
  );
};

export const useKeywords = () => useContext(KeywordContext);
