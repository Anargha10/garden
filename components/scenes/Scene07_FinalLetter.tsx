'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import InkReveal from '@/components/shared/InkReveal';
import type { SceneProps } from '@/types/scene';

export default function Scene07_FinalLetter({ isActive, onComplete }: SceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const [textRevealed, setTextRevealed] = useState(false);
  const [showContinue, setShowContinue] = useState(false);

  const finalLetterContent = `My Love,

This garden we have built together — 
it grows not with water, but with time.
Not with soil, but with trust.
Not with sun, but with the light you bring to every moment.

In every memory we have created,
in every adventure we have shared,
in every quiet moment we have treasured,
I have found the truest version of myself.

You are my garden.
You are my heart.
You are my always.

Forever and Always,
Your Love`;

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    // Initial container animation
    gsap.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: 'power2.out' }
    );

    // Letter unfurl animation
    if (letterRef.current) {
      gsap.fromTo(
        letterRef.current,
        { scaleY: 0.1, opacity: 0 },
        { scaleY: 1, opacity: 1, duration: 1.5, ease: 'power3.out', delay: 0.3 }
      );
    }
  }, [isActive]);

  const handleTextComplete = () => {
    setTextRevealed(true);
    setTimeout(() => setShowContinue(true), 2000);
  };

  const handleLetterClick = () => {
    if (textRevealed && !showContinue) {
      setShowContinue(true);
    }
  };

  const handleContinue = () => {
    onComplete?.();
  };

  if (!isActive) return null;

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-garden-dark overflow-hidden">
      {/* Background with warm glow */}
      <div className="absolute inset-0 bg-gradient-radial from-garden-charcoal via-garden-dark to-garden-cosmic" />

      {/* Star field with parallax depth */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-garden-cream"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.3,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>

      {/* Letter */}
      <motion.div
        ref={containerRef}
        className="relative w-[90vw] max-w-lg mx-4 cursor-pointer"
        onClick={handleLetterClick}
      >
        <motion.div
          ref={letterRef}
          className="relative rounded-lg p-8 md:p-12 shadow-2xl"
          style={{
            backgroundImage: `url('/textures/parchment.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transformOrigin: 'top center',
            boxShadow: `
              0 25px 80px rgba(0, 0, 0, 0.6),
              0 0 0 1px rgba(201, 162, 39, 0.2),
              inset 0 0 100px rgba(201, 162, 39, 0.08),
              0 0 60px rgba(253,230,138,0.1)
            `,
          }}
        >
          {/* Noise grain overlay */}
          <div
            className="absolute inset-0 opacity-[0.12] pointer-events-none rounded-lg mix-blend-overlay"
            style={{
              backgroundImage: `url('/textures/noise.jpg')`,
              backgroundSize: '200px 200px',
              backgroundRepeat: 'repeat',
            }}
          />
          {/* Decorative border */}
          <div className="absolute inset-3 border border-garden-amber/30 rounded pointer-events-none" />

          {/* Vignette effect for candlelight reading feel */}
          <div
            className="absolute inset-0 rounded-lg pointer-events-none opacity-30"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
            }}
          />

          <InkReveal
            text={finalLetterContent}
            speed={35}
            delay={1000}
            onComplete={handleTextComplete}
            className="font-serif text-garden-charcoal text-base md:text-lg leading-relaxed whitespace-pre-line"
            tag="div"
          />

          {/* Continue button */}
          {showContinue && (
            <motion.button
              className="
                absolute -bottom-16 left-1/2 -translate-x-1/2
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
              One more moment awaits...
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}