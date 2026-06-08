'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import Image from 'next/image';
import { memories } from '@/data/memories';
import type { SceneProps } from '@/types/scene';

const springTransition = { type: 'spring', stiffness: 260, damping: 22 };

const memoriesWithPositions = memories.slice(0, 6).map((memory, index) => ({
  memory,
  position: {
    x: [-45, 38, -30, 42, -8, 25][index],
    y: [-32, -28, 22, 18, -12, 35][index],
    rotate: [-12, 8, -6, 10, -4, 6][index],
    depth: (['near', 'far', 'mid', 'far', 'near', 'mid'] as const)[index],
  },
}));

interface PolaroidCardProps {
  item: typeof memoriesWithPositions[0];
  isFlipped: boolean;
  onFlip: () => void;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  index: number;
  isMobile: boolean;
}

function PolaroidCard({ item, isFlipped, onFlip, scrollYProgress, index, isMobile }: PolaroidCardProps) {
  const { memory, position } = item;
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 100, damping: 20 });
  const springY = useSpring(y, { stiffness: 100, damping: 20 });
  
  const depthFactor = position.depth === 'near' ? 0.15 : position.depth === 'mid' ? 0.08 : 0.03;
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -80 * depthFactor]);
  
  const floatOffset = useMemo(() => Math.random() * Math.PI * 2, []);
  const cardSize = isMobile ? { width: 160, height: 200, photoH: 140 } : { width: 180, height: 224, photoH: 156 };

  const gradientColors = [
    ['#c41e3a', '#8b0000'],
    ['#1a2e1a', '#0d1f0d'],
    ['#c9a227', '#8b6914'],
    ['#e8d5a3', '#c4a35a'],
    ['#8b4513', '#5c2d0a'],
    ['#f4e4c1', '#d4c4a1'],
  ];
  const [gradStart, gradEnd] = gradientColors[index % gradientColors.length];

  return (
    <motion.div
      ref={constraintsRef}
      className={`absolute cursor-pointer ${isMobile ? '' : 'hidden md:block'}`}
      style={{
        x: isMobile ? 0 : springX,
        y: isMobile ? 0 : springY,
        zIndex: position.depth === 'near' ? 30 : position.depth === 'mid' ? 20 : 10,
      }}
      drag={!isMobile}
      dragConstraints={constraintsRef}
      dragElastic={0.15}
      onClick={onFlip}
      layout
      initial={{ opacity: 0, scale: 0, y: 0, x: 0 }}
      animate={{ opacity: 1, scale: 1, y: isMobile ? 0 : undefined }}
      transition={springTransition}
    >
      {/* 3D Perspective Card Wrap */}
      <motion.div
        className="relative"
        style={{
          width: cardSize.width,
          height: cardSize.height,
          perspective: '1200px',
          transformStyle: 'preserve-3d',
          rotate: isMobile ? 0 : position.rotate,
          y: isMobile ? 0 : parallaxY,
        }}
      >
        {/* Inner Card Container Executing Rotation */}
        <motion.div
          className="w-full h-full relative"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={springTransition}
        >
          {/* FRONT SIDE (Visible when rotateY is 0) */}
          <div 
            className="absolute inset-0 bg-white rounded-sm shadow-xl overflow-hidden backface-hidden"
            style={{ 
              WebkitBackfaceVisibility: 'hidden', 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)'
            }}
          >
            {/* Photo area */}
            <div className="w-full" style={{ height: cardSize.photoH, position: 'relative' }}>
              {imageError ? (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${gradStart} 0%, ${gradEnd} 100%)` }}
                >
                  <span className="font-script text-white/80 text-center px-4 text-sm">
                    {memory.title}
                  </span>
                </div>
              ) : (
                <Image
                  src={memory.image}
                  alt={memory.title}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                  onLoad={() => setImageLoaded(true)}
                  sizes="(max-width: 768px) 160px, 180px"
                />
              )}
            </div>
            
            {/* Caption below photo */}
            <div
              className="w-full flex items-center justify-center p-2 bg-white"
              style={{ height: cardSize.height - cardSize.photoH }}
            >
              <p className="font-script text-garden-charcoal text-xs text-center leading-tight">
                {memory.caption}
              </p>
            </div>
            
            {/* Polaroid border effect */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ boxShadow: 'inset 0 0 0 6px rgba(255,255,255,0.9)' }}
            />
          </div>

          {/* BACK SIDE (Visible when rotateY is 180) */}
          <div 
            className="absolute inset-0 rounded-sm shadow-xl overflow-hidden backface-hidden"
            style={{ 
              backgroundImage: `url('/textures/parchment.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              WebkitBackfaceVisibility: 'hidden', 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div className="absolute inset-0 opacity-[0.12] pointer-events-none mix-blend-overlay bg-[url('/textures/noise.jpg')] bg-[size:200px_200px] bg-repeat" />
            <div className="w-full h-full p-4 flex flex-col justify-between relative z-10 bg-gradient-to-b from-transparent via-white/5 to-white/20">
              <div>
                <p className="font-serif text-garden-amber text-xs font-semibold tracking-wider">
                  {memory.date}
                </p>
                <p className="font-script text-garden-charcoal/90 text-xs mt-2 leading-relaxed" style={{ fontSize: '11px' }}>
                  {memory.description}
                </p>
              </div>
              <p className="font-script text-garden-charcoal/40 text-[10px] text-center mt-auto">
                Tap to return
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Float animation for desktop */}
      {!isMobile && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 3 + index * 0.4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: floatOffset,
          }}
          style={{ display: 'none' }}
        />
      )}
    </motion.div>
  );
}

