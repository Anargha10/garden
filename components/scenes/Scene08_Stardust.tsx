'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import type { SceneProps } from '@/types/scene';

export default function Scene08_Stardust({ isActive }: SceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [easterEggVisible, setEasterEggVisible] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  const textLines = [
    { text: '6 May 2026', delay: 0, className: 'text-lg md:text-xl font-serif tracking-wide' },
    { text: 'Month One', delay: 1500, className: 'text-2xl md:text-3xl font-display' },
    { text: 'One month down. A lifetime to go.', delay: 3000, className: 'text-lg md:text-xl font-serif italic' },
    { text: '∞', delay: 5500, className: 'text-6xl md:text-8xl font-serif' },
    { text: 'To be continued...', delay: 7500, className: 'text-xl md:text-2xl font-serif italic' },
    { text: 'This garden grows every day.', delay: 11000, className: 'text-lg md:text-xl font-serif' },
    { text: 'And so does my love for you.', delay: 13000, className: 'text-lg md:text-xl font-serif' },
  ];

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    // Animate stars twinkling with varied speeds
    const stars = containerRef.current.querySelectorAll('.star');
    stars.forEach((star, i) => {
      gsap.to(star, {
        opacity: Math.random() * 0.5 + 0.5,
        scale: Math.random() * 0.5 + 0.75,
        duration: 1 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        delay: i * 0.1,
        ease: 'sine.inOut',
      });
    });

    // Stagger text lines with spring animation
    const lines = containerRef.current.querySelectorAll('.text-line');
    lines.forEach((line, i) => {
      gsap.fromTo(
        line,
        { opacity: 0, y: 30, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          delay: textLines[i].delay / 1000,
          ease: 'back.out(1.4)',
        }
      );
    });
  }, [isActive]);

  const handleEasterEggClick = () => {
    if (!showEasterEgg) {
      setShowEasterEgg(true);
      setEasterEggVisible(true);
    } else {
      setEasterEggVisible(false);
      setTimeout(() => setShowEasterEgg(false), 500);
    }
  };

  if (!isActive) return null;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-center bg-garden-cosmic overflow-hidden"
    >
      {/* Deep star field with parallax layers */}
      <div className="absolute inset-0">
        {/* Far stars (slow) */}
        {[...Array(40)].map((_, i) => (
          <div
            key={`far-${i}`}
            className="star absolute rounded-full bg-garden-cream/40"
            style={{
              width: `${Math.random() * 2 + 0.5}px`,
              height: `${Math.random() * 2 + 0.5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
        {/* Mid stars (medium) */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`mid-${i}`}
            className="star absolute rounded-full bg-garden-cream"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
        {/* Near stars (fast, bright) */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`near-${i}`}
            className="star absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 2 + 2}px`,
              height: `${Math.random() * 2 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.6, 1, 0.6],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 1.5 + Math.random() * 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* Golden dust particles overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={`dust-${i}`}
            className="absolute w-1 h-1 rounded-full bg-garden-amber/50"
            style={{ left: `${Math.random() * 100}%` }}
            animate={{
              y: ['-10%', '110%'],
              opacity: [0, 0.5, 0],
              x: [0, Math.random() * 30 - 15, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 6,
              repeat: Infinity,
              delay: i * 0.8,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Central message container */}
      <div className="relative z-10 text-center px-8 max-w-2xl">
        {/* Date */}
        <div className="text-line">
          <p className="text-lg md:text-xl font-serif tracking-wide text-garden-parchment/80">
            {textLines[0].text}
          </p>
        </div>

        {/* Month One */}
        <div className="text-line mt-4">
          <p className="text-2xl md:text-3xl font-display text-garden-parchment">
            {textLines[1].text}
          </p>
        </div>

        {/* Subtitle */}
        <div className="text-line mt-4">
          <p className="text-lg md:text-xl font-serif italic text-garden-parchment/70">
            {textLines[2].text}
          </p>
        </div>

        {/* Infinity symbol with pulse */}
        <div className="text-line mt-8">
          <motion.p
            className="text-6xl md:text-8xl font-serif text-garden-amber"
            animate={{
              scale: [1, 1.1, 1],
              textShadow: [
                '0 0 20px rgba(201,162,39,0.3)',
                '0 0 40px rgba(201,162,39,0.6)',
                '0 0 20px rgba(201,162,39,0.3)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            {textLines[3].text}
          </motion.p>
        </div>

        {/* To be continued */}
        <div className="text-line mt-6">
          <p className="text-xl md:text-2xl font-serif italic text-garden-parchment/80">
            {textLines[4].text}
          </p>
        </div>

        {/* Final messages */}
        <div className="text-line mt-12">
          <p className="text-lg md:text-xl font-serif text-garden-parchment/70">
            {textLines[5].text}
          </p>
        </div>
        <div className="text-line mt-2">
          <p className="text-lg md:text-xl font-serif text-garden-parchment/70">
            {textLines[6].text}
          </p>
        </div>

        {/* Warm glow behind text */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(253,230,138,0.4) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Easter egg: brightest star */}
      <motion.div
        className="absolute top-1/4 left-1/3 cursor-pointer z-20"
        whileHover={{ scale: 1.5 }}
        onClick={handleEasterEggClick}
      >
        <motion.div
          className="w-3 h-3 rounded-full bg-white"
          animate={{
            opacity: [1, 0.5, 1],
            scale: [1, 1.5, 1],
            boxShadow: [
              '0 0 10px 2px rgba(255,255,255,0.8)',
              '0 0 20px 5px rgba(255,255,255,1)',
              '0 0 10px 2px rgba(255,255,255,0.8)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Easter egg content */}
      {showEasterEgg && (
        <motion.div
          className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 z-30"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: easterEggVisible ? 1 : 0, scale: easterEggVisible ? 1 : 0.8 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="
              bg-garden-charcoal/90 border border-garden-amber/30
              rounded-lg px-6 py-4 shadow-2xl
            "
          >
            <p className="font-serif text-garden-amber text-lg">
              Future Memory #1
            </p>
            <p className="font-serif text-garden-parchment/60 text-sm mt-1">
              Reserved
            </p>
          </div>
        </motion.div>
      )}

      {/* Shooting stars */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 h-px bg-gradient-to-r from-transparent via-garden-cream to-transparent"
        animate={{
          x: ['0vw', '30vw'],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 8,
          ease: 'easeOut',
        }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-24 h-px bg-gradient-to-r from-transparent via-garden-amber to-transparent"
        animate={{
          x: ['0vw', '-20vw'],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatDelay: 10,
          delay: 3,
          ease: 'easeOut',
        }}
      />
    </div>
  );
}