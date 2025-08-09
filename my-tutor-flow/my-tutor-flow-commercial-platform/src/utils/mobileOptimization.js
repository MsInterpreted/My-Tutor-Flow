// TD Learning Academy - Mobile Optimization Utilities
// Comprehensive mobile UX/UI optimization for Android premium phones (July 2025)

import { MOBILE_CONFIG } from '../config/mobileConfig';

/**
 * Mobile Optimization Manager
 * Handles all mobile-specific optimizations and adaptations
 */
class MobileOptimizationManager {
  constructor() {
    this.isInitialized = false;
    this.deviceInfo = this.getDeviceInfo();
    this.optimizations = new Map();
  }

  // Initialize mobile optimizations
  initialize() {
    if (this.isInitialized) return;

    this.setupViewport();
    this.setupTouchOptimizations();
    this.setupPerformanceOptimizations();
    this.setupAccessibilityFeatures();
    this.setupGestureHandling();
    
    this.isInitialized = true;
    console.log('🚀 Mobile optimizations initialized for:', this.deviceInfo);
  }

  // Get comprehensive device information
  getDeviceInfo() {
    const ua = navigator.userAgent;
    const screen = window.screen;
    
    return {
      isMobile: window.innerWidth <= 768,
      isAndroid: /Android/i.test(ua),
      isPremium: this.isPremiumDevice(),
      screenWidth: screen.width,
      screenHeight: screen.height,
      pixelRatio: window.devicePixelRatio || 1,
      orientation: screen.orientation?.type || 'portrait-primary',
      touchSupport: 'ontouchstart' in window,
      gestureSupport: 'ongesturestart' in window,
      webpSupport: this.supportsWebP(),
      darkModeSupport: window.matchMedia('(prefers-color-scheme: dark)').matches,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    };
  }

  // Detect premium Android devices
  isPremiumDevice() {
    const ua = navigator.userAgent;
    const premiumIndicators = [
      'Samsung.*SM-G', 'Samsung.*SM-N', // Galaxy S/Note series
      'Google.*Pixel', // Google Pixel
      'OnePlus', // OnePlus devices
      'Xiaomi.*Mi.*Pro', // Xiaomi Pro series
      'Huawei.*P\d+.*Pro', // Huawei P Pro series
    ];
    
    return premiumIndicators.some(pattern => new RegExp(pattern).test(ua));
  }

