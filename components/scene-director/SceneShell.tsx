'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SceneShellProps {
  children: React.ReactNode;
}

export default function SceneShell({ children }: SceneShellProps) {
  return (
    <motion.div
      className="absolute inset-0 w-full h-full"
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}
