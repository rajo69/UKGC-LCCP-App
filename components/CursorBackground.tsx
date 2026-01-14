import React, { useEffect, useRef, useState } from 'react';

export const CursorBackground: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setOpacity(1);
    };

    const handleMouseLeave = () => {
      setOpacity(0);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-gray-950"
    >
      {/* Base Grid Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Reactive Glow */}
      <div
        className="absolute inset-0 z-10 transition-opacity duration-300 ease-in-out"
        style={{
          opacity: opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(14, 165, 233, 0.15), transparent 40%)`,
        }}
      />
      
      {/* Secondary colored accent glow for visual depth */}
      <div
        className="absolute inset-0 z-10 transition-opacity duration-500 ease-in-out"
        style={{
          opacity: opacity * 0.5,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(99, 102, 241, 0.1), transparent 40%)`,
        }}
      />
    </div>
  );
};
