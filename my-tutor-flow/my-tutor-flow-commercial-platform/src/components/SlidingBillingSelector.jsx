import { useState, useRef, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';

const SlidingBillingSelector = ({ value, onChange, options, disabled = false }) => {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Billing options
  const billingOptions = options || [
    { value: 'all-invoices', label: 'All Invoices' },
    { value: 'create-invoice', label: 'Create Invoice' },
    { value: 'advanced-features', label: 'Advanced Features' },
    { value: 'rate-setting', label: 'Rate Setting' },
    { value: 'analytics', label: 'Analytics' }
  ];

  // Find current index based on value
  useEffect(() => {
    const index = billingOptions.findIndex(option => option.value === value);
    if (index !== -1 && index !== currentIndex) {
      setCurrentIndex(index);
    }
  }, [value, billingOptions, currentIndex]);

  const slideToNext = () => {
    if (isTransitioning || disabled) return;
    
    setIsTransitioning(true);
    const nextIndex = (currentIndex + 1) % billingOptions.length;
    setCurrentIndex(nextIndex);
    onChange(billingOptions[nextIndex].value);
    
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const slideToPrevious = () => {
    if (isTransitioning || disabled) return;
    
    setIsTransitioning(true);
    const prevIndex = currentIndex === 0 ? billingOptions.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    onChange(billingOptions[prevIndex].value);
    
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleSwipe = (direction) => {
    if (direction === 'left') {
      slideToNext();
    } else if (direction === 'right') {
      slideToPrevious();
    }
  };

  // Touch handling for swipe gestures
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleSwipe('left');
    } else if (isRightSwipe) {
      handleSwipe('right');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        position: 'relative',
        py: 2,
        px: 1,
      }}
    >
      {/* Previous Button */}
      <IconButton
        onClick={slideToPrevious}
        disabled={disabled || isTransitioning}
        sx={{
          color: theme.colors.brand.primary,
          backgroundColor: theme.colors.background.secondary,
          border: `1px solid ${theme.colors.brand.primary}`,
          borderRadius: '50%',
          width: 48,
          height: 48,
          mr: 2,
          '&:hover': {
            backgroundColor: theme.colors.brand.primary,
            color: '#000000',
          },
          '&:disabled': {
            opacity: 0.5,
          },
        }}
      >
        <ChevronLeft />
      </IconButton>

      {/* Sliding Container */}
      <Box
        ref={containerRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        sx={{
          flex: 1,
          height: 65,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '12px',
          backgroundColor: theme.colors.background.secondary,
          border: `2px solid ${theme.colors.brand.primary}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none',
          WebkitTapHighlightColor: 'transparent',
          // Android-specific optimizations
          touchAction: 'pan-x',
          WebkitOverflowScrolling: 'touch',
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
        }}
      >
        {/* Billing Option Display with Slide Animation */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          {billingOptions.map((option, index) => (
            <Box
              key={option.value}
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
                transform: `translateX(${(index - currentIndex) * 100}%)`,
                opacity: index === currentIndex ? 1 : 0.3,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: theme.colors.text.primary,
                  fontWeight: 600,
                  fontSize: '15px',
                  textAlign: 'center',
                  px: 2,
                  lineHeight: 1.2,
                }}
              >
                {option.label}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Slide Indicators */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 6,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 0.8,
          }}
        >
          {billingOptions.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                backgroundColor: index === currentIndex 
                  ? theme.colors.brand.primary 
                  : theme.colors.text.secondary,
                opacity: index === currentIndex ? 1 : 0.4,
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Next Button */}
      <IconButton
        onClick={slideToNext}
        disabled={disabled || isTransitioning}
        sx={{
          color: theme.colors.brand.primary,
          backgroundColor: theme.colors.background.secondary,
          border: `1px solid ${theme.colors.brand.primary}`,
          borderRadius: '50%',
          width: 48,
          height: 48,
          ml: 2,
          '&:hover': {
            backgroundColor: theme.colors.brand.primary,
            color: '#000000',
          },
          '&:disabled': {
            opacity: 0.5,
          },
        }}
      >
        <ChevronRight />
      </IconButton>
    </Box>
  );
};

export default SlidingBillingSelector;
