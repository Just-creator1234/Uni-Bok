'use client';

import { useEffect } from 'react';
import { trackView } from '@/app/actions/trackView';

export default function ViewTracker({ postId }) {
  useEffect(() => {
    if (!sessionStorage.getItem(`viewed_${postId}`)) {
      const timer = setTimeout(() => {
        trackView(postId);
        sessionStorage.setItem(`viewed_${postId}`, 'true');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [postId]);

  return null;
}