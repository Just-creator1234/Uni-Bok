// app/components/AuthRedirect.js
"use client";

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AuthRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Only run this for AUTHENTICATED users
    if (status === 'authenticated' && session?.user?.id) {
      checkQuestionnaireStatus();
    }
    
    // If user is NOT authenticated, do nothing (stay on current page)
  }, [status, session, router]);

  const checkQuestionnaireStatus = async () => {
    try {
      const response = await fetch('/api/auth/check-questionnaire');
      if (!response.ok) return; // Don't redirect if API fails
      
      const data = await response.json();
      
      // Only redirect to questionnaire if not completed
      // AND if we're not already on the questionnaire page
      if (!data.completed && window.location.pathname !== '/questionnaire') {
        router.push('/questionnaire');
      }
      
      // If completed AND on questionnaire page, redirect to Allcourse
      if (data.completed && window.location.pathname === '/questionnaire') {
        router.push('/Allcourse');
      }
    } catch (error) {
      console.error('Error checking questionnaire:', error);
      // Don't redirect on error - better to show content than stuck in redirect loop
    }
  };

  return null; // This component doesn't render anything
}