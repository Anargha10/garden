'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import type { SceneProps } from '@/types/scene';

interface LoveTrait {
  id: number;
  text: string;
  description: string;
}

const loveTraits: LoveTrait[] = [
  {
    id: 1,
    text: 'The way you laugh',
    description: 'Your laughter is sunlight breaking through clouds.',
  },
  {
    id: 2,
    text: 'The way you care for me',
    description: 'In your hands, I find the meaning of being held.',
  },
  {
    id: 3,
    text: 'The way you stay',
    description: 'You are the constant I never knew I needed.',
  },
  {
    id: 4,
    text: 'The way you forgive me',
    description: 'Your forgiveness taught me how to love without fear.',
  },
  {
    id: 5,
    text: 'The way you understand me',
    description: 'You see the parts of me I\'ve never shown anyone.',
  },
  {
    id: 6,
    text: 'The way you make ordinary days beautiful',
    description: 'With you, even silence sounds like music.',
  },
];

function AnimatedHeart({ isRevealed }: { isRevealed: boolean }) {
  const pathRef = useRef<SVGPathElement>(null);

  return (
    <svg className="w-6 h-6 md:w-8 md:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <motion.path
        ref={pathRef}
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        initial={{ pathLength: 0, fill: 'none' }}
        animate={{
          pathLength: isRevealed ? 1 : 0,
          fill: isRevealed ? 'currentColor' : 'none',
        }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ color: '#c9a227' }}
      />
    </svg>
  );
}

function HeartIllustration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-8">
      <svg viewBox="0 0 200 200" className="w-full max-w-[280px] h-auto" fill="none">
        <motion.path
          d="M100 180 C60 140, 20 100, 20 60 C20 30, 45 10, 70 10 C85 10, 95 20, 100 35 C105 20, 115 10, 130 10 C155 10, 180 30, 180 60 C180 100, 140 140, 100 180Z"
          stroke="#c9a227"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: 'easeOut' }}
        />
        <motion.path
          d="M30 50 C20 40, 15 30, 25 25 C35 20, 40 30, 35 40"
          stroke="#c9a227"
          strokeWidth="1.5"
          fill="none"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        />
        <motion.path
          d="M170 50 C180 40, 185 30, 175 25 C165 20, 160 30, 165 40"
          stroke="#c9a227"
          strokeWidth="1.5"
          fill="none"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={{ delay: 0.7, duration: 1 }}
        />
        <motion.path
          d="M60 140 Q40 160, 50 180 Q60 190, 55 175"
          stroke="#c9a227"
          strokeWidth="1"
          fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1.2 }}
        />
        <motion.path
          d="M140 140 Q160 160, 150 180 Q140 190, 145 175"
          stroke="#c9a227"
          strokeWidth="1"
          fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1.4 }}
        />
        <motion.circle cx="50" cy="80" r="8" stroke="#c9a227" strokeWidth="1" fill="none" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.5, scale: 1 }} transition={{ delay: 1.6 }} />
        <motion.circle cx="150" cy="80" r="8" stroke="#c9a227" strokeWidth="1" fill="none" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.5, scale: 1 }} transition={{ delay: 1.8 }} />
        <motion.circle cx="100" cy="45" r="6" stroke="#c9a227" strokeWidth="1" fill="none" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.5, scale: 1 }} transition={{ delay: 2 }} />
      </svg>
    </div>
  );
}

function LoveTraitCard({
  trait,
  index,
  isRevealed,
  onReveal,
}: {
  trait: LoveTrait;
  index: number;
  isRevealed: boolean;
  onReveal: () => void;
}) {
  const foilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isRevealed && foilRef.current) {
      gsap.to(foilRef.current, {
        clipPath: 'inset(0 100% 0 0)',
        duration: 0.8,
        ease: 'power2.out',
      });
    }
  }, [isRevealed]);

  return (
    <motion.div
      className="relative flex items-start gap-3 p-4 bg-garden-charcoal/30 rounded-lg border border-garden-amber/20 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      viewport={{ once: false, margin: '-20%' }}
      onClick={onReveal}
    >
      {/* Gold foil overlay */}
      <div
        ref={foilRef}
        className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg"
        style={{ clipPath: 'inset(0 0 0 0)' }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #f4a900 0%, #c9a227 25%, #f4a900 50%, #c9a227 75%, #f4a900 100%)',
            backgroundSize: '200% 200%',
            animation: 'shimmer 3s ease-in-out infinite',
          }}
        />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: 'radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.5) 0%, transparent 50%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-start gap-3">
        <AnimatedHeart isRevealed={isRevealed} />
        <div>
          <h3
            className={`font-serif text-lg md:text-xl transition-colors duration-500 ${
              isRevealed ? 'text-garden-parchment' : 'text-garden-charcoal/50'
            }`}
          >
            {trait.text}
          </h3>
          {isRevealed && (
            <motion.p
              className="font-serif text-garden-parchment/60 text-sm mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {trait.description}
            </motion.p>
          )}
        </div>
      </div>

      {!isRevealed && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-garden-charcoal/30 font-serif text-xs">Tap to reveal</span>
        </div>
      )}
    </motion.div>
  );
}

