'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import InkReveal from '@/components/shared/InkReveal';
import type { SceneProps } from '@/types/scene';

export default function Scene02_Letter({ isActive, onComplete }: SceneProps) {
  const letterRef = useRef<HTMLDivElement>(null);
  const [showSeal, setShowSeal] = useState(false);
  const [textComplete, setTextComplete] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const autoProgressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const letterContent = `My Dearest,

If you are reading this, then you have found your way through the gate, past the cover, and into the very heart of me.

This is not just a story. This is a garden — one I have tended with every memory, every laugh, every whispered moment we have shared.

Step inside, and let me show you the garden inside my heart.

With all my love,
Always yours`;

  useEffect(() => {
    if (!isActive || !letterRef.current) return;

    // Initial entrance animation with perspective
    gsap.fromTo(
      letterRef.current,
      { opacity: 0, y: 50, rotateX: -15, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        duration: 1.5,
        ease: 'power3.out',
      }
    );
  }, [isActive]);

  // Auto-progress timer after text complete
  useEffect(() => {
    if (textComplete && showContinue) {
      autoProgressTimerRef.current = setTimeout(() => {
        onComplete?.();
      }, 3000);
    }

    return () => {
      if (autoProgressTimerRef.current) {
        clearTimeout(autoProgressTimerRef.current);
      }
    };
  }, [textComplete, showContinue, onComplete]);

  const handleTextComplete = () => {
    setTextComplete(true);
    setTimeout(() => setShowSeal(true), 500);
    setTimeout(() => setShowContinue(true), 1200);
  };

  const handleLetterClick = () => {
    if (textComplete && !showContinue) {
      setShowContinue(true);
    }
  };

  const handleContinue = () => {
    if (autoProgressTimerRef.current) {
      clearTimeout(autoProgressTimerRef.current);
    }
    onComplete?.();
  };

  if (!isActive) return null;

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-garden-dark overflow-hidden">
      {/* Background with subtle texture */}
      <div className="absolute inset-0 bg-gradient-radial from-garden-charcoal/50 to-garden-dark" />

      {/* Floating dust particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-garden-amber/50"
            style={{ left: `${8 + i * 8}%` }}
            animate={{
              y: ['100vh', '-20%'],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 6,
              repeat: Infinity,
              delay: i * 1.5,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Letter container */}
      <motion.div
        ref={letterRef}
        className="relative w-[90vw] max-w-lg mx-4 cursor-pointer"
        style={{ perspective: '1500px' }}
        onClick={handleLetterClick}
        whileHover={{ scale: textComplete && !showContinue ? 1.01 : 1 }}
      >
        {/* Letter paper with perspective entrance */}
        <div
          className="
            relative rounded-sm shadow-2xl p-8 md:p-12
          "
          style={{
            backgroundImage: `url('/textures/parchment.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            boxShadow: `
              0 25px 70px rgba(0, 0, 0, 0.5),
              0 0 0 1px rgba(201, 162, 39, 0.1),
              inset 0 0 80px rgba(201, 162, 39, 0.05)
            `,
            filter: 'contrast(1.02) saturate(0.95)',
          }}
        >
          {/* Noise grain overlay */}
          <div
            className="absolute inset-0 opacity-[0.12] pointer-events-none rounded-sm mix-blend-overlay"
            style={{
              backgroundImage: `url('/textures/noise.jpg')`,
              backgroundSize: '200px 200px',
              backgroundRepeat: 'repeat',
            }}
          />

          {/* Letter content */}
          <div className="relative z-10">
            <InkReveal
              text={letterContent}
              speed={25}
              delay={800}
              onComplete={handleTextComplete}
              className="font-serif text-garden-charcoal text-base md:text-lg leading-relaxed whitespace-pre-line"
              tag="div"
            />
          </div>

          {/* Wax seal with candlelight flicker */}
          <motion.div
            className="absolute -bottom-6 -right-4 md:-right-6"
            initial={{ scale: 0, opacity: 0, rotate: -180 }}
            animate={showSeal ? { scale: 1, opacity: 1, rotate: 0 } : {}}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
          >
            <motion.div
              className="wax-seal w-16 h-16 md:w-20 md:h-20 flex items-center justify-center"
              animate={{
                scale: [1, 1.03, 0.98, 1],
                filter: ['brightness(1)', 'brightness(1.15)', 'brightness(0.95)', 'brightness(1)'],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg viewBox="0 0 32 32" className="w-10 h-10 md:w-12 md:h-12 text-garden-crimson/90">
                <path
                  fill="currentColor"
                  d="M16 2L18.5 9.5L26 10L20 15L22 23L16 19L10 23L12 15L6 10L13.5 9.5L16 2Z"
                />
              </svg>
            </motion.div>
          </motion.div>
        </div>

        {/* Continue button */}
        {showContinue && (
          <motion.button
            className="
              absolute -bottom-20 left-1/2 -translate-x-1/2
              font-serif text-garden-parchment/80 text-lg
              px-6 py-2 border border-garden-amber/40 rounded
              hover:bg-garden-amber/10 hover:border-garden-amber/60
              transition-all duration-300
            "
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={(e) => {
              e.stopPropagation();
              handleContinue();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Continue your journey...
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}