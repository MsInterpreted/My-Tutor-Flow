import firebaseService from './firebaseService';

/**
 * Enhanced data service with caching capabilities
 * Improves performance by caching frequently accessed data
 */
class CachedDataService {
  constructor() {
    this.cache = new Map();
    this.cacheConfig = {
      students: { ttl: 5 * 60 * 1000, maxSize: 1000 }, // 5 minutes
      attendance: { ttl: 2 * 60 * 1000, maxSize: 5000 }, // 2 minutes
      invoices: { ttl: 1 * 60 * 1000, maxSize: 2000 }, // 1 minute
      analytics: { ttl: 10 * 60 * 1000, maxSize: 100 }, // 10 minutes
    };
    this.requestQueue = new Map();
    this.batchConfig = {
      batchSize: 50,
      batchDelay: 100, // ms
    };
  }

  /**
   * Get cache key for a request
   */
  getCacheKey(type, params = {}) {
    const paramString = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|');
    return `${type}:${paramString}`;
  }

  /**
   * Check if cached data is valid
   */
  isCacheValid(cacheKey, type) {
    const cached = this.cache.get(cacheKey);
    if (!cached) return false;

    const config = this.cacheConfig[type];
    const isExpired = Date.now() > cached.timestamp + config.ttl;

    if (isExpired) {
      this.cache.delete(cacheKey);
      return false;
    }

    return true;
  }

