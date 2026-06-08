'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ControlledPageTurn } from '@/components/shared/PageTurn3D';
import type { SceneProps } from '@/types/scene';

export default function Scene01_Cover({ isActive, onComplete }: SceneProps) {
  const [isOpen, setIsOpen] = useState(false);
  const bookRef = useRef<HTMLButtonElement>(null);
  const coverTitleRef = useRef<HTMLHeadingElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  // Generate static golden dust particles configuration outside the render cycle
  const dustParticles = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: `${5 + Math.random() * 90}%`,
      scale: Math.random() * 0.6 + 0.2,
      duration: 7 + Math.random() * 5,
      delay: i * 0.4,
    }));
  }, []);

  useEffect(() => {
    if (!isActive) return;

    // Use gsap.context for scoped animations and perfect memory cleanup
    const ctx = gsap.context(() => {
      if (coverTitleRef.current) {
        gsap.fromTo(
          coverTitleRef.current,
          { opacity: 0, y: 30, filter: 'blur(10px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.8,
            delay: 0.3,
            ease: 'power4.out',
          }
        );
      }

      if (backgroundRef.current) {
        gsap.to(backgroundRef.current, {
          scale: 1.04,
          duration: 6,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }
    });

    return () => ctx.revert(); // Cleans up all active tweens on unmount/deactivation
  }, [isActive]);

  const handleOpen = () => {
    if (isOpen || !isActive) return;
    setIsOpen(true);
  };

  const handlePageTurnComplete = () => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 400);
    return () => clearTimeout(timer);
  };

  // Inline-block safe clipping styles to prevent rendering black boxes across layout engines
  const titleShimmerStyle = {
    background: 'linear-gradient(120deg, #1a1a1a 30%, #c5a86a 50%, #1a1a1a 70%)',
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  if (!isActive) return null;

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-garden-dark overflow-hidden select-none">
      {/* Dynamic Background Shimmer & Gradient */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0 bg-gradient-radial from-garden-charcoal/70 via-garden-dark to-black transform will-change-transform"
      />

      {/* Ambient Lighting Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none" />

      {/* Golden Dust Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-screen">
        {dustParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1.5 h-1.5 rounded-full bg-gradient-to-tr from-garden-amber to-yellow-200"
            initial={{ x: particle.x, y: '105%', scale: particle.scale, opacity: 0 }}
            animate={{
              y: '-10%',
              opacity: [0, 0.7, 0.7, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* 3D Book Layout Container */}
      <ControlledPageTurn
        isOpen={isOpen}
        className="relative z-10 block appearance-none outline-none focus-visible:ring-2 focus-visible:ring-garden-amber/70 rounded-lg"
        duration={1.8}
        onComplete={handlePageTurnComplete}
      >
        <motion.button
          ref={bookRef}
          disabled={isOpen}
          onClick={handleOpen}
          aria-label="Open the book: The Garden Inside My Heart"
          className="relative block text-left bg-transparent border-0 p-0 m-0 cursor-pointer outline-none group"
          whileHover={!isOpen ? { scale: 1.02, rotateY: -2 } : {}}
          whileTap={!isOpen ? { scale: 0.99 } : {}}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{ perspective: '1200px' }}
        >
          {/* Visual Book Depth Pages Stack (Visible behind the cover) */}
          <div className="absolute top-[4px] right-[-6px] w-[98%] h-[98%] bg-garden-parchment-aged border border-black/10 rounded-r shadow-md transform origin-left rotate-Y-1 z-0 transition-transform duration-300 group-hover:translate-x-1" />
          <div className="absolute top-[8px] right-[-12px] w-[96%] h-[96%] bg-garden-pearl/90 border border-black/10 rounded-r shadow-sm transform origin-left rotate-Y-2 z-0 transition-transform duration-300 group-hover:translate-x-2" />

          {/* Core Book Cover */}
          <div
            className="relative w-[85vw] max-w-md h-[65vh] max-h-[520px] min-h-[400px] bg-gradient-to-br from-garden-parchment-aged via-garden-parchment to-garden-pearl rounded-l-sm rounded-r-md overflow-hidden z-10 transition-shadow duration-300"
            style={{
              boxShadow: isOpen 
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                : '-12px 0 30px rgba(0, 0, 0, 0.5), 0 15px 40px rgba(0, 0, 0, 0.4), inset 0 0 40px rgba(201, 162, 39, 0.08)',
            }}
          >
            {/* Fine Fabric Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/textures/linen.png')] mix-blend-overlay" />

            {/* Heavy Book Spine Stamp Visual */}
            <div
              className="absolute left-0 top-0 bottom-0 w-7 bg-gradient-to-r from-black/30 via-garden-amber/20 to-transparent border-r border-black/5"
              style={{ boxShadow: 'inset 3px 0 8px rgba(0,0,0,0.2), inset -3px 0 5px rgba(0,0,0,0.1)' }}
            />

            {/* Premium Gold Embossed Frame Borders */}
            <div className="absolute inset-4 border-[3px] border-double border-garden-amber/60 rounded-md pointer-events-none">
              <div className="absolute inset-1.5 border border-garden-amber/30 rounded-sm" />
            </div>

            {/* Ornamental Frame Corner Accents */}
            <div className="absolute inset-6 pointer-events-none">
              {/* Top Left */}
              <svg className="absolute top-0 left-0 w-8 h-8 text-garden-amber/70" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M0 0h24v4H4v20H0V0z" fill="currentColor" opacity="0.1" />
                <path d="M1 28V1h27M6 22V6h16" />
              </svg>
              {/* Top Right */}
              <svg className="absolute top-0 right-0 w-8 h-8 text-garden-amber/70 rotate-90" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 28V1h27M6 22V6h16" />
              </svg>
              {/* Bottom Left */}
              <svg className="absolute bottom-0 left-0 w-8 h-8 text-garden-amber/70 -rotate-90" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 28V1h27M6 22V6h16" />
              </svg>
              {/* Bottom Right */}
              <svg className="absolute bottom-0 right-0 w-8 h-8 text-garden-amber/70 rotate-180" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 28V1h27M6 22V6h16" />
              </svg>
            </div>

            {/* Cover Content Centerpiece */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-10 z-20">
              {/* Premium Shimmering Title Layout */}
              <div ref={coverTitleRef} className="w-full text-center">
                <h2 className="leading-tight tracking-wide">
                  {/* THE GARDEN - Uses inline-block to securely fit background clipping boundaries */}
                  <span
                    className="inline-block animate-shimmer font-accent text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-[0.12em]"
                    style={titleShimmerStyle}
                  >
                    The Garden
                  </span>
                  
                  {/* inside my - Set to Great Vibes script cleanly using normal-case */}
                  <span className="block font-display text-3xl sm:text-4xl my-1 text-garden-amber/90 normal-case tracking-normal">
                    inside my
                  </span>
                  
                  {/* HEART - Plays perfectly with inline-block text boundaries */}
                  <span
                    className="inline-block animate-shimmer font-accent text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-[0.18em]"
                    style={titleShimmerStyle}
                  >
                    Heart
                  </span>
                </h2>
              </div>

              {/* Subtitle Accent */}
              <p className="font-serif italic text-garden-charcoal/80 mt-8 text-base sm:text-lg tracking-wider text-center">
                A chronicled story of us
              </p>

              {/* Center Divider Motif */}
              <div className="flex items-center gap-4 mt-8 w-full justify-center opacity-80">
                <div className="w-10 h-[1px] bg-gradient-to-r from-transparent to-garden-amber/60" />
                <svg className="w-5 h-5 text-garden-amber/80 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582" />
                </svg>
                <div className="w-10 h-[1px] bg-gradient-to-l from-transparent to-garden-amber/60" />
              </div>

              {/* Bottom Action Prompter */}
              <AnimatePresence>
                {!isOpen && (
                  <motion.div
                    className="absolute bottom-10 flex flex-col items-center gap-1.5 pointer-events-none"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: 1 }}
                  >
                    <motion.span 
                      className="font-serif text-xs uppercase tracking-[0.2em] text-garden-charcoal/50"
                      animate={{ opacity: [0.4, 0.9, 0.4] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      Tap Cover to Enter
                    </motion.span>
                    <motion.div 
                      className="w-1 h-1 bg-garden-amber rounded-full"
                      animate={{ y: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.button>
      </ControlledPageTurn>

      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .animate-shimmer {
          animation: shimmer 7s linear infinite;
        }
      `}</style>
    </div>
  );
}