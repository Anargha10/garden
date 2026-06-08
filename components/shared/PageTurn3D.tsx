'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

interface PageTurn3DProps {
  children: React.ReactNode;
  isOpen?: boolean;
  onPageTurnComplete?: () => void;
  className?: string;
  duration?: number;
  disabled?: boolean;
}

export default function PageTurn3D({
  children,
  isOpen = false,
  onPageTurnComplete,
  className = '',
  duration = 1.5,
  disabled = false,
}: PageTurn3DProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const [hasTurned, setHasTurned] = useState(false);

  const handleTurn = () => {
    if (disabled || hasTurned) return;

    const page = pageRef.current;
    if (!page) return;

    gsap.to(page, {
      rotateY: -180,
      duration,
      ease: 'power2.inOut',
      onComplete: () => {
        setHasTurned(true);
        onPageTurnComplete?.();
      },
    });
  };

  return (
    <div
      className={`page-turn-wrapper perspective-container ${className}`}
      style={{ perspective: '1500px' }}
      onClick={handleTurn}
    >
      <div
        ref={pageRef}
        className="page-turn-front relative w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
          transformOrigin: 'left center',
          transition: disabled ? 'none' : undefined,
        }}
      >
        <div className="page-turn-front-content w-full h-full">
          {children}
        </div>

        {/* Page shadow during turn */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, rgba(0,0,0,0.3) 0%, transparent 30%)',
            transform: 'translateZ(1px)',
          }}
        />
      </div>

      {/* Back of page (what you see when turned) */}
      {hasTurned && (
        <motion.div
          className="page-turn-back absolute inset-0 w-full h-full"
          initial={{ rotateY: 180 }}
          animate={{ rotateY: 0 }}
          transition={{ duration: 0.1 }}
        >
          {/* Back content area */}
        </motion.div>
      )}
    </div>
  );
}

// Controlled PageTurn3D that animates based on isOpen prop
interface ControlledPageTurnProps {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
  duration?: number;
  onComplete?: () => void;
}

export function ControlledPageTurn({
  isOpen,
  children,
  className = '',
  duration = 1.5,
  onComplete,
}: ControlledPageTurnProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const hasCompletedRef = useRef(false);

  React.useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    if (isOpen && !hasCompletedRef.current) {
      gsap.to(page, {
        rotateY: -180,
        duration,
        ease: 'power2.inOut',
        onComplete: () => {
          hasCompletedRef.current = true;
          onComplete?.();
        },
      });
    } else if (!isOpen) {
      hasCompletedRef.current = false;
      gsap.to(page, {
        rotateY: 0,
        duration,
        ease: 'power2.inOut',
      });
    }
  }, [isOpen, duration, onComplete]);

  return (
    <div
      className={`page-turn-wrapper perspective-container ${className}`}
      style={{ perspective: '1500px' }}
    >
      <div
        ref={pageRef}
        className="page-turn-front relative w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
          transformOrigin: 'left center',
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Simple 3D perspective wrapper without animation
interface PerspectiveWrapperProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export function PerspectiveWrapper({
  children,
  className = '',
  intensity = 'medium',
}: PerspectiveWrapperProps) {
  const perspectiveValue = {
    low: '500px',
    medium: '1000px',
    high: '2000px',
  }[intensity];

  return (
    <div
      className={`perspective-container ${className}`}
      style={{ perspective: perspectiveValue }}
    >
      {children}
    </div>
  );
}

// 3D card flip component
interface CardFlipProps {
  isFlipped: boolean;
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
  flipDuration?: number;
}

export function CardFlip({
  isFlipped,
  front,
  back,
  className = '',
  flipDuration = 0.8,
}: CardFlipProps) {
  return (
    <div className={`card-flip-wrapper ${className}`} style={{ perspective: '1000px' }}>
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped ? -180 : 0 }}
        transition={{ duration: flipDuration, ease: 'power2.inOut' }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="card-front absolute inset-0 w-full h-full backface-hidden">
          {front}
        </div>
        <div
          className="card-back absolute inset-0 w-full h-full backface-hidden"
          style={{ transform: 'rotateY(180deg)' }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
}