  /**
   * Set cache with LRU eviction
   */
  setCache(cacheKey, data, type) {
    const config = this.cacheConfig[type];

    // Remove expired entries
    this.cleanExpiredCache(type);

    // Remove oldest entries if cache is full
    const typeEntries = Array.from(this.cache.entries()).filter(([key]) =>
      key.startsWith(`${type}:`)
    );

    if (typeEntries.length >= config.maxSize) {
      const oldestKey = typeEntries.sort((a, b) => a[1].timestamp - b[1].timestamp)[0][0];
      this.cache.delete(oldestKey);
    }

    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Clean expired cache entries
   */
  cleanExpiredCache(type) {
    const config = this.cacheConfig[type];
    const now = Date.now();

    for (const [key, value] of this.cache.entries()) {
      if (key.startsWith(`${type}:`) && now > value.timestamp + config.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cached data or fetch from service
   */
  async getCachedData(type, fetchFunction, params = {}) {
    const cacheKey = this.getCacheKey(type, params);

    // Return cached data if valid
    if (this.isCacheValid(cacheKey, type)) {
      console.log(`📦 Cache hit for ${cacheKey}`);
      return this.cache.get(cacheKey).data;
    }

    // Check if request is already in progress
    if (this.requestQueue.has(cacheKey)) {
      console.log(`⏳ Waiting for in-progress request: ${cacheKey}`);
      return this.requestQueue.get(cacheKey);
    }

    // Fetch data and cache it
    console.log(`🔄 Cache miss, fetching: ${cacheKey}`);
    const promise = fetchFunction(params)
      .then(data => {
        this.setCache(cacheKey, data, type);
        this.requestQueue.delete(cacheKey);
        return data;
      })
      .catch(error => {
        this.requestQueue.delete(cacheKey);
        throw error;
      });

    this.requestQueue.set(cacheKey, promise);
    return promise;
  }

  /**
   * Batch multiple requests together
   */
  async batchRequests(requests) {
    const batches = [];
    for (let i = 0; i < requests.length; i += this.batchConfig.batchSize) {
      batches.push(requests.slice(i, i + this.batchConfig.batchSize));
    }

    const results = [];
    for (const batch of batches) {
      const batchPromises = batch.map(request => request());
      const batchResults = await Promise.allSettled(batchPromises);
      results.push(...batchResults);

      // Small delay between batches to prevent overwhelming the server
      if (batches.indexOf(batch) < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, this.batchConfig.batchDelay));
      }
    }

    return results;
  }

  /**
   * Enhanced student data with caching
   */
  async getStudents(params = {}) {
    return this.getCachedData('students', () => firebaseService.getStudents(), params);
  }

  async getStudent(studentId) {
    return this.getCachedData('students', () => firebaseService.getStudent(studentId), {
      id: studentId,
    });
  }

  /**
   * Enhanced attendance data with caching
   */
  async getAttendanceForStudent(studentId, params = {}) {
    return this.getCachedData(
      'attendance',
      () => firebaseService.getAttendanceForStudent(studentId),
      { studentId, ...params }
    );
  }

  async getAllAttendance(params = {}) {
    return this.getCachedData('attendance', () => firebaseService.getAllAttendance(), params);
  }

  /**
   * Enhanced invoice data with caching
   */
  async getAllInvoices(params = {}) {
    return this.getCachedData('invoices', () => firebaseService.getAllInvoices(), params);
  }

  async getInvoicesForStudent(studentId) {
    return this.getCachedData('invoices', () => firebaseService.getInvoicesForStudent(studentId), {
      studentId,
    });
  }

  /**
   * Paginated data fetching
   */
  async getPaginatedStudents(page = 1, limit = 20, filters = {}) {
    const cacheKey = this.getCacheKey('students_paginated', { page, limit, ...filters });

    if (this.isCacheValid(cacheKey, 'students')) {
      return this.cache.get(cacheKey).data;
    }

    // For now, simulate pagination with client-side filtering
    // In production, this would be server-side pagination
    const allStudents = await this.getStudents();
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    let filteredStudents = allStudents;

    // Apply filters
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredStudents = filteredStudents.filter(
        student =>
          student.firstName.toLowerCase().includes(searchTerm) ||
          student.lastName.toLowerCase().includes(searchTerm) ||
          student.parentEmail.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.grade) {
      filteredStudents = filteredStudents.filter(student => student.grade === filters.grade);
    }

    const paginatedData = {
      items: filteredStudents.slice(startIndex, endIndex),
      totalItems: filteredStudents.length,
      totalPages: Math.ceil(filteredStudents.length / limit),
      currentPage: page,
      hasNextPage: endIndex < filteredStudents.length,
      hasPreviousPage: page > 1,
    };

    this.setCache(cacheKey, paginatedData, 'students');
    return paginatedData;
  }

  /**
   * Search functionality with caching
   */
  async searchStudents(searchTerm, limit = 10) {
    if (!searchTerm || searchTerm.length < 2) return [];

    const cacheKey = this.getCacheKey('search_students', { term: searchTerm, limit });

    if (this.isCacheValid(cacheKey, 'students')) {
      return this.cache.get(cacheKey).data;
    }

    const allStudents = await this.getStudents();
    const searchResults = allStudents
      .filter(student => {
        const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
        const email = student.parentEmail.toLowerCase();
        const term = searchTerm.toLowerCase();

        return (
          fullName.includes(term) ||
          email.includes(term) ||
          student.firstName.toLowerCase().includes(term) ||
          student.lastName.toLowerCase().includes(term)
        );
      })
      .slice(0, limit);

    this.setCache(cacheKey, searchResults, 'students');
    return searchResults;
  }

  /**
   * Analytics data with extended caching
   */
  async getAnalyticsData(timeRange = 'month') {
    return this.getCachedData(
      'analytics',
      async () => {
        const [students, invoices, attendance] = await Promise.all([
          this.getStudents(),
          this.getAllInvoices(),
          this.getAllAttendance(),
        ]);

        return this.calculateAnalytics(students, invoices, attendance, timeRange);
      },
      { timeRange }
    );
  }

  calculateAnalytics(students, invoices, attendance, timeRange) {
    // Analytics calculation logic (simplified)
    const now = new Date();
    const timeRanges = {
      week: 7,
      month: 30,
      quarter: 90,
      year: 365,
    };

    const daysBack = timeRanges[timeRange] || 30;
    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

    const recentInvoices = invoices.filter(inv => new Date(inv.createdAt) >= startDate);
    const recentAttendance = attendance.filter(att => new Date(att.date) >= startDate);

    return {
      totalRevenue: recentInvoices.reduce((sum, inv) => sum + (inv.amount || 0), 0),
      totalSessions: recentAttendance.length,
      activeStudents: students.filter(s => s.isActive !== false).length,
      averageSessionsPerStudent: recentAttendance.length / students.length,
      timeRange,
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Preload frequently accessed data
   */
  async preloadData() {
    console.log('🚀 Preloading frequently accessed data...');

    const preloadTasks = [
      () => this.getStudents(),
      () => this.getAllInvoices({ limit: 100 }),
      () => this.getAnalyticsData('month'),
    ];

    try {
      await Promise.allSettled(preloadTasks.map(task => task()));
      console.log('✅ Data preloading completed');
    } catch (error) {
      console.error('❌ Error during data preloading:', error);
    }
  }

  /**
   * Clear cache for specific type or all
   */
  clearCache(type = null) {
    if (type) {
      for (const key of this.cache.keys()) {
        if (key.startsWith(`${type}:`)) {
          this.cache.delete(key);
        }
      }
      console.log(`🗑️ Cleared ${type} cache`);
    } else {
      this.cache.clear();
      console.log('🗑️ Cleared all cache');
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    const stats = {};

    for (const type of Object.keys(this.cacheConfig)) {
      const typeEntries = Array.from(this.cache.keys()).filter(key => key.startsWith(`${type}:`));

      stats[type] = {
        entries: typeEntries.length,
        maxSize: this.cacheConfig[type].maxSize,
        ttl: this.cacheConfig[type].ttl,
      };
    }

    return {
      totalEntries: this.cache.size,
      typeStats: stats,
      requestsInProgress: this.requestQueue.size,
    };
  }

  /**
   * Invalidate cache when data changes
   */
  invalidateCache(type, params = {}) {
    const cacheKey = this.getCacheKey(type, params);
    this.cache.delete(cacheKey);

    // Also clear related caches
    if (type === 'students') {
      this.clearCache('analytics');
    } else if (type === 'invoices' || type === 'attendance') {
      this.clearCache('analytics');
    }

    console.log(`🔄 Invalidated cache for ${cacheKey}`);
  }
}

// Create singleton instance
const cachedDataService = new CachedDataService();

// Preload data on initialization
if (typeof window !== 'undefined') {
  // Only preload in browser environment
  setTimeout(() => {
    cachedDataService.preloadData();
  }, 1000);
}

export default cachedDataService;
