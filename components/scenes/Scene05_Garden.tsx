'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import FlowerAsset from '@/components/shared/FlowerAsset';
import type { SceneProps } from '@/types/scene';

interface Flower {
  id: number;
  name: string;
  color: string;
  glowColor: string;
  x: string;
  y: string;
  scale: 'sm' | 'md' | 'lg';
  delay: number;
}

const flowers: Flower[] = [
  { id: 1, name: 'Rose', color: '#dc2626', glowColor: '#fca5a5', x: '15%', y: '65%', scale: 'md', delay: 0 },
  { id: 2, name: 'Sunflower', color: '#f59e0b', glowColor: '#fcd34d', x: '35%', y: '55%', scale: 'lg', delay: 0.3 },
  { id: 3, name: 'Peony', color: '#ec4899', glowColor: '#f9a8d4', x: '55%', y: '60%', scale: 'md', delay: 0.6 },
  { id: 4, name: 'Tulip', color: '#8b5cf6', glowColor: '#c4b5fd', x: '75%', y: '58%', scale: 'md', delay: 0.9 },
  { id: 5, name: 'Lily', color: '#f5f5dc', glowColor: '#fffbeb', x: '25%', y: '70%', scale: 'sm', delay: 1.2 },
  { id: 6, name: 'Baby Breath', color: '#ffffff', glowColor: '#f0fdf4', x: '65%', y: '68%', scale: 'sm', delay: 1.5 },
];

export default function Scene05_Garden({ isActive, onComplete }: SceneProps) {
  const [showMessage, setShowMessage] = useState(false);
  const [allBloomed, setAllBloomed] = useState(false);
  const flowerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;

    // Staggered entrance animation for flowers
    flowerRefs.current.forEach((ref, i) => {
      if (!ref) return;
      const flower = flowers[i];
      gsap.fromTo(
        ref,
        { y: 100, opacity: 0, scale: 0.3 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          delay: flower.delay,
          ease: 'back.out(1.7)',
        }
      );

      // Add swaying animation after entrance
      gsap.to(ref, {
        rotate: -5,
        duration: 2 + Math.random(),
        repeat: -1,
        yoyo: true,
        delay: flower.delay + 1,
        ease: 'sine.inOut',
      });
    });

    // Mark all bloomed after animation
    const bloomTimer = setTimeout(() => {
      setAllBloomed(true);
    }, 3000);

    // Show message after flowers bloom
    const messageTimer = setTimeout(() => {
      setShowMessage(true);
    }, 7000);

    // Auto-progress after message fades
    const progressTimer = setTimeout(() => {
      onComplete?.();
    }, 15000);

    return () => {
      clearTimeout(bloomTimer);
      clearTimeout(messageTimer);
      clearTimeout(progressTimer);
    };
  }, [isActive, onComplete]);

  useEffect(() => {
    if (showMessage && messageRef.current) {
      gsap.fromTo(
        messageRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
      );
      gsap.to(messageRef.current, {
        opacity: 0,
        duration: 1.5,
        delay: 2.5,
        ease: 'power2.in',
      });
    }
  }, [showMessage]);

  if (!isActive) return null;

  return (
    <div className="relative w-full h-full overflow-hidden bg-garden-dark">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-garden-charcoal via-garden-dark to-garden-green-deep/30" />

      {/* Soil/ground at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-garden-green-deep/40 to-transparent" />

      {/* Soft warm light from above */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1/2 opacity-20"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(253,230,138,0.4) 0%, transparent 70%)',
        }}
      />

      {/* Starlight/pollen particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-garden-amber/60"
            style={{ left: `${Math.random() * 100}%` }}
            animate={{
              y: ['-10%', '110%'],
              opacity: [0, 0.6, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 8 + Math.random() * 6,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Flowers */}
      <div className="absolute inset-0">
        {flowers.map((flower, index) => (
          <motion.div
            key={flower.id}
            ref={(el) => { flowerRefs.current[index] = el; }}
            className="absolute"
            style={{
              left: flower.x,
              top: flower.y,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <FlowerAsset
              src=""
              alt={flower.name}
              glowColor={flower.glowColor}
              size={flower.scale}
            />
            {/* Flower stem hint */}
            <div
              className="absolute left-1/2 -translate-x-1/2 bottom-0 w-1 bg-garden-green-deep rounded-full"
              style={{ height: '40px' }}
            />
          </motion.div>
        ))}
      </div>

      {/* Falling petals */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`petal-${i}`}
            className="absolute w-3 h-3 rounded-full opacity-70"
            style={{
              background: flowers[i % flowers.length].color,
              left: `${5 + i * 6}%`,
            }}
            initial={{ y: '-10%', x: 0, rotate: 0 }}
            animate={{
              y: '110%',
              x: [0, 20, -20, 10],
              rotate: [0, 180, 360],
              opacity: [0.8, 0.8, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: i * 1.2,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Garden message */}
      {showMessage && (
        <motion.div
          ref={messageRef}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center"
        >
          <p className="font-serif text-garden-parchment/80 text-xl md:text-2xl italic">
            Our garden grows...
          </p>
        </motion.div>
      )}

      {/* Continue hint when all bloomed */}
      {allBloomed && !showMessage && (
        <motion.div
          className="absolute bottom-16 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="font-serif text-garden-parchment/40 text-sm animate-pulse">
            Watch the garden bloom...
          </p>
        </motion.div>
      )}
    </div>
  );
}