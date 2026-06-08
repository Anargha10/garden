'use client';

import { useRef, useCallback, useEffect } from 'react';
import { gsap } from 'gsap';
import { TransitionType, TransitionConfig } from '@/types/transitions';
import { gardenEasings } from '@/lib/easing';

// Rose petal element for the rose-petal-dissolve effect
interface RosePetal {
  id: number;
  x: number;
  rotation: number;
  scale: number;
  delay: number;
}

function generatePetals(count: number = 15): RosePetal[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    rotation: Math.random() * 360,
    scale: 0.5 + Math.random() * 0.5,
    delay: Math.random() * 0.5,
  }));
}

interface TransitionEngineResult {
  play: () => Promise<void>;
  reverse: () => Promise<void>;
  kill: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function useTransitionEngine(
  type: TransitionType,
  config: TransitionConfig
): TransitionEngineResult {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const petalsRef = useRef<RosePetal[]>([]);

  const kill = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }
    // Clean up any leftover petal elements
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }
  }, []);

  const play = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      kill();

      const container = containerRef.current;
      if (!container) {
        resolve();
        return;
      }

      const duration = config.duration / 1000;
      const tl = gsap.timeline({
        onComplete: resolve,
      });

      timelineRef.current = tl;

      switch (type) {
        case 'iris-expand':
          tl.fromTo(
            container,
            {
              clipPath: 'circle(0% at 50% 50%)',
            },
            {
              clipPath: 'circle(150% at 50% 50%)',
              duration,
              ease: gardenEasings.irisExpand,
            }
          );
          break;

        case 'dissolve-up':
          tl.fromTo(
            container,
            {
              opacity: 0,
              y: 20,
              filter: 'blur(4px)',
            },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration,
              ease: gardenEasings.softOut,
            }
          );
          break;

        case 'page-turn-3d':
          tl.fromTo(
            container,
            {
              rotateY: 0,
              transformPerspective: 1000,
              transformOrigin: 'left center',
            },
            {
              rotateY: -180,
              duration,
              ease: gardenEasings.pageTurn,
            }
          );
          break;

        case 'rose-petal-dissolve':
          // Create petal container if it doesn't exist
          let petalContainer = container.querySelector('.petal-container');
          if (!petalContainer) {
            petalContainer = document.createElement('div');
            petalContainer.className = 'petal-container fixed inset-0 pointer-events-none z-50 overflow-hidden';
            container.appendChild(petalContainer);
          }

          // Generate petals
          petalsRef.current = generatePetals(20);

          // Animate the main content fading
          tl.fromTo(
            container,
            { opacity: 1 },
            {
              opacity: 0,
              duration: duration * 0.6,
              ease: gardenEasings.petalFall,
            }
          );

          // Create falling petals
          petalsRef.current.forEach((petal) => {
            const petalEl = document.createElement('div');
            petalEl.className = 'rose-petal absolute w-4 h-6 bg-garden-crimson rounded-full opacity-80';
            petalEl.style.left = `${petal.x}%`;
            petalEl.style.top = '-20px';
            petalEl.style.transform = `rotate(${petal.rotation}deg) scale(${petal.scale})`;
            petalContainer.appendChild(petalEl);

            tl.to(
              petalEl,
              {
                y: '110vh',
                x: petal.x + (Math.random() - 0.5) * 100,
                rotation: petal.rotation + 720,
                opacity: 0,
                duration: duration * (0.8 + Math.random() * 0.4),
                ease: gardenEasings.petalFall,
              },
              petal.delay
            );
          });
          break;

        case 'fade':
          tl.fromTo(
            container,
            { opacity: 0 },
            {
              opacity: 1,
              duration,
              ease: gardenEasings.softOut,
            }
          );
          break;

        case 'fold-into-book':
          tl.fromTo(
            container,
            {
              scale: 1,
              opacity: 1,
              rotateX: 0,
              rotateY: 0,
              y: 0,
            },
            {
              scale: 0.3,
              opacity: 0,
              rotateX: -15,
              rotateY: 10,
              y: 0,
              duration,
              ease: gardenEasings.pageTurn,
            }
          );
          break;

        case 'sink-to-soil':
          // Create rising garden elements
          let riseContainer = container.querySelector('.rise-container');
          if (!riseContainer) {
            riseContainer = document.createElement('div');
            riseContainer.className = 'rise-container fixed inset-0 pointer-events-none z-50 overflow-hidden';
            container.appendChild(riseContainer);
          }

          // Animate container sinking
          tl.fromTo(
            container,
            {
              y: 0,
              scale: 1,
              opacity: 1,
            },
            {
              y: 150,
              scale: 0.85,
              opacity: 0,
              duration,
              ease: gardenEasings.softIn,
            }
          );

          // Create rising garden elements (leaves, petals)
          for (let i = 0; i < 12; i++) {
            const leafEl = document.createElement('div');
            const isLeaf = Math.random() > 0.5;
            leafEl.className = isLeaf
              ? 'garden-rise absolute w-6 h-4 bg-garden-green-deep rounded-full opacity-80'
              : 'garden-rise absolute w-4 h-6 bg-garden-crimson rounded-full opacity-80';
            leafEl.style.left = `${Math.random() * 100}%`;
            leafEl.style.bottom = '-40px';
            leafEl.style.transform = `rotate(${Math.random() * 360}deg)`;
            riseContainer.appendChild(leafEl);

            tl.to(
              leafEl,
              {
                y: -window.innerHeight - 100,
                x: (Math.random() - 0.5) * 80,
                rotation: Math.random() * 720 - 360,
                opacity: 0,
                duration: duration * (0.6 + Math.random() * 0.3),
                ease: gardenEasings.softOut,
              },
              i * 0.05
            );
          }
          break;

        case 'none':
          // No animation
          gsap.set(container, { opacity: 1 });
          break;

        default:
          tl.fromTo(
            container,
            { opacity: 0 },
            {
              opacity: 1,
              duration,
              ease: gardenEasings.softOut,
            }
          );
      }
    });
  }, [type, config.duration, kill]);

  const reverse = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      kill();

      const container = containerRef.current;
      if (!container) {
        resolve();
        return;
      }

      const duration = config.duration / 1000;
      const tl = gsap.timeline({
        onComplete: resolve,
      });

      timelineRef.current = tl;

      switch (type) {
        case 'iris-expand':
          tl.fromTo(
            container,
            {
              clipPath: 'circle(150% at 50% 50%)',
            },
            {
              clipPath: 'circle(0% at 50% 50%)',
              duration,
              ease: gardenEasings.softIn,
            }
          );
          break;

        case 'dissolve-up':
          tl.fromTo(
            container,
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
            },
            {
              opacity: 0,
              y: -20,
              filter: 'blur(4px)',
              duration,
              ease: gardenEasings.softIn,
            }
          );
          break;

        case 'page-turn-3d':
          tl.fromTo(
            container,
            {
              rotateY: -180,
              transformPerspective: 1000,
              transformOrigin: 'left center',
            },
            {
              rotateY: 0,
              duration,
              ease: gardenEasings.pageTurn,
            }
          );
          break;

        case 'rose-petal-dissolve':
          tl.fromTo(
            container,
            { opacity: 0 },
            {
              opacity: 1,
              duration: duration * 0.6,
              ease: gardenEasings.softOut,
            }
          );
          break;

        case 'fold-into-book':
          tl.fromTo(
            container,
            {
              scale: 0.3,
              opacity: 0,
              rotateX: -15,
              rotateY: 10,
            },
            {
              scale: 1,
              opacity: 1,
              rotateX: 0,
              rotateY: 0,
              duration,
              ease: gardenEasings.softOut,
            }
          );
          break;

        case 'sink-to-soil':
          tl.fromTo(
            container,
            {
              y: 150,
              scale: 0.85,
              opacity: 0,
            },
            {
              y: 0,
              scale: 1,
              opacity: 1,
              duration,
              ease: gardenEasings.softOut,
            }
          );
          break;

        case 'fade':
          tl.fromTo(
            container,
            { opacity: 1 },
            {
              opacity: 0,
              duration,
              ease: gardenEasings.softIn,
            }
          );
          break;

        case 'none':
        default:
          gsap.set(container, { opacity: 0 });
          break;
      }
    });
  }, [type, config.duration, kill]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      kill();
    };
  }, [kill]);

  return {
    play,
    reverse,
    kill,
    containerRef,
  };
}

