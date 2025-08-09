import { useState, useEffect, useMemo, useCallback } from 'react';

/**
 * Custom hook for virtualized list rendering
 * Optimizes performance for large datasets by only rendering visible items
 */
export const useVirtualizedList = ({
  items = [],
  itemHeight = 60,
  containerHeight = 400,
  overscan = 5,
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerRef, setContainerRef] = useState(null);

  const visibleRange = useMemo(() => {
    if (!items.length) return { start: 0, end: 0 };

    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const end = Math.min(items.length, start + visibleCount + overscan * 2);

    return { start, end };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end).map((item, index) => ({
      ...item,
      index: visibleRange.start + index,
      style: {
        position: 'absolute',
        top: (visibleRange.start + index) * itemHeight,
        height: itemHeight,
        width: '100%',
      },
    }));
  }, [items, visibleRange, itemHeight]);

  const totalHeight = items.length * itemHeight;

  const handleScroll = useCallback(event => {
    setScrollTop(event.target.scrollTop);
  }, []);

  const scrollToIndex = useCallback(
    index => {
      if (containerRef) {
        const scrollTop = index * itemHeight;
        containerRef.scrollTop = scrollTop;
        setScrollTop(scrollTop);
      }
    },
    [containerRef, itemHeight]
  );

  return {
    visibleItems,
    totalHeight,
    handleScroll,
    scrollToIndex,
    setContainerRef,
    visibleRange,
  };
};

/**
 * Custom hook for pagination
 * Handles pagination state and calculations
 */
export const usePagination = ({ totalItems = 0, itemsPerPage = 10, initialPage = 1 }) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const goToPage = useCallback(
    page => {
      const validPage = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(validPage);
    },
    [totalPages]
  );

  const goToNextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const goToPreviousPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const goToFirstPage = useCallback(() => {
    goToPage(1);
  }, [goToPage]);

  const goToLastPage = useCallback(() => {
    goToPage(totalPages);
  }, [goToPage, totalPages]);

  const getPageItems = useCallback(
    items => {
      return items.slice(startIndex, endIndex);
    },
    [startIndex, endIndex]
  );

  const paginationInfo = {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    startIndex: startIndex + 1,
    endIndex,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };

  return {
    ...paginationInfo,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    getPageItems,
  };
};

/**
 * Custom hook for data caching
 * Implements LRU cache with TTL support
 */
export const useCache = (maxSize = 100, ttl = 5 * 60 * 1000) => {
  // 5 minutes default TTL
  const [cache, setCache] = useState(new Map());

  const get = useCallback(
    key => {
      const item = cache.get(key);
      if (!item) return null;

      // Check if item has expired
      if (Date.now() > item.expiry) {
        cache.delete(key);
        setCache(new Map(cache));
        return null;
      }

      // Move to end (most recently used)
      cache.delete(key);
      cache.set(key, item);
      setCache(new Map(cache));

      return item.value;
    },
    [cache]
  );

  const set = useCallback(
    (key, value) => {
      const newCache = new Map(cache);

      // Remove oldest item if cache is full
      if (newCache.size >= maxSize && !newCache.has(key)) {
        const firstKey = newCache.keys().next().value;
        newCache.delete(firstKey);
      }

      // Remove existing key if it exists
      if (newCache.has(key)) {
        newCache.delete(key);
      }

      // Add new item with expiry
      newCache.set(key, {
        value,
        expiry: Date.now() + ttl,
      });

      setCache(newCache);
    },
    [cache, maxSize, ttl]
  );

  const remove = useCallback(
    key => {
      const newCache = new Map(cache);
      newCache.delete(key);
      setCache(newCache);
    },
    [cache]
  );

  const clear = useCallback(() => {
    setCache(new Map());
  }, []);

  const has = useCallback(
    key => {
      const item = cache.get(key);
      if (!item) return false;

      // Check if item has expired
      if (Date.now() > item.expiry) {
        cache.delete(key);
        setCache(new Map(cache));
        return false;
      }

      return true;
    },
    [cache]
  );

  const size = cache.size;

  return {
    get,
    set,
    remove,
    clear,
    has,
    size,
  };
};

/**
 * Custom hook for debounced search
 * Optimizes search performance by debouncing input
 */
export const useDebouncedSearch = (searchFunction, delay = 300) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(async () => {
      try {
        const searchResults = await searchFunction(searchTerm);
        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchFunction, delay]);

  return {
    searchTerm,
    setSearchTerm,
    isSearching,
    results,
  };
};

/**
 * Custom hook for infinite scrolling
 * Loads more data as user scrolls to bottom
 */
export const useInfiniteScroll = ({ loadMore, hasMore = true, threshold = 100 }) => {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - threshold
      ) {
        if (hasMore && !isFetching) {
          setIsFetching(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, isFetching, threshold]);

  useEffect(() => {
    if (!isFetching) return;

    const fetchMoreData = async () => {
      try {
        await loadMore();
      } catch (error) {
        console.error('Error loading more data:', error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchMoreData();
  }, [isFetching, loadMore]);

  return { isFetching, setIsFetching };
};

export default {
  useVirtualizedList,
  usePagination,
  useCache,
  useDebouncedSearch,
  useInfiniteScroll,
};
