'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface FlowerAssetProps {
  src: string;
  alt: string;
  glowColor: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: { width: 80, height: 100 },
  md: { width: 120, height: 150 },
  lg: { width: 180, height: 225 },
};

function CSSFlowerFallback({ alt, glowColor, size = 'md' }: Omit<FlowerAssetProps, 'src'>) {
  const dimensions = sizeMap[size];
  const gradientId = `flower-gradient-${Math.random().toString(36).slice(2, 8)}`;
  
  return (
    <svg
      width={dimensions.width}
      height={dimensions.height}
      viewBox="0 0 100 125"
      className="drop-shadow-lg"
    >
      <defs>
        <radialGradient id={`${gradientId}-center`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={glowColor} stopOpacity="1" />
          <stop offset="70%" stopColor={glowColor} stopOpacity="0.6" />
          <stop offset="100%" stopColor={glowColor} stopOpacity="0.2" />
        </radialGradient>
        <radialGradient id={`${gradientId}-petal`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={glowColor} stopOpacity="0.9" />
          <stop offset="100%" stopColor={glowColor} stopOpacity="0.4" />
        </radialGradient>
        <filter id={`${gradientId}-glow`}>
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {/* Petals - 8 petals arranged in a circle */}
      {[...Array(8)].map((_, i) => {
        const angle = (i * 45 - 90) * (Math.PI / 180);
        const petalLength = size === 'lg' ? 35 : size === 'md' ? 28 : 20;
        const petalWidth = size === 'lg' ? 18 : size === 'md' ? 14 : 10;
        const cx = 50 + Math.cos(angle) * petalLength * 0.5;
        const cy = 50 + Math.sin(angle) * petalLength * 0.5;
        const tx = cx + Math.cos(angle) * petalLength;
        const ty = cy + Math.sin(angle) * petalLength;
        
        return (
          <ellipse
            key={i}
            cx={(cx + tx) / 2}
            cy={(cy + ty) / 2}
            rx={petalWidth}
            ry={petalLength * 0.6}
            fill={`url(#${gradientId}-petal)`}
            transform={`rotate(${i * 45} 50 50)`}
            filter={`url(#${gradientId}-glow)`}
          />
        );
      })}
      
      {/* Center */}
      <circle
        cx="50"
        cy="50"
        r={size === 'lg' ? 12 : size === 'md' ? 9 : 6}
        fill={`url(#${gradientId}-center)`}
        filter={`url(#${gradientId}-glow)`}
      />
      
      {/* Inner details */}
      <circle
        cx="50"
        cy="50"
        r={(size === 'lg' ? 12 : size === 'md' ? 9 : 6) * 0.5}
        fill={glowColor}
        opacity="0.8"
      />
    </svg>
  );
}

export default function FlowerAsset({ src, alt, glowColor, size = 'md', className = '' }: FlowerAssetProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const dimensions = sizeMap[size];

  if (imageError || !src) {
    return (
      <div className={`relative ${className}`}>
        <CSSFlowerFallback alt={alt} glowColor={glowColor} size={size} />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width: dimensions.width, height: dimensions.height }}>
      {/* Glow effect behind flower */}
      <div
        className="absolute inset-0 rounded-full blur-xl opacity-40"
        style={{ backgroundColor: glowColor }}
      />
      
      {/* Actual image */}
      <motion.div
        className="relative z-10"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: imageLoaded ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <Image
          src={src}
          alt={alt}
          width={dimensions.width}
          height={dimensions.height}
          className="object-contain drop-shadow-lg"
          onError={() => setImageError(true)}
          onLoad={() => setImageLoaded(true)}
        />
      </motion.div>
      
      {/* Loading state */}
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <CSSFlowerFallback alt={alt} glowColor={glowColor} size={size} />
        </div>
      )}
    </div>
  );
}