// Static transition helpers for programmatic use
export const TransitionEngine = {
  async irisExpand(container: HTMLElement, duration: number = 1200): Promise<void> {
    return new Promise((resolve) => {
      gsap.fromTo(
        container,
        { clipPath: 'circle(0% at 50% 50%)' },
        {
          clipPath: 'circle(150% at 50% 50%)',
          duration: duration / 1000,
          ease: gardenEasings.irisExpand,
          onComplete: resolve,
        }
      );
    });
  },

  async dissolveUp(container: HTMLElement, duration: number = 800): Promise<void> {
    return new Promise((resolve) => {
      gsap.fromTo(
        container,
        { opacity: 0, y: 20, filter: 'blur(4px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: duration / 1000,
          ease: gardenEasings.softOut,
          onComplete: resolve,
        }
      );
    });
  },

  async pageTurn3D(container: HTMLElement, duration: number = 1500): Promise<void> {
    return new Promise((resolve) => {
      gsap.fromTo(
        container,
        { rotateY: 0, transformPerspective: 1000, transformOrigin: 'left center' },
        {
          rotateY: -180,
          duration: duration / 1000,
          ease: gardenEasings.pageTurn,
          onComplete: resolve,
        }
      );
    });
  },

  async rosePetalDissolve(container: HTMLElement, duration: number = 2000): Promise<void> {
    return new Promise((resolve) => {
      const petalContainer = document.createElement('div');
      petalContainer.className = 'petal-container fixed inset-0 pointer-events-none z-50 overflow-hidden';
      document.body.appendChild(petalContainer);

      const petals = generatePetals(20);

      gsap.to(container, {
        opacity: 0,
        duration: (duration * 0.6) / 1000,
        ease: gardenEasings.petalFall,
      });

      petals.forEach((petal) => {
        const petalEl = document.createElement('div');
        petalEl.className = 'rose-petal absolute w-4 h-6 bg-garden-crimson rounded-full opacity-80';
        petalEl.style.left = `${petal.x}%`;
        petalEl.style.top = '-20px';
        petalEl.style.transform = `rotate(${petal.rotation}deg) scale(${petal.scale})`;
        petalContainer.appendChild(petalEl);

        gsap.to(petalEl, {
          y: '110vh',
          x: petal.x + (Math.random() - 0.5) * 100,
          rotation: petal.rotation + 720,
          opacity: 0,
          duration: (duration * (0.8 + Math.random() * 0.4)) / 1000,
          ease: gardenEasings.petalFall,
          delay: petal.delay,
        });
      });

      setTimeout(() => {
        petalContainer.remove();
        resolve();
      }, duration);
    });
  },

  async fade(container: HTMLElement, duration: number = 600): Promise<void> {
    return new Promise((resolve) => {
      gsap.fromTo(
        container,
        { opacity: 0 },
        {
          opacity: 1,
          duration: duration / 1000,
          ease: gardenEasings.softOut,
          onComplete: resolve,
        }
      );
    });
  },

  async foldIntoBook(container: HTMLElement, duration: number = 1500): Promise<void> {
    return new Promise((resolve) => {
      gsap.fromTo(
        container,
        {
          scale: 1,
          opacity: 1,
          rotateX: 0,
          rotateY: 0,
        },
        {
          scale: 0.3,
          opacity: 0,
          rotateX: -15,
          rotateY: 10,
          duration: duration / 1000,
          ease: gardenEasings.pageTurn,
          onComplete: resolve,
        }
      );
    });
  },

  async sinkToSoil(container: HTMLElement, duration: number = 2000): Promise<void> {
    return new Promise((resolve) => {
      const riseContainer = document.createElement('div');
      riseContainer.className = 'rise-container fixed inset-0 pointer-events-none z-50 overflow-hidden';
      document.body.appendChild(riseContainer);

      gsap.fromTo(
        container,
        { y: 0, scale: 1, opacity: 1 },
        {
          y: 150,
          scale: 0.85,
          opacity: 0,
          duration: duration / 1000,
          ease: gardenEasings.softIn,
        }
      );

      for (let i = 0; i < 12; i++) {
        const leafEl = document.createElement('div');
        const isLeaf = Math.random() > 0.5;
        leafEl.className = isLeaf
          ? 'garden-rise absolute w-6 h-4 bg-garden-green-deep rounded-full opacity-80'
          : 'garden-rise absolute w-4 h-6 bg-garden-crimson rounded-full opacity-80';
        leafEl.style.left = `${Math.random() * 100}%`;
        leafEl.style.bottom = '-40px';
        leafEl.style.transform = `rotate(${Math.random() * 360}deg)`;
        riseContainer.appendChild(leafEl);

        gsap.to(leafEl, {
          y: -window.innerHeight - 100,
          x: (Math.random() - 0.5) * 80,
          rotation: Math.random() * 720 - 360,
          opacity: 0,
          duration: (duration * (0.6 + Math.random() * 0.3)) / 1000,
          ease: gardenEasings.softOut,
          delay: i * 0.05,
        });
      }

      setTimeout(() => {
        riseContainer.remove();
        resolve();
      }, duration);
    });
  },
};