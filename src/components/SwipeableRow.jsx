import React, { useState, useRef } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { useSwipeable } from 'react-swipeable';
import { useTheme } from '../theme/ThemeContext';

const SWIPE_THRESHOLD = 80;
const MAX_SWIPE = 160;

export default function SwipeableRow({
  children,
  leftActions = [],  // [{ icon, label, color, onClick }]
  rightActions = [], // [{ icon, label, color, onClick }]
  onSwipeLeft,
  onSwipeRight,
  disabled = false,
}) {
  const theme = useTheme();
  const [offset, setOffset] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const rowRef = useRef(null);

  const handlers = useSwipeable({
    onSwiping: (e) => {
      if (disabled) return;
      setSwiping(true);
      const dir = e.deltaX;
      // Limit swipe distance with rubber-band effect
      const clampedOffset = Math.sign(dir) * Math.min(Math.abs(dir), MAX_SWIPE);
      // Only allow swipe if actions exist for that direction
      if (dir > 0 && leftActions.length === 0) return;
      if (dir < 0 && rightActions.length === 0) return;
      setOffset(clampedOffset);
    },
    onSwipedLeft: (e) => {
      if (disabled) return;
      setSwiping(false);
      if (Math.abs(e.deltaX) >= SWIPE_THRESHOLD && rightActions.length > 0) {
        // Snap to reveal actions
        setOffset(-SWIPE_THRESHOLD);
        if (onSwipeLeft) onSwipeLeft();
      } else {
        setOffset(0);
      }
    },
    onSwipedRight: (e) => {
      if (disabled) return;
      setSwiping(false);
      if (Math.abs(e.deltaX) >= SWIPE_THRESHOLD && leftActions.length > 0) {
        setOffset(SWIPE_THRESHOLD);
        if (onSwipeRight) onSwipeRight();
      } else {
        setOffset(0);
      }
    },
    onTap: () => {
      // Reset on tap if actions are revealed
      if (offset !== 0) {
        setOffset(0);
      }
    },
    trackMouse: false,
    trackTouch: true,
    delta: 10,
    preventScrollOnSwipe: true,
  });

  const handleActionClick = (action) => {
    action.onClick();
    setOffset(0);
  };

  const actionButtonSx = (color) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
    height: '100%',
    backgroundColor: color,
    color: 'white',
    gap: 0.5,
    px: 1,
  });

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '12px',
        mb: 2,
      }}
    >
      {/* Left actions (revealed on swipe right) */}
      {leftActions.length > 0 && (
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            display: 'flex',
            zIndex: 0,
          }}
        >
          {leftActions.map((action, i) => (
            <Box
              key={i}
              onClick={() => handleActionClick(action)}
              sx={actionButtonSx(action.color || '#4CAF50')}
            >
              {action.icon}
              <Typography variant="caption" sx={{ fontSize: '10px', fontWeight: 600, color: 'white' }}>
                {action.label}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Right actions (revealed on swipe left) */}
      {rightActions.length > 0 && (
        <Box
          sx={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            display: 'flex',
            zIndex: 0,
          }}
        >
          {rightActions.map((action, i) => (
            <Box
              key={i}
              onClick={() => handleActionClick(action)}
              sx={actionButtonSx(action.color || '#F44336')}
            >
              {action.icon}
              <Typography variant="caption" sx={{ fontSize: '10px', fontWeight: 600, color: 'white' }}>
                {action.label}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Main content - slides to reveal actions */}
      <Box
        ref={rowRef}
        {...handlers}
        sx={{
          position: 'relative',
          zIndex: 1,
          transform: `translateX(${offset}px)`,
          transition: swiping ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          backgroundColor: theme.colors.background.secondary,
          borderRadius: '12px',
          touchAction: 'pan-y',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
