// Custom easing functions for GSAP and CSS
// These create the soft, romantic garden aesthetic

// Cubic bezier approximations for custom easings
export const gardenEasings = {
  // Soft ease out - for elements entering
  softOut: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  
  // Soft ease in - for elements leaving
  softIn: 'cubic-bezier(0.4, 0, 1, 1)',
  
  // Gentle ease - for most transitions
  gentle: 'cubic-bezier(0.4, 0, 0.2, 1)',
  
  // Bounce-ish ease for playful elements
  bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  
  // Elegant ease for letter reveals
  elegant: 'cubic-bezier(0.22, 1, 0.36, 1)',
  
  // Romantic ease - very soft
  romantic: 'cubic-bezier(0.0, 0, 0.2, 1)',
  
  // Iris expand specific
  irisExpand: 'cubic-bezier(0.4, 0, 0, 1)',
  
  // Rose petal fall - slow and drifting
  petalFall: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  
  // Page turn - feels like turning a real page
  pageTurn: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
};

// GSAP Custom Easing Functions
export const customEases = {
  // Stepped reveal for typewriter effects
  stepReveal: 'steps(1)',
  
  // Expo out for dramatic reveals
  expoOut: 'expo.out',
  
  // Back out for bouncy elements
  backOut: 'back.out(1.7)',
  
  // Elastic for special moments
  elasticOut: 'elastic.out(1, 0.5)',
  
  // Power curves
  power1Out: 'power1.out',
  power2Out: 'power2.out',
  power3Out: 'power3.out',
  power4Out: 'power4.out',
  
  // Smooth sine-based easing for romantic feel
  sineOut: 'sine.out',
  sineInOut: 'sine.inOut',
  
  // Circ out for expanding effects
  circOut: 'circ.out',
};

// Duration constants in milliseconds
export const durations = {
  instant: 100,
  fast: 200,
  normal: 400,
  slow: 600,
  deliberate: 800,
  dramatic: 1200,
  extended: 2000,
  transition: 1500,
};

// Stagger presets for staggered animations
export const staggerPresets = {
  rapid: 0.02,
  fast: 0.05,
  normal: 0.08,
  slow: 0.12,
  deliberate: 0.15,
  dramatic: 0.25,
};

// Helper to get garden easing by name
export function getGardenEasing(name: keyof typeof gardenEasings): string {
  return gardenEasings[name] || gardenEasings.gentle;
}

// CSS transition string builder
export function buildCSSTransition(
  property: string = 'all',
  duration: number = durations.normal,
  easing: keyof typeof gardenEasings = 'gentle'
): string {
  return `${property} ${duration}ms ${gardenEasings[easing]}`;
}