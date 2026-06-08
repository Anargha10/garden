import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

// Register GSAP plugins
// Using standard plugins only as specified
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
  
  // Set GSAP defaults for garden aesthetic
  gsap.defaults({
    ease: 'power2.out',
    duration: 0.8,
  });
}

// Export gsap instance for use throughout the app
export { gsap };

// Animation presets for common garden transitions
export const gardenPresets = {
  fadeIn: {
    opacity: 0,
    duration: 1,
    ease: 'power2.out',
  },
  fadeOut: {
    opacity: 0,
    duration: 0.8,
    ease: 'power2.in',
  },
  riseIn: {
    opacity: 0,
    y: 30,
    duration: 1,
    ease: 'power3.out',
  },
  scaleIn: {
    opacity: 0,
    scale: 0.9,
    duration: 0.8,
    ease: 'back.out(1.7)',
  },
  letterReveal: {
    opacity: 0,
    y: 20,
    duration: 0.6,
    stagger: 0.03,
    ease: 'power2.out',
  },
};

// Helper to create a timeline with onComplete promise
export function createTimeline(onComplete?: () => void): gsap.core.Timeline {
  return gsap.timeline({
    onComplete,
  });
}

// Helper for simple fade animations
export function fadeElement(
  element: gsap.TweenTarget,
  options: { to?: number; duration?: number; ease?: string } = {}
): gsap.core.Tween {
  const { to = 1, duration = 0.6, ease = 'power2.out' } = options;
  return gsap.to(element, {
    opacity: to,
    duration,
    ease,
  });
}

// Kill all tweens and timelines for an element
export function killAnimations(element: HTMLElement | Element): void {
  gsap.killTweensOf(element);
}