'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Auth removed — redirect everyone directly to dashboard
export default function SignupPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);
  return null;
}