function MobilePolaroid({ item, isFlipped, onFlip }: { item: typeof memoriesWithPositions[0]; isFlipped: boolean; onFlip: () => void }) {
  const { memory } = item;
  const [imageError, setImageError] = useState(false);
  
  const gradientColors = [
    ['#c41e3a', '#8b0000'],
    ['#1a2e1a', '#0d1f0d'],
    ['#c9a227', '#8b6914'],
    ['#e8d5a3', '#c4a35a'],
    ['#8b4513', '#5c2d0a'],
    ['#f4e4c1', '#d4c4a1'],
  ];
  const [gradStart, gradEnd] = gradientColors[item.memory.id % gradientColors.length];

  return (
    <motion.div
      className="w-40 h-48 flex-shrink-0 cursor-pointer mx-2"
      onClick={onFlip}
      whileTap={{ scale: 0.96 }}
    >
      <div className="relative w-full h-full" style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}>
        <motion.div 
          className="w-full h-full relative"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={springTransition}
        >
          {/* Mobile Front */}
          <div 
            className="absolute inset-0 bg-white rounded-sm shadow-xl overflow-hidden backface-hidden"
            style={{ 
              WebkitBackfaceVisibility: 'hidden', 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)'
            }}
          >
            <div className="w-full h-[72%] relative">
              {imageError ? (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${gradStart} 0%, ${gradEnd} 100%)` }}
                >
                  <span className="font-script text-white/80 text-center px-4 text-sm">
                    {memory.title}
                  </span>
                </div>
              ) : (
                <Image
                  src={memory.image}
                  alt={memory.title}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                  sizes="160px"
                />
              )}
            </div>
            <div className="h-[28%] flex items-center justify-center p-2 bg-white">
              <p className="font-script text-garden-charcoal text-xs text-center leading-tight">
                {memory.caption}
              </p>
            </div>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ boxShadow: 'inset 0 0 0 6px rgba(255,255,255,0.9)' }}
            />
          </div>

          {/* Mobile Back */}
          <div 
            className="absolute inset-0 rounded-sm shadow-xl overflow-hidden backface-hidden"
            style={{ 
              backgroundImage: `url('/textures/parchment.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              WebkitBackfaceVisibility: 'hidden', 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div className="absolute inset-0 opacity-[0.12] pointer-events-none mix-blend-overlay bg-[url('/textures/noise.jpg')] bg-[size:200px_200px] bg-repeat" />
            <div className="w-full h-full p-3 flex flex-col justify-between relative z-10">
              <div>
                <p className="font-serif text-garden-amber text-xs font-semibold">
                  {memory.date}
                </p>
                <p className="font-script text-garden-charcoal/90 text-xs mt-1 leading-tight">
                  {memory.description}
                </p>
              </div>
              <p className="font-script text-garden-charcoal/50 text-[9px] text-center mt-auto">
                Tap to return
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function CarouselIndicator({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          className={`w-2 h-2 rounded-full ${i === current ? 'bg-garden-amber' : 'bg-garden-amber/30'}`}
          animate={{ scale: i === current ? 1.3 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />
      ))}
    </div>
  );
}

export default function Scene03_Memories({ isActive, onComplete }: SceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const polaroidsRef = useRef<HTMLDivElement>(null);
  const [flippedIds, setFlippedIds] = useState<Set<number>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showContinue, setShowContinue] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const { scrollYProgress } = useScroll();
  
  const viewedCountRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isActive || hasEntered) return;
    setHasEntered(true);
    
    timerRef.current = setTimeout(() => {
      if (!showContinue) setShowContinue(true);
    }, 15000);
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isActive, hasEntered, showContinue]);

  useEffect(() => {
    if (!isActive || !polaroidsRef.current) return;

    const polaroids = polaroidsRef.current.querySelectorAll('.polaroid-wrapper');
    polaroids.forEach((polaroid, i) => {
      const delay = i * 0.12;
      const angle = (i * 60 - 150) * (Math.PI / 180);
      const distance = 100 + i * 20;
      
      gsap.fromTo(
        polaroid,
        {
          scale: 0,
          opacity: 0,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance - 50,
          rotate: (Math.random() - 0.5) * 40,
        },
        {
          scale: 1,
          opacity: 1,
          x: 0,
          y: 0,
          duration: 1,
          delay,
          ease: 'back.out(1.4)',
        }
      );
    });
  }, [isActive]);

  const handleFlip = useCallback((id: number) => {
    setFlippedIds((prev) => {
      const next = new Set(prev);
      const isNewlyViewed = !prev.has(id);
      if (isNewlyViewed) {
        viewedCountRef.current += 1;
        if (viewedCountRef.current >= 3 && !showContinue) {
          setShowContinue(true);
        }
      }
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, [showContinue]);

  const handleNext = useCallback(() => {
    if (currentIndex < memoriesWithPositions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const handleContinue = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    if (polaroidsRef.current) {
      const polaroids = polaroidsRef.current.querySelectorAll('.polaroid-wrapper');
      gsap.to(polaroids, {
        scale: 0.3,
        opacity: 0,
        y: -30,
        stagger: 0.06,
        duration: 0.7,
        ease: 'power2.inOut',
        onComplete: () => {
          onComplete?.();
        },
      });
    } else {
      onComplete?.();
    }
  }, [isTransitioning, onComplete]);

  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
  };

  if (!isActive) return null;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-center bg-garden-dark overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-garden-charcoal/40 via-garden-dark to-garden-dark" />

      {/* Title */}
      <motion.h2
        className="font-display text-3xl md:text-5xl text-garden-parchment mb-4 md:mb-6 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        Treasured Memories
      </motion.h2>
      
      <motion.p
        className="font-script text-garden-parchment/60 text-sm md:text-base mb-4 md:mb-8 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Each photo holds a piece of our story
      </motion.p>

      {/* Desktop: Scattered polaroids */}
      {!isMobile && (
        <div
          ref={polaroidsRef}
          className="relative w-full h-[55vh] flex items-center justify-center"
        >
          {memoriesWithPositions.map((item, index) => (
            <div
              key={item.memory.id}
              className="polaroid-wrapper"
              style={{
                position: 'absolute',
                left: `calc(50% + ${item.position.x}vw - 90px)`,
                top: `calc(50% + ${item.position.y}vh - 112px)`,
              }}
            >
              <PolaroidCard
                item={item}
                isFlipped={flippedIds.has(item.memory.id)}
                onFlip={() => handleFlip(item.memory.id)}
                scrollYProgress={scrollYProgress}
                index={index}
                isMobile={false}
              />
            </div>
          ))}
        </div>
      )}

      {/* Mobile: Carousel */}
      {isMobile && (
        <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -100, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="polaroid-wrapper"
            >
              <MobilePolaroid
                item={memoriesWithPositions[currentIndex]}
                isFlipped={flippedIds.has(memoriesWithPositions[currentIndex].memory.id)}
                onFlip={() => handleFlip(memoriesWithPositions[currentIndex].memory.id)}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows */}
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="absolute left-2 w-10 h-10 rounded-full bg-garden-charcoal/60 backdrop-blur flex items-center justify-center disabled:opacity-30"
            aria-label="Previous photo"
          >
            <svg className="w-5 h-5 text-garden-parchment" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === memoriesWithPositions.length - 1}
            className="absolute right-2 w-10 h-10 rounded-full bg-garden-charcoal/60 backdrop-blur flex items-center justify-center disabled:opacity-30"
            aria-label="Next photo"
          >
            <svg className="w-5 h-5 text-garden-parchment" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Carousel indicator (mobile only) */}
      {isMobile && (
        <div className="mb-4">
          <CarouselIndicator total={memoriesWithPositions.length} current={currentIndex} />
        </div>
      )}

      {/* Tap hint */}
      <motion.p
        className="absolute bottom-28 left-1/2 -translate-x-1/2 font-script text-garden-parchment/40 text-xs text-center px-4"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        {isMobile ? 'Swipe to browse • Tap to flip' : 'Drag to arrange • Tap to flip'}
      </motion.p>

      {/* Continue button */}
      <AnimatePresence>
        {showContinue && (
          <motion.button
            onClick={handleContinue}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 px-8 py-3 bg-garden-amber/20 border border-garden-amber/50 rounded-full text-garden-parchment font-serif text-sm backdrop-blur-sm"
            style={{ zIndex: 50 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Continue the journey...
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-garden-amber/40"
            style={{ left: `${10 + i * 12}%` }}
            animate={{
              y: ['100vh', '-10vh'],
              opacity: [0, 0.6, 0],
              x: [0, Math.sin(i) * 30, 0],
            }}
            transition={{
              duration: 12 + Math.random() * 6,
              repeat: Infinity,
              delay: i * 1.2,
              ease: 'linear',
            }}
          />
        ))}
      </div>
    </div>
  );
}