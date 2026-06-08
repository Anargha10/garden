'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

interface InkRevealProps {
  text: string;
  speed?: number;
  delay?: number;
  startOnMount?: boolean;
  onComplete?: () => void;
  className?: string;
  tag?: 'p' | 'h1' | 'h2' | 'h3' | 'span' | 'div';
  showCursor?: boolean;
}

export default function InkReveal({
  text,
  speed = 30,
  delay = 0,
  startOnMount = true,
  onComplete,
  className = '',
  tag: Tag = 'p',
  showCursor = true,
}: InkRevealProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const hasStartedRef = useRef(false);

  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!startOnMount) return;
    if (hasStartedRef.current) return;

    hasStartedRef.current = true;

    let interval: NodeJS.Timeout | null = null;

    const startTimer = setTimeout(() => {
      let currentIndex = 0;

      interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          if (interval) {
            clearInterval(interval);
          }

          setDisplayedText(text);
          setIsComplete(true);

          onCompleteRef.current?.();
        }
      }, 1000 / speed);
    }, delay);

    return () => {
      clearTimeout(startTimer);

      if (interval) {
        clearInterval(interval);
      }
    };
  }, [text, speed, delay, startOnMount]);

  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    hasStartedRef.current = false;
  }, [text]);

  return (
    <div
      ref={containerRef}
      className={`ink-reveal-container ${className}`}
    >
      <Tag className="inline">
        {displayedText}

        {showCursor && !isComplete && (
          <motion.span
            className="inline-block w-[2px] h-[1em] bg-garden-amber ml-1 align-middle"
            animate={{
              opacity: [1, 0, 1],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
            }}
          />
        )}
      </Tag>
    </div>
  );
}

/* ============================================================
   Character Reveal Variant
============================================================ */

interface InkRevealCharsProps {
  text: string;
  delay?: number;
  staggerDelay?: number;
  onComplete?: () => void;
  className?: string;
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'span' | 'div';
}

export function InkRevealChars({
  text,
  delay = 0,
  staggerDelay = 0.05,
  className = '',
  as: Tag = 'p',
}: InkRevealCharsProps) {
  const characters = text.split('');

  return (
    <Tag className={className}>
      {characters.map((char, index) => (
        <motion.span
          key={index}
          className="inline-block"
          initial={{
            opacity: 0,
            filter: 'blur(4px)',
            y: 5,
          }}
          animate={{
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
          }}
          transition={{
            duration: 0.4,
            delay: delay + index * staggerDelay,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </Tag>
  );
}

/* ============================================================
   GSAP Reveal Hook
============================================================ */

interface InkRevealGSAPOptions {
  text: string;
  containerRef: React.RefObject<HTMLElement | null>;
  speed?: number;
  onComplete?: () => void;
}

type SpanElement = HTMLSpanElement;

export function useInkRevealGSAP({
  text,
  containerRef,
  speed = 30,
  onComplete,
}: InkRevealGSAPOptions) {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const play = useCallback(() => {
    if (!containerRef.current) return;

    const chars = text.split('');

    containerRef.current.innerHTML = chars
      .map(
        (char) =>
          `<span class="ink-char">${
            char === ' ' ? '&nbsp;' : char
          }</span>`
      )
      .join('');

    const charElements = Array.from(
      containerRef.current.querySelectorAll('.ink-char')
    ) as SpanElement[];

    gsap.set(charElements, {
      opacity: 0,
      filter: 'blur(4px)',
      y: 5,
    });

    timelineRef.current?.kill();

    const tl = gsap.timeline({
      onComplete: () => {
        onComplete?.();
      },
    });

    timelineRef.current = tl;

    tl.to(charElements, {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      duration: 0.3,
      stagger: 1 / speed,
      ease: 'power2.out',
    });
  }, [text, containerRef, speed, onComplete]);

  const kill = useCallback(() => {
    timelineRef.current?.kill();
    timelineRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      kill();
    };
  }, [kill]);

  return {
    play,
    kill,
  };
}