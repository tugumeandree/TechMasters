'use client';

import { useEffect, useRef, useState } from 'react';

interface StatsCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  label: string;
}

export default function StatsCounter({ 
  end, 
  duration = 2000, 
  suffix = '', 
  prefix = '',
  label 
}: StatsCounterProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    const startCount = 0;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * (end - startCount) + startCount);
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return (
    <div ref={counterRef} className="text-center animate-count-up">
      <div className="text-4xl md:text-5xl font-bold text-primary-600 dark:text-primary-400 mb-2">
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium">
        {label}
      </div>
    </div>
  );
}
