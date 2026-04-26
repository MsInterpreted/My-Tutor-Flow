import { useState, useEffect, useRef } from 'react';

export const useAnimatedValue = (targetValue, duration = 2000, delay = 0) => {
  const [currentValue, setCurrentValue] = useState(0);
  const animationRef = useRef();
  const startTimeRef = useRef();

  useEffect(() => {
    const startAnimation = () => {
      startTimeRef.current = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);

        setCurrentValue(targetValue * easeOutCubic);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    };

    const timeoutId = setTimeout(startAnimation, delay);

    return () => {
      clearTimeout(timeoutId);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetValue, duration, delay]);

  return Math.round(currentValue * 100) / 100; // Round to 2 decimal places
};

export const useCountUp = (targetValue, duration = 2000, delay = 0) => {
  return useAnimatedValue(targetValue, duration, delay);
};

export const useStaggeredAnimation = (items, itemDuration = 1500, staggerDelay = 200) => {
  const [animatedItems, setAnimatedItems] = useState([]);

  useEffect(() => {
    const newAnimatedItems = items.map((item, index) => ({
      ...item,
      animatedValue: 0,
      delay: index * staggerDelay,
    }));

    setAnimatedItems(newAnimatedItems);

    // Start animations with staggered delays
    items.forEach((item, index) => {
      setTimeout(() => {
        setAnimatedItems(prev =>
          prev.map((animItem, animIndex) =>
            animIndex === index ? { ...animItem, animatedValue: item.value } : animItem
          )
        );
      }, index * staggerDelay);
    });
  }, [items, staggerDelay]);

  return animatedItems;
};

// Hook for real-time data simulation
export const useRealTimeData = (initialData, updateInterval = 5000) => {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData =>
        prevData.map(item => ({
          ...item,
          value: item.value + (Math.random() - 0.5) * 2, // Small random changes
        }))
      );
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval]);

  return data;
};

// Hook for pulse animation effect
export const usePulseAnimation = (isActive = true) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setScale(prev => (prev === 1 ? 1.05 : 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  return {
    transform: `scale(${scale})`,
    transition: 'transform 0.3s ease-in-out',
  };
};
