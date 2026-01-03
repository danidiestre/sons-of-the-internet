"use client";

import React, { useState, useEffect, useRef } from "react";

interface DotPatternProps {
  className?: string;
}

export function DotPattern({ className = "" }: DotPatternProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dots, setDots] = useState<
    Array<{
      x: number;
      y: number;
      size: number;
      delay: number;
      duration: number;
      a1: number;
      a2: number;
    }>
  >([]);

  useEffect(() => {
    const generateDots = () => {
      const newDots = [];
      const rows = 20;
      const cols = 28;
      
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const baseA = 0.25 + Math.random() * 0.35;
          const a1 = Math.min(0.98, baseA + Math.random() * 0.35);
          const a2 = Math.min(0.98, baseA + Math.random() * 0.35);
          newDots.push({
            x: (j / (cols - 1)) * 100,
            y: (i / (rows - 1)) * 100,
            size: 2 + Math.round(Math.random()),
            delay: Math.random() * 1.6,
            duration: 1.2 + Math.random() * 2.4,
            a1,
            a2,
          });
        }
      }
      setDots(newDots);
    };

    generateDots();
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full bg-gradient-to-br from-gray-900 to-black overflow-hidden ${className}`}
    >
      <div className="absolute inset-0">
        {dots.map((dot, index) => {
          return (
            <div
              key={index}
              className="dot absolute"
              style={{
                left: `${dot.x}%`,
                top: `${dot.y}%`,
                width: `${dot.size}px`,
                height: `${dot.size}px`,
                transform: "translate(-50%, -50%)",
                backgroundImage: `linear-gradient(135deg, rgba(255,255,255,${dot.a1}) 0%, rgba(255,255,255,${dot.a2}) 100%)`,
                animationDelay: `${dot.delay}s`,
                animationDuration: `${dot.duration}s`,
              }}
            />
          );
        })}
      </div>
      
      {/* Subtle glow effect following mouse */}
      <div 
        className="absolute w-32 h-32 rounded-full pointer-events-none"
        style={{
          left: "50%",
          top: "50%",
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          transition: 'all 0.3s ease-out',
        }}
      />

      <style jsx>{`
        .dot {
          border-radius: 0px;
          opacity: 0.4;
          will-change: opacity;
          animation-name: twinkle;
          animation-timing-function: steps(2, end);
          animation-iteration-count: infinite;
        }

        @keyframes twinkle {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
