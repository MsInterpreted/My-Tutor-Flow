import { useEffect, useCallback, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook for keyboard shortcuts
 * Provides global keyboard shortcuts for navigation and actions
 */
export const useKeyboardShortcuts = (shortcuts = {}) => {
  const navigate = useNavigate();

  const defaultShortcuts = {
    // Navigation shortcuts
    'ctrl+1': () => navigate('/dashboard'),
    'ctrl+2': () => navigate('/students'),
    'ctrl+3': () => navigate('/attendance'),
    'ctrl+4': () => navigate('/billing'),
    'ctrl+5': () => navigate('/reports'),
    'ctrl+6': () => navigate('/business'),

    // Action shortcuts
    'ctrl+n': () => {
      const event = new CustomEvent('shortcut:new');
      window.dispatchEvent(event);
    },
    'ctrl+s': e => {
      e.preventDefault();
      const event = new CustomEvent('shortcut:save');
      window.dispatchEvent(event);
    },
    'ctrl+f': e => {
      e.preventDefault();
      const event = new CustomEvent('shortcut:search');
      window.dispatchEvent(event);
    },
    'ctrl+z': e => {
      e.preventDefault();
      const event = new CustomEvent('shortcut:undo');
      window.dispatchEvent(event);
    },
    'ctrl+y': e => {
      e.preventDefault();
      const event = new CustomEvent('shortcut:redo');
      window.dispatchEvent(event);
    },
    escape: () => {
      const event = new CustomEvent('shortcut:escape');
      window.dispatchEvent(event);
    },
    'ctrl+shift+d': () => {
      const event = new CustomEvent('shortcut:toggle-theme');
      window.dispatchEvent(event);
    },
  };

  const allShortcuts = { ...defaultShortcuts, ...shortcuts };

  const handleKeyDown = useCallback(
    event => {
      const key = event.key.toLowerCase();
      const ctrl = event.ctrlKey || event.metaKey;
      const shift = event.shiftKey;
      const alt = event.altKey;

      let shortcutKey = '';

      if (ctrl) shortcutKey += 'ctrl+';
      if (shift) shortcutKey += 'shift+';
      if (alt) shortcutKey += 'alt+';
      shortcutKey += key;

      const handler = allShortcuts[shortcutKey];
      if (handler) {
        handler(event);
      }
    },
    [allShortcuts]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return { shortcuts: allShortcuts };
};

/**
 * Custom hook for undo/redo functionality
 */
export const useUndoRedo = (initialState, maxHistorySize = 50) => {
  const [history, setHistory] = useState([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentState = history[currentIndex];

  const pushState = useCallback(
    newState => {
      setHistory(prev => {
        const newHistory = prev.slice(0, currentIndex + 1);
        newHistory.push(newState);

        // Limit history size
        if (newHistory.length > maxHistorySize) {
          newHistory.shift();
          return newHistory;
        }

        return newHistory;
      });
      setCurrentIndex(prev => Math.min(prev + 1, maxHistorySize - 1));
    },
    [currentIndex, maxHistorySize]
  );

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      return history[currentIndex - 1];
    }
    return currentState;
  }, [currentIndex, history, currentState]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(prev => prev + 1);
      return history[currentIndex + 1];
    }
    return currentState;
  }, [currentIndex, history, currentState]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const reset = useCallback(
    (newInitialState = initialState) => {
      setHistory([newInitialState]);
      setCurrentIndex(0);
    },
    [initialState]
  );

  return {
    currentState,
    pushState,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
    historySize: history.length,
  };
};

/**
 * Custom hook for drag and drop functionality
 */
export const useDragAndDrop = (onDrop, options = {}) => {
  const {
    acceptedTypes = ['*'],
    multiple = false,
    maxSize = 10 * 1024 * 1024, // 10MB
    onDragEnter = () => {},
    onDragLeave = () => {},
    onDragOver = () => {},
  } = options;

  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const handleDragEnter = useCallback(
    e => {
      e.preventDefault();
      e.stopPropagation();
      setDragCounter(prev => prev + 1);
      if (!isDragging) {
        setIsDragging(true);
        onDragEnter(e);
      }
    },
    [isDragging, onDragEnter]
  );

  const handleDragLeave = useCallback(
    e => {
      e.preventDefault();
      e.stopPropagation();
      setDragCounter(prev => {
        const newCounter = prev - 1;
        if (newCounter === 0) {
          setIsDragging(false);
          onDragLeave(e);
        }
        return newCounter;
      });
    },
    [onDragLeave]
  );

  const handleDragOver = useCallback(
    e => {
      e.preventDefault();
      e.stopPropagation();
      onDragOver(e);
    },
    [onDragOver]
  );

  const handleDrop = useCallback(
    e => {
      e.preventDefault();
      e.stopPropagation();

      setIsDragging(false);
      setDragCounter(0);

      const files = Array.from(e.dataTransfer.files);
      const validFiles = files
        .filter(file => {
          // Check file type
          if (acceptedTypes.includes('*')) return true;
          return acceptedTypes.some(type => {
            if (type.startsWith('.')) {
              return file.name.toLowerCase().endsWith(type.toLowerCase());
            }
            return file.type.startsWith(type);
          });
        })
        .filter(file => {
          // Check file size
          return file.size <= maxSize;
        });

      if (!multiple && validFiles.length > 1) {
        validFiles.splice(1);
      }

      if (validFiles.length > 0) {
        onDrop(validFiles, e);
      }
    },
    [acceptedTypes, maxSize, multiple, onDrop]
  );

  const dragProps = {
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDragOver: handleDragOver,
    onDrop: handleDrop,
  };

  return {
    isDragging,
    dragProps,
  };
};

/**
 * Custom hook for quick filters
 */
export const useQuickFilters = (data, filterConfig) => {
  const [activeFilters, setActiveFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search term
    if (searchTerm) {
      result = result.filter(item => {
        const searchFields = filterConfig.searchFields || ['name'];
        return searchFields.some(field => {
          const value = item[field];
          return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        });
      });
    }

    // Apply active filters
    Object.entries(activeFilters).forEach(([filterKey, filterValue]) => {
      if (filterValue !== null && filterValue !== undefined && filterValue !== '') {
        const filterDef = filterConfig.filters[filterKey];
        if (filterDef) {
          result = result.filter(item => {
            if (filterDef.type === 'select') {
              return item[filterKey] === filterValue;
            } else if (filterDef.type === 'range') {
              const itemValue = item[filterKey];
              return itemValue >= filterValue.min && itemValue <= filterValue.max;
            } else if (filterDef.type === 'date') {
              const itemDate = new Date(item[filterKey]);
              const filterDate = new Date(filterValue);
              return itemDate.toDateString() === filterDate.toDateString();
            }
            return true;
          });
        }
      }
    });

    return result;
  }, [data, activeFilters, searchTerm, filterConfig]);

  const setFilter = useCallback((filterKey, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: value,
    }));
  }, []);

  const clearFilter = useCallback(filterKey => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterKey];
      return newFilters;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setActiveFilters({});
    setSearchTerm('');
  }, []);

  const hasActiveFilters = Object.keys(activeFilters).length > 0 || searchTerm.length > 0;

  return {
    filteredData,
    activeFilters,
    searchTerm,
    setSearchTerm,
    setFilter,
    clearFilter,
    clearAllFilters,
    hasActiveFilters,
  };
};

export default {
  useKeyboardShortcuts,
  useUndoRedo,
  useDragAndDrop,
  useQuickFilters,
};