  // Setup optimal viewport configuration
  setupViewport() {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      const config = MOBILE_CONFIG.viewport;
      viewport.setAttribute('content', 
        `width=${config.width}, initial-scale=${config.initialScale}, ` +
        `maximum-scale=${config.maximumScale}, user-scalable=${config.userScalable}, ` +
        `viewport-fit=${config.viewportFit}`
      );
    }
  }

  // Optimize touch interactions
  setupTouchOptimizations() {
    if (!this.deviceInfo.touchSupport) return;

    // Add touch-friendly CSS classes
    document.body.classList.add('touch-device');
    
    if (this.deviceInfo.isAndroid) {
      document.body.classList.add('android-device');
    }

    // Optimize touch targets
    this.optimizeTouchTargets();
    
    // Setup touch feedback
    this.setupTouchFeedback();
  }

  // Ensure all interactive elements meet touch target requirements
  optimizeTouchTargets() {
    const minSize = MOBILE_CONFIG.touchTargets.minimum;
    const selectors = [
      'button', 
      'a', 
      '[role="button"]', 
      'input[type="checkbox"]', 
      'input[type="radio"]',
      '.MuiIconButton-root',
      '.MuiButton-root',
      '.MuiChip-root'
    ];

    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.width < 48 || rect.height < 48) {
          element.style.minWidth = minSize;
          element.style.minHeight = minSize;
          element.style.display = 'inline-flex';
          element.style.alignItems = 'center';
          element.style.justifyContent = 'center';
        }
      });
    });
  }

  // Add haptic feedback for touch interactions
  setupTouchFeedback() {
    if (!navigator.vibrate) return;

    const addHapticFeedback = (element, pattern = [10]) => {
      element.addEventListener('touchstart', () => {
        navigator.vibrate(pattern);
      }, { passive: true });
    };

    // Add feedback to primary actions
    document.querySelectorAll('button[type="submit"], .primary-action').forEach(el => {
      addHapticFeedback(el, [15]); // Slightly longer for important actions
    });

    // Add feedback to secondary actions
    document.querySelectorAll('button:not([type="submit"]), .secondary-action').forEach(el => {
      addHapticFeedback(el, [8]); // Shorter for secondary actions
    });
  }

  // Setup performance optimizations
  setupPerformanceOptimizations() {
    // Lazy load images
    this.setupLazyLoading();
    
    // Optimize animations based on device capability
    this.optimizeAnimations();
    
    // Setup efficient scrolling
    this.setupSmoothScrolling();
    
    // Preload critical resources
    this.preloadCriticalResources();
  }

  // Implement intersection observer for lazy loading
  setupLazyLoading() {
    if (!('IntersectionObserver' in window)) return;

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: MOBILE_CONFIG.performance.lazyLoadThreshold,
    });

    // Observe all images with data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Optimize animations for device capability
  optimizeAnimations() {
    const shouldReduceAnimations = 
      this.deviceInfo.reducedMotion || 
      !this.deviceInfo.isPremium ||
      this.getBatteryLevel() < 0.2; // Reduce animations on low battery

    if (shouldReduceAnimations) {
      document.body.classList.add('reduce-animations');
    } else {
      document.body.classList.add('full-animations');
    }
  }

  // Get battery level (if supported)
  async getBatteryLevel() {
    if ('getBattery' in navigator) {
      try {
        const battery = await navigator.getBattery();
        return battery.level;
      } catch (error) {
        return 1; // Assume full battery if unavailable
      }
    }
    return 1;
  }

  // Setup smooth scrolling with momentum
  setupSmoothScrolling() {
    // Enable momentum scrolling on iOS-style Android browsers
    document.body.style.webkitOverflowScrolling = 'touch';
    
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
  }

  // Preload critical resources
  preloadCriticalResources() {
    const criticalResources = [
      '/assets/fonts/inter-var.woff2',
      '/assets/icons/tdla-icon.svg',
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.includes('.woff') ? 'font' : 'image';
      if (link.as === 'font') {
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
    });
  }

  // Setup accessibility features
  setupAccessibilityFeatures() {
    // Enhance focus indicators for keyboard navigation
    this.enhanceFocusIndicators();
    
    // Setup screen reader optimizations
    this.setupScreenReaderOptimizations();
    
    // Add skip links for keyboard users
    this.addSkipLinks();
  }

  // Enhance focus indicators
  enhanceFocusIndicators() {
    const style = document.createElement('style');
    style.textContent = `
      .focus-visible {
        outline: 2px solid #00796B !important;
        outline-offset: 2px !important;
        border-radius: 4px !important;
      }
      
      @media (prefers-contrast: high) {
        .focus-visible {
          outline-width: 3px !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Setup screen reader optimizations
  setupScreenReaderOptimizations() {
    // Add live regions for dynamic content
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);

    // Announce page changes
    this.announcePageChanges();
  }

  // Add skip links for keyboard navigation
  addSkipLinks() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #00796B;
      color: white;
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 10000;
      transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  // Announce page changes to screen readers
  announcePageChanges() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          const liveRegion = document.getElementById('live-region');
          if (liveRegion) {
            // Announce significant page changes
            const pageTitle = document.title;
            liveRegion.textContent = `Page updated: ${pageTitle}`;
            
            // Clear after announcement
            setTimeout(() => {
              liveRegion.textContent = '';
            }, 1000);
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // Setup gesture handling
  setupGestureHandling() {
    if (!this.deviceInfo.touchSupport) return;

    // Setup swipe gestures
    this.setupSwipeGestures();
    
    // Setup pull-to-refresh
    this.setupPullToRefresh();
    
    // Setup long press gestures
    this.setupLongPressGestures();
  }

  // Implement swipe gestures for navigation
  setupSwipeGestures() {
    let startX, startY, startTime;

    document.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      startTime = Date.now();
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      if (!startX || !startY) return;

      const touch = e.changedTouches[0];
      const endX = touch.clientX;
      const endY = touch.clientY;
      const endTime = Date.now();

      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const deltaTime = endTime - startTime;

      // Check if it's a swipe (fast horizontal movement)
      if (Math.abs(deltaX) > Math.abs(deltaY) && 
          Math.abs(deltaX) > 50 && 
          deltaTime < 300) {
        
        if (deltaX > 0) {
          // Swipe right - go back
          this.handleSwipeRight();
        } else {
          // Swipe left - go forward
          this.handleSwipeLeft();
        }
      }

      startX = startY = null;
    }, { passive: true });
  }

  // Handle swipe gestures
  handleSwipeRight() {
    // Implement back navigation
    if (window.history.length > 1) {
      window.history.back();
    }
  }

  handleSwipeLeft() {
    // Implement forward navigation or next page
    // This would be app-specific
    console.log('Swipe left detected');
  }

  // Setup pull-to-refresh functionality (DISABLED - causing logout issues)
  setupPullToRefresh() {
    // DISABLED: This was causing automatic logout when pulling down
    // The browser's native pull-to-refresh is sufficient
    console.log('🚫 Pull-to-refresh disabled to prevent logout issues');
    return;

    /* ORIGINAL CODE COMMENTED OUT
    let startY, currentY, isPulling = false;

    document.addEventListener('touchstart', (e) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
      }
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      if (startY && window.scrollY === 0) {
        currentY = e.touches[0].clientY;
        const pullDistance = currentY - startY;

        if (pullDistance > 0 && pullDistance < 150) {
          isPulling = true;
          // Visual feedback for pull-to-refresh
          document.body.style.transform = `translateY(${pullDistance * 0.5}px)`;
        }
      }
    }, { passive: true });

    document.addEventListener('touchend', () => {
      if (isPulling && currentY - startY > 100) {
        // Trigger refresh
        this.triggerRefresh();
      }

      // Reset
      document.body.style.transform = '';
      startY = currentY = null;
      isPulling = false;
    }, { passive: true });
    */
  }

  // Trigger app refresh (DISABLED)
  triggerRefresh() {
    // DISABLED: This was causing logout issues
    console.log('🚫 Auto-refresh disabled to prevent logout');
    // window.location.reload(); // COMMENTED OUT
  }

  // Setup long press gestures
  setupLongPressGestures() {
    let pressTimer;

    document.addEventListener('touchstart', (e) => {
      pressTimer = setTimeout(() => {
        // Trigger long press action
        this.handleLongPress(e.target);
      }, 500);
    }, { passive: true });

    document.addEventListener('touchend', () => {
      clearTimeout(pressTimer);
    }, { passive: true });

    document.addEventListener('touchmove', () => {
      clearTimeout(pressTimer);
    }, { passive: true });
  }

  // Handle long press actions
  handleLongPress(element) {
    // Add haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([50, 50, 50]);
    }

    // Trigger context menu or additional actions
    element.dispatchEvent(new CustomEvent('longpress', {
      bubbles: true,
      detail: { element }
    }));
  }

  // Check if WebP is supported
  supportsWebP() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  // Get optimization recommendations
  getOptimizationRecommendations() {
    const recommendations = [];

    if (!this.deviceInfo.isPremium) {
      recommendations.push('Consider reducing animation complexity for better performance');
    }

    if (this.deviceInfo.pixelRatio > 2) {
      recommendations.push('Use high-resolution images for crisp display');
    }

    if (!this.deviceInfo.webpSupport) {
      recommendations.push('Fallback to JPEG/PNG as WebP is not supported');
    }

    return recommendations;
  }
}

// Create singleton instance
const mobileOptimizer = new MobileOptimizationManager();

// REMOVED AUTO-INITIALIZATION to prevent blocking app startup
// The app will manually initialize this when ready

export default mobileOptimizer;
