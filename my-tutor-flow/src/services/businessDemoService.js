// Business Demo Service - Rich data for business dashboard demonstrations
import { shouldUseDemoData, DEMO_CONFIG } from '../config/mobileConfig';

class BusinessDemoService {
  constructor() {
    this.isDemoMode = DEMO_CONFIG.ENABLE_DEMO_DATA;
    this.businessData = this.generateBusinessData();
  }

  // Check if we should use demo data
  shouldUseDemoData() {
    return shouldUseDemoData();
  }

  // Generate comprehensive business demo data
  generateBusinessData() {
    const currentDate = new Date();
    
    return {
      // Financial metrics
      financialMetrics: {
        totalRevenue: 120450,
        monthlyRevenue: 20070,
        quarterlyRevenue: 58200,
        yearlyRevenue: 120450,
        currency: 'ZAR',
        
        // Revenue breakdown
        revenueByMonth: [
          { month: 'Jan', amount: 16800, growth: 12 },
          { month: 'Feb', amount: 18200, growth: 8 },
          { month: 'Mar', amount: 17500, growth: -4 },
          { month: 'Apr', amount: 19100, growth: 9 },
          { month: 'May', amount: 20070, growth: 5 },
          { month: 'Jun', amount: 21200, growth: 6 },
        ],
        
        // Payment methods breakdown
        paymentMethods: [
          { method: 'Bank Transfer', amount: 9031.50, percentage: 45, transactions: 28 },
          { method: 'BONK', amount: 5017.50, percentage: 25, transactions: 15 },
          { method: 'Cash', amount: 4014.00, percentage: 20, transactions: 12 },
          { method: 'Card', amount: 2007.00, percentage: 10, transactions: 8 },
        ],
        
        // Outstanding amounts
        outstanding: {
          pending: 3250,
          overdue: 1200,
          total: 4450,
        },
        
        // Profit margins
        profitability: {
          grossProfit: 18063, // 90% of revenue (low overhead)
          netProfit: 16056, // 80% of revenue
          expenses: 4014, // 20% of revenue
          profitMargin: 80,
        }
      },

      // Student analytics
      studentAnalytics: {
        totalStudents: 7,
        activeStudents: 7,
        newStudents: 2, // This month
        retentionRate: 95,
        
        // Student distribution
        gradeDistribution: [
          { grade: 'Grade 8', count: 1, percentage: 14 },
          { grade: 'Grade 10', count: 2, percentage: 29 },
          { grade: 'Grade 11', count: 2, percentage: 29 },
          { grade: 'Grade 12', count: 2, percentage: 28 },
        ],
        
        // Subject popularity
        subjectPopularity: [
          { subject: 'Mathematics', students: 6, sessions: 85, revenue: 8500 },
          { subject: 'Physical Sciences', students: 3, sessions: 45, revenue: 4500 },
          { subject: 'Life Sciences', students: 2, sessions: 28, revenue: 2800 },
          { subject: 'Accounting', students: 2, sessions: 35, revenue: 3500 },
          { subject: 'English', students: 3, sessions: 25, revenue: 2500 },
          { subject: 'Natural Sciences', students: 2, sessions: 24, revenue: 2400 },
        ],
        
        // Performance metrics
        performanceMetrics: {
          averageGrade: 81,
          attendanceRate: 91,
          improvementRate: 78, // Students showing improvement
          satisfactionScore: 4.6, // Out of 5
        }
      },

      // Session analytics
      sessionAnalytics: {
        totalSessions: 242,
        monthlySessions: 48,
        averageSessionDuration: 85, // minutes
        
        // Session types
        sessionTypes: [
          { type: 'Individual', count: 180, percentage: 74, revenue: 15750 },
          { type: 'Group', count: 35, percentage: 15, revenue: 2800 },
          { type: 'Online', count: 20, percentage: 8, revenue: 1600 },
          { type: 'Intensive', count: 7, percentage: 3, revenue: 1050 },
        ],
        
        // Peak hours
        peakHours: [
          { hour: '14:00', sessions: 25 },
          { hour: '15:00', sessions: 42 },
          { hour: '16:00', sessions: 38 },
          { hour: '17:00', sessions: 35 },
          { hour: '18:00', sessions: 28 },
          { hour: '19:00', sessions: 15 },
        ],
        
        // Weekly distribution
        weeklyDistribution: [
          { day: 'Monday', sessions: 38, revenue: 3230 },
          { day: 'Tuesday', sessions: 35, revenue: 2975 },
          { day: 'Wednesday', sessions: 42, sessions: 3570 },
          { day: 'Thursday', sessions: 40, revenue: 3400 },
          { day: 'Friday', sessions: 32, revenue: 2720 },
          { day: 'Saturday', sessions: 18, revenue: 1530 },
          { day: 'Sunday', sessions: 8, revenue: 680 },
        ]
      },

      // Business growth metrics
      growthMetrics: {
        monthOverMonth: 5.1, // percentage
        quarterOverQuarter: 12.3,
        yearOverYear: 28.5,
        
        // Key performance indicators
        kpis: [
          { name: 'Revenue per Student', value: 2867, unit: 'ZAR', trend: 'up', change: 8.2 },
          { name: 'Sessions per Student', value: 34.6, unit: 'sessions', trend: 'up', change: 5.1 },
          { name: 'Average Session Value', value: 83, unit: 'ZAR', trend: 'stable', change: 0.5 },
          { name: 'Student Retention', value: 95, unit: '%', trend: 'up', change: 2.1 },
          { name: 'Attendance Rate', value: 91, unit: '%', trend: 'stable', change: -0.3 },
          { name: 'Payment Collection', value: 96, unit: '%', trend: 'up', change: 1.8 },
        ],
        
        // Forecasting
        forecast: {
          nextMonthRevenue: 21073, // 5% growth
          nextQuarterRevenue: 65000,
          yearEndRevenue: 145000,
          confidence: 85, // percentage
        }
      },

      // Operational metrics
      operationalMetrics: {
        // Efficiency metrics
        efficiency: {
          utilizationRate: 78, // percentage of available time slots filled
          cancellationRate: 4, // percentage of sessions cancelled
          rescheduleRate: 8, // percentage of sessions rescheduled
          noShowRate: 2, // percentage of no-shows
        },
        
        // Communication metrics
        communication: {
          parentSatisfaction: 4.7, // out of 5
          responseTime: 2.3, // hours average
          communicationFrequency: 3.2, // contacts per student per month
          issueResolutionTime: 4.1, // hours average
        },
        
        // Technology adoption
        technologyAdoption: {
          onlineSessionsPercentage: 35,
          mobileAppUsage: 89, // percentage of parents using mobile features
          digitalPaymentAdoption: 75, // percentage using digital payments
          bonkAdoption: 25, // percentage using BONK payments
        }
      },

      // Competitive analysis
      marketPosition: {
        marketShare: 12, // percentage in local area
        competitorComparison: [
          { metric: 'Price Competitiveness', score: 85, benchmark: 75 },
          { metric: 'Service Quality', score: 92, benchmark: 80 },
          { metric: 'Technology Innovation', score: 95, benchmark: 65 },
          { metric: 'Customer Satisfaction', score: 91, benchmark: 78 },
          { metric: 'Payment Flexibility', score: 98, benchmark: 45 },
        ],
        
        // Unique selling points
        uniqueSellingPoints: [
          'First education platform with BONK payments',
          'Mobile-first approach with 95% mobile usage',
          'Real-time parent communication and updates',
          'Comprehensive analytics and reporting',
          'Multi-currency support including crypto',
        ]
      }
    };
  }

  // Get demo data for specific component
  getDemoData(component) {
    if (!this.shouldUseDemoData()) return null;
    return this.businessData[component] || null;
  }

  // Get all demo data
  getAllDemoData() {
    if (!this.shouldUseDemoData()) return null;
    return this.businessData;
  }

  // Get financial summary for dashboard
  getFinancialSummary() {
    if (!this.shouldUseDemoData()) return null;
    
    const { financialMetrics, studentAnalytics, sessionAnalytics } = this.businessData;
    
    return {
      revenue: financialMetrics.monthlyRevenue,
      students: studentAnalytics.activeStudents,
      sessions: sessionAnalytics.monthlySessions,
      growth: financialMetrics.revenueByMonth[financialMetrics.revenueByMonth.length - 1].growth,
      profitMargin: financialMetrics.profitability.profitMargin,
      attendanceRate: studentAnalytics.performanceMetrics.attendanceRate,
    };
  }

  // Toggle demo mode
  toggleDemoMode() {
    this.isDemoMode = !this.isDemoMode;
    return this.isDemoMode;
  }

  // Check if demo mode is active
  isDemoModeActive() {
    return this.isDemoMode;
  }
}

// Export singleton instance
export const businessDemoService = new BusinessDemoService();
export default businessDemoService;
