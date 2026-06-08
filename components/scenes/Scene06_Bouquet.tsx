'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SceneProps } from '@/types/scene';

const NOTES = [
  'I love the way you laugh.',
  'I love how you stay.',
  'I love your sleepy voice.',
  'I love your kindness.',
  'I love your patience.',
  'I love your stubbornness.',
  'I love your smile.',
  'I love how you care.',
  'I love our conversations.',
  'I love your honesty.',
  'I love your eyes.',
  'I love your chaos.',
  'I love your warmth.',
  'I love your heart.',
  'I love being yours.',
  'I love every version of you.',
];

const COLORS = [
  '#FFE8D6',
  '#FFD6E8',
  '#F3E8FF',
  '#FFF3BF',
  '#D6F5FF',
  '#FFE5EC',
];

const FIREWORK_COLORS = ['#d4af37', '#ff4d6d', '#00f5d4', '#9b5de5', '#ffee32', '#00bbf9'];

export default function Scene06_Bouquet({
  isActive,
  onComplete,
}: SceneProps) {
  const [opened, setOpened] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // High-fidelity particle parameters computed cleanly once
  const fireworkParticles = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 100 + Math.random() * 160;
      return {
        id: i,
        x: Math.cos(angle) * velocity,
        y: Math.sin(angle) * velocity - 20, 
        color: FIREWORK_COLORS[i % FIREWORK_COLORS.length],
        size: Math.random() * 3 + 2,
        duration: 0.7 + Math.random() * 0.7,
      };
    });
  }, []);

  useEffect(() => {
    if (!opened) return;

    const messageTimer = setTimeout(() => {
      setShowMessage(true);
    }, 4000);

    const continueTimer = setTimeout(() => {
      setShowContinue(true);
    }, 7500);

    const autoTimer = setTimeout(() => {
      onComplete?.();
    }, 24000);

    return () => {
      clearTimeout(messageTimer);
      clearTimeout(continueTimer);
      clearTimeout(autoTimer);
    };
  }, [opened, onComplete]);

  if (!isActive) return null;

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-black select-none flex flex-col items-center justify-between p-6"
    >
      {/* Background Gradient */}
      <div
        className="absolute inset-0 transition-colors duration-1000"
        style={{
          background: opened
            ? 'radial-gradient(circle at center, rgba(139,94,52,0.18) 0%, #050505 80%)'
            : 'radial-gradient(circle at center, rgba(70,55,35,0.35) 0%, #050505 65%)',
        }}
      />

      {/* Stars Field */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(60)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 1.5 + 1}px`,
              height: `${Math.random() * 1.5 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{
              duration: 2 + Math.random() * 4,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      {/* Golden & Colorful Burst Particles (Treasure Chest Flare) */}
      <AnimatePresence>
        {opened && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30">
            {fireworkParticles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute rounded-full"
                style={{
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.color,
                  boxShadow: `0 0 8px ${p.color}, 0 0 2px #fff`,
                  x: 0,
                  y: 0,
                }}
                initial={{ opacity: 1, scale: 1 }}
                animate={{
                  x: p.x,
                  y: p.y,
                  opacity: [1, 1, 0],
                  scale: [1, 1.2, 0],
                }}
                transition={{
                  duration: p.duration,
                  ease: [0.1, 0.8, 0.25, 1],
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Main Title Banner - Clean responsive typography bounds */}
      <motion.h2
        className="relative mx-auto text-garden-parchment text-xl sm:text-2xl md:text-4xl font-serif tracking-wide text-center w-full max-w-xs sm:max-w-xl pt-4 z-50 pointer-events-none"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        A Box Full of Things I Never Said
      </motion.h2>

      {/* Core Animated Treasure Box Layout */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
        <motion.div
          className="relative w-36 h-28 sm:w-48 sm:h-36 flex items-end justify-center cursor-pointer"
          style={{ perspective: '1000px' }}
          onClick={() => { if (!opened) setOpened(true); }}
          whileHover={!opened ? { scale: 1.04 } : {}}
          whileTap={!opened ? { scale: 0.98 } : {}}
          animate={!opened ? {
            x: [0, -1, 1, -1, 1, 0, 0, 0],
            scale: [1, 1.02, 1],
            boxShadow: [
              '0 0 25px rgba(212,175,55,0.15)',
              '0 0 45px rgba(212,175,55,0.35)',
              '0 0 25px rgba(212,175,55,0.15)'
            ]
          } : { scale: 0.85, opacity: [1, 1, 0.2], transition: { delay: 4, duration: 1.5 } }}
          transition={!opened ? {
            x: { duration: 0.5, repeat: Infinity, repeatDelay: 2.5, ease: 'linear' },
            scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
            boxShadow: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
          } : {}}
        >
          {/* Main Lower Chest Body */}
          <div
            className="absolute bottom-0 left-0 w-full h-20 sm:h-26 rounded-b-xl shadow-2xl z-10"
            style={{
              background: 'linear-gradient(135deg, #c89f65, #7a512b)',
              border: '1px solid rgba(212,175,55,0.2)',
            }}
          >
            <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-1.5 sm:w-2 bg-gradient-to-r from-[#ffd700] to-[#b8860b]" />
            <div className="absolute right-4 sm:right-6 top-0 bottom-0 w-1.5 sm:w-2 bg-gradient-to-r from-[#ffd700] to-[#b8860b]" />
            <div className="absolute left-1/2 top-3 -translate-x-1/2 w-4 h-5 bg-[#b8860b] rounded-sm shadow-inner border border-yellow-400/30 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-black/40" />
            </div>
          </div>

          {/* Treasure Box Lid */}
          <motion.div
            className="absolute left-0 w-full h-8 sm:h-10 rounded-t-xl z-20 origin-bottom transform-gpu"
            style={{
              bottom: '18px', 
              background: 'linear-gradient(135deg, #e0ba87, #966336)',
              transformStyle: 'preserve-3d',
              borderTop: '1px solid rgba(255,255,255,0.2)',
            }}
            animate={opened ? {
              rotateX: -120,
              y: -20,
              z: 25,
              filter: 'brightness(0.5)'
            } : { rotateX: 0, y: 0, z: 0 }}
            transition={{ type: 'spring', stiffness: 140, damping: 16 }}
          >
            <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-1.5 sm:w-2 bg-gradient-to-r from-[#ffd700] to-[#b8860b]" />
            <div className="absolute right-4 sm:right-6 top-0 bottom-0 w-1.5 sm:w-2 bg-gradient-to-r from-[#ffd700] to-[#b8860b]" />
          </motion.div>
        </motion.div>

        {!opened && (
          <p className="text-center text-garden-parchment/60 font-serif text-xs sm:text-sm italic mt-4 tracking-wide animate-pulse">
            Tap the chest to open
          </p>
        )}
      </div>

      {/* 16 Draggable Love Notes Matrix */}
      <AnimatePresence>
        {opened &&
          NOTES.map((note, index) => {
            const angle = (index / NOTES.length) * Math.PI * 2;
            const isMobileViewport = typeof window !== 'undefined' && window.innerWidth < 768;
            
            // Fixed mobile trajectory behavior: Compressed width footprint, staggered height allocation
            const radiusX = isMobileViewport 
              ? 65 + (index % 3) * 16 
              : 220 + (index % 4) * 45;
            const radiusY = isMobileViewport 
              ? 110 + (index % 4) * 28 
              : 160 + (index % 3) * 45;

            // Mathematical calculation plotting notes safely along a vertical-leaning ellipse
            const targetX = Math.cos(angle) * radiusX;
            const targetY = Math.sin(angle) * radiusY;

            return (
              <motion.div
                key={note}
                drag
                dragConstraints={containerRef} 
                dragElastic={0.05}
                dragMomentum={false}
                className="absolute cursor-grab active:cursor-grabbing z-30 touch-none"
                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                animate={{
                  x: targetX,
                  y: targetY,
                  opacity: 1,
                  scale: 1,
                  rotate: -10 + (index * 7) % 20,
                }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{
                  duration: 1.1,
                  delay: index * 0.035,
                  type: 'spring',
                  stiffness: 95,
                  damping: 16,
                }}
                style={{
                  left: '50%',
                  top: '50%',
                  marginTop: isMobileViewport ? '-34px' : '-48px', 
                  marginLeft: isMobileViewport ? '-56px' : '-88px',
                }}
                whileHover={{ scale: 1.06, rotate: 0, zIndex: 100 }}
              >
                <div
                  className="w-28 sm:w-44 p-2.5 sm:p-4 rounded-xl shadow-xl border border-black/5 select-none relative"
                  style={{ background: COLORS[index % COLORS.length] }}
                >
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-red-600/30 shadow-inner" />
                  <p className="text-[11px] sm:text-sm text-neutral-800 font-serif leading-tight sm:leading-relaxed text-center font-medium pt-1">
                    {note}
                  </p>
                </div>
              </motion.div>
            );
          })}
      </AnimatePresence>

      {/* Bottom Central Emotional Response Panel */}
      <div className="w-full flex flex-col items-center gap-4 mb-4 z-40 pointer-events-none">
        <AnimatePresence>
          {showMessage && (
            <motion.div
              className="text-center px-4 w-full max-w-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <p className="text-garden-parchment text-base sm:text-xl font-serif italic tracking-wide leading-normal">
                Every little piece of my heart
              </p>
              <p className="text-garden-parchment text-base sm:text-xl font-serif italic tracking-wide leading-normal">
                finds its way back to you.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Flow Sequence Continuation Controller */}
        {showContinue && (
          <motion.button
            className="pointer-events-auto px-6 py-2.5 sm:px-8 sm:py-3 rounded-full border border-garden-amber bg-garden-amber/10 hover:bg-garden-amber/20 text-garden-parchment font-serif text-xs sm:text-sm tracking-widest uppercase transition-colors duration-300 shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onComplete?.()}
          >
            Continue →
          </motion.button>
        )}
      </div>
    </div>
  );
}