export default function Scene04_LoveList({ isActive, onComplete }: SceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const [revealedIds, setRevealedIds] = useState<Set<number>>(new Set());
  const [allRevealed, setAllRevealed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { scrollYProgress } = useScroll();

  const bookY = useTransform(scrollYProgress, [0, 0.7], [0, 50]);
  const bookScale = useTransform(scrollYProgress, [0, 0.7], [1, 0.95]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isActive || !bookRef.current) return;
    gsap.fromTo(
      bookRef.current,
      { y: 30, scale: 0.95 },
      { y: 0, scale: 1, duration: 1, ease: 'power3.out' }
    );
  }, [isActive]);

  const handleReveal = useCallback((id: number) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      if (next.size === loveTraits.length) {
        setAllRevealed(true);
      }
      return next;
    });
  }, []);

  const handleContinue = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    if (bookRef.current) {
      gsap.to(bookRef.current, {
        y: 150,
        scale: 0.85,
        opacity: 0,
        duration: 1.2,
        ease: 'power2.in',
        onComplete: () => {
          onComplete?.();
        },
      });

      const riseContainer = document.createElement('div');
      riseContainer.className = 'fixed inset-0 pointer-events-none z-50 overflow-hidden';
      document.body.appendChild(riseContainer);

      for (let i = 0; i < 12; i++) {
        const leafEl = document.createElement('div');
        const isLeaf = Math.random() > 0.5;
        leafEl.className = isLeaf
          ? 'absolute w-6 h-4 bg-green-700 rounded-full opacity-80'
          : 'absolute w-4 h-6 bg-red-700 rounded-full opacity-80';
        leafEl.style.left = `${Math.random() * 100}%`;
        leafEl.style.bottom = '-40px';
        leafEl.style.transform = `rotate(${Math.random() * 360}deg)`;
        riseContainer.appendChild(leafEl);

        gsap.to(leafEl, {
          y: -window.innerHeight - 100,
          x: (Math.random() - 0.5) * 80,
          rotation: Math.random() * 720 - 360,
          opacity: 0,
          duration: 1.5,
          ease: 'power2.out',
          delay: i * 0.05,
        });
      }

      setTimeout(() => riseContainer.remove(), 2000);
    } else {
      onComplete?.();
    }
  }, [isTransitioning, onComplete]);

  if (!isActive) return null;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center bg-garden-dark overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-radial from-garden-charcoal/60 via-garden-dark to-garden-dark" />

      <motion.div
        ref={bookRef}
        className="relative w-[95vw] max-w-5xl h-[85vh] rounded-lg shadow-2xl overflow-hidden"
        style={{
          backgroundImage: `url('/textures/parchment.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          y: bookY,
          scale: bookScale,
          boxShadow: '0 25px 60px rgba(0,0,0,0.5), inset 0 0 80px rgba(201,162,39,0.1)',
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.12] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url('/textures/noise.jpg')`,
            backgroundSize: '200px 200px',
            backgroundRepeat: 'repeat',
          }}
        />
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-garden-amber/40 via-garden-amber/20 to-garden-amber/40" />

        <div className={`hidden md:grid h-full ${isMobile ? '' : 'grid-cols-2'}`}>
          <div className="relative border-r border-garden-amber/20">
            <HeartIllustration />
            <div className="absolute bottom-8 left-8 right-8 text-center">
              <p className="font-script text-garden-charcoal/60 text-lg">
                All the flowers of love...
              </p>
            </div>
          </div>
          <div className="relative p-6 md:p-10 overflow-y-auto">
            <h2 className="font-display text-3xl md:text-4xl text-garden-charcoal mb-8 text-center">
              Things I Love About You
            </h2>
            <div className="space-y-4">
              {loveTraits.map((trait, index) => (
                <LoveTraitCard
                  key={trait.id}
                  trait={trait}
                  index={index}
                  isRevealed={revealedIds.has(trait.id)}
                  onReveal={() => handleReveal(trait.id)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="md:hidden h-full flex flex-col p-6">
          <h2 className="font-display text-2xl text-garden-charcoal mb-6 text-center">
            Things I Love About You
          </h2>
          <div className="flex-1 overflow-y-auto space-y-4 pb-20">
            {loveTraits.map((trait, index) => (
              <LoveTraitCard
                key={trait.id}
                trait={trait}
                index={index}
                isRevealed={revealedIds.has(trait.id)}
                onReveal={() => handleReveal(trait.id)}
              />
            ))}
          </div>
        </div>

        {allRevealed && (
          <motion.button
            onClick={handleContinue}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 px-8 py-3 bg-garden-charcoal text-garden-parchment rounded-full font-serif shadow-lg"
            style={{ zIndex: 50 }}
          >
            Continue the journey...
          </motion.button>
        )}
      </motion.div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-garden-amber/25"
            style={{ left: `${10 + i * 12}%` }}
            animate={{
              y: ['100vh', '-20%'],
              opacity: [0, 0.4, 0],
            }}
            transition={{
              duration: 12 + Math.random() * 5,
              repeat: Infinity,
              delay: i * 1.5,
              ease: 'linear',
            }}
          />
        ))}
      </div>
    </div>
  );
}
