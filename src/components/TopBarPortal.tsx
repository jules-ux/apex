import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export const TopBarPortal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  
  const target = document.getElementById('top-left-portal');
  if (!target) return null;
  
  return createPortal(children, target);
};
