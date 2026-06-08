'use client';

import React, { useState, useRef, useCallback, useLayoutEffect, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { useSceneState } from '@/components/scene-director/SceneStateProvider';
import { useSceneNavigation } from '@/components/scene-director/SceneDirector';
import type { SceneProps } from '@/types/scene';

export default function Scene00_Gate({ isActive, onComplete }: SceneProps) {
  const [inputValue, setInputValue] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [error, setError] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => { setIsClient(true); }, []);
  const { unlockScene } = useSceneState();
  const { navigateToNext } = useSceneNavigation();
  
  const keyholeRef = useRef<HTMLDivElement>(null);
  const gateRef = useRef<HTMLDivElement>(null);
  const irisRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);



  const correctPassphrase = 'shona bor';

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (inputValue.toLowerCase().trim() === correctPassphrase) {
        setIsUnlocking(true);

        // Animate keyhole glow
        if (keyholeRef.current) {
          gsap.to(keyholeRef.current, {
            scale: 1.3,
            filter: 'drop-shadow(0 0 30px rgba(244, 169, 0, 1))',
            duration: 0.5,
            ease: 'power2.out',
          });
        }

        // Iris bloom from keyhole
        if (irisRef.current) {
          gsap.fromTo(
            irisRef.current,
            { opacity: 0, scale: 0 },
            {
              opacity: 1,
              scale: 2.5,
              duration: 1.5,
              ease: 'power4.inOut',
              delay: 0.2,
            }
          );
        }

        // Fade gate beneath bloom
        if (gateRef.current) {
          gsap.to(gateRef.current, {
            opacity: 0,
            scale: 1.02,
            duration: 1.5,
            ease: 'power4.inOut',
            delay: 0.3,
            onComplete: () => {
              unlockScene(0, inputValue);
              onComplete?.();
            },
          });
        }
      } else {
        setError(true);
        setTimeout(() => setError(false), 800);
      }
    },
    [inputValue, unlockScene, navigateToNext]
  );

  if (!isActive) return null;

  return (
    <div
      ref={gateRef}
      className="relative w-full h-full flex flex-col items-center justify-center bg-garden-dark overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-garden-charcoal to-garden-dark" />

      {/* Gate structure */}
      <div className="relative z-10 flex flex-col items-center gap-12 px-6">
        {/* Keyhole */}
        <motion.div
          ref={keyholeRef}
          className="relative w-24 h-32 cursor-pointer"
          animate={error ? { x: [-5, 5, -5, 5, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          {/* Keyhole shape */}
          <svg
            viewBox="0 0 96 128"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer keyhole glow */}
            <motion.circle
              cx="48"
              cy="40"
              r="24"
              fill="url(#keyholeGradient)"
              className="keyhole-glow"
              animate={{
                filter: [
                  'drop-shadow(0 0 8px rgba(201, 162, 39, 0.6))',
                  'drop-shadow(0 0 20px rgba(244, 169, 0, 0.9))',
                  'drop-shadow(0 0 8px rgba(201, 162, 39, 0.6))',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* Keyhole body */}
            <path
              d="M48 8C29.2 8 14 23.2 14 42C14 54.4 20.8 65.2 30.8 70.4V120C30.8 123.3 33.5 126 36.8 126H59.2C62.5 126 65.2 123.3 65.2 120V70.4C75.2 65.2 82 54.4 82 42C82 23.2 66.8 8 48 8ZM48 56C44.7 56 42 53.3 42 50C42 46.7 44.7 44 48 44C51.3 44 54 46.7 54 50C54 53.3 51.3 56 48 56Z"
              fill="#1a1a1a"
              stroke="#c9a227"
              strokeWidth="2"
            />
            
            <defs>
              <radialGradient id="keyholeGradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(48 40) rotate(90) scale(24)">
                <stop stopColor="#c9a227" />
                <stop offset="1" stopColor="#c9a227" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>

          {/* Extra glow overlay */}
          <div
            className="absolute inset-0 rounded-full bg-gradient-radial from-garden-amber/30 to-transparent"
            style={{ filter: 'blur(20px)' }}
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          className="font-display text-4xl md:text-6xl text-garden-parchment text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
        >
          The Hidden Gate
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="font-serif text-garden-parchment/70 text-center text-lg max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          Call me by the name that only you know...
        </motion.p>

        {/* Passphrase form */}
        <motion.form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          data-gramm="false"
          data-gramm_editor="false"
          data-enable-grammarly="false"
        >
          {isClient ? (
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter the passphrase..."
              className={`
                w-64 px-6 py-3 bg-garden-charcoal/80 border-2 rounded-lg
                font-serif text-garden-parchment text-center text-lg
                placeholder:text-garden-parchment/40
                focus:outline-none focus:border-garden-amber
                transition-colors duration-300
                ${error ? 'border-garden-crimson' : 'border-garden-amber/50'}
              `}
              disabled={isUnlocking}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
          ) : (
            <div className="w-64 h-[52px]" />
          )}

          <motion.button
            type="submit"
            className={`
              px-8 py-3 bg-garden-amber/20 border-2 border-garden-amber
              rounded-lg font-serif text-garden-amber text-lg
              hover:bg-garden-amber hover:text-garden-dark
              transition-all duration-300
              ${isUnlocking ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            disabled={isUnlocking || !inputValue.trim()}
            whileHover={!isUnlocking ? { scale: 1.05 } : {}}
            whileTap={!isUnlocking ? { scale: 0.98 } : {}}
          >
            {isUnlocking ? 'Opening...' : 'Enter the Garden'}
          </motion.button>
        </motion.form>

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-px h-32 bg-gradient-to-b from-transparent via-garden-amber/30 to-transparent" />
        <div className="absolute top-1/4 right-1/4 w-px h-32 bg-gradient-to-b from-transparent via-garden-amber/30 to-transparent" />
      </div>

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url('/textures/vignette.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: 'multiply',
          opacity: 0.7,
        }}
      />
    </div>
  );
}