// Mobile Demo Service - Rich data for mobile demonstrations
import { isMobile, shouldUseDemoData, DEMO_CONFIG } from '../config/mobileConfig';

class MobileDemoService {
  constructor() {
    this.isDemoMode = DEMO_CONFIG.ENABLE_DEMO_DATA; // Use config setting
    this.demoData = this.generateDemoData();
  }

  // Check if we should use demo data
  shouldUseDemoData() {
    return shouldUseDemoData();
  }

  // Generate comprehensive demo data
  generateDemoData() {
    return {
      // Dashboard metrics for mobile
      dashboardMetrics: {
        totalStudents: 7,
        activeStudents: 7,
        totalSessions: 242,
        monthlyRevenue: 20070,
        currency: 'ZAR',
        attendanceRate: 91,
        averageGrade: 81,
        upcomingSessions: 9,
        overdueInvoices: 1,
        recentActivity: [
          {
            id: 1,
            type: 'session',
            message: 'Arjun Singh completed Mathematics session',
            time: '2 hours ago',
            icon: '📚'
          },
          {
            id: 2,
            type: 'payment',
            message: 'Payment received from Zara Patel (BONK)',
            time: '4 hours ago',
            icon: '🐕'
          },
          {
            id: 3,
            type: 'achievement',
            message: 'Liam van der Merwe scored 95% in Accounting test',
            time: '1 day ago',
            icon: '🏆'
          },
          {
            id: 4,
            type: 'communication',
            message: 'WhatsApp message from Dr. Chioma Okafor',
            time: '2 days ago',
            icon: '💬'
          }
        ]
      },

      // Mobile analytics data
      mobileAnalytics: {
        weeklyAttendance: [
          { day: 'Mon', sessions: 8, attended: 7 },
          { day: 'Tue', sessions: 6, attended: 6 },
          { day: 'Wed', sessions: 9, attended: 8 },
          { day: 'Thu', sessions: 7, attended: 7 },
          { day: 'Fri', sessions: 5, attended: 5 },
          { day: 'Sat', sessions: 3, attended: 2 },
          { day: 'Sun', sessions: 2, attended: 2 }
        ],
        subjectPerformance: [
          { subject: 'Mathematics', average: 82, sessions: 45, color: '#FF6B35' },
          { subject: 'Physical Sciences', average: 78, sessions: 32, color: '#4ECDC4' },
          { subject: 'Life Sciences', average: 85, sessions: 28, color: '#45B7D1' },
          { subject: 'Accounting', average: 80, sessions: 25, color: '#96CEB4' },
          { subject: 'English', average: 83, sessions: 20, color: '#FFEAA7' }
        ],
        monthlyRevenue: [
          { month: 'Jan', amount: 16800, currency: 'ZAR' },
          { month: 'Feb', amount: 18200, currency: 'ZAR' },
          { month: 'Mar', amount: 17500, currency: 'ZAR' },
          { month: 'Apr', amount: 19100, currency: 'ZAR' },
          { month: 'May', amount: 18750, currency: 'ZAR' }
        ],
        paymentMethods: [
          { method: 'Bank Transfer', percentage: 45, amount: 8437.50 },
          { method: 'BONK', percentage: 25, amount: 4687.50 },
          { method: 'Cash', percentage: 20, amount: 3750.00 },
          { method: 'Card', percentage: 10, amount: 1875.00 }
        ]
      },

      // Quick actions for mobile
      quickActions: [
        {
          id: 'add_attendance',
          title: 'Mark Attendance',
          description: 'Quick attendance entry',
          icon: 'Assessment',
          color: '#4ECDC4',
          route: '/attendance'
        },
        {
          id: 'add_marks',
          title: 'Add Marks',
          description: 'Record student marks',
          icon: 'School',
          color: '#45B7D1',
          route: '/students'
        },
        {
          id: 'crypto_payment',
          title: 'Crypto Payment',
          description: 'BONK & SOL payments',
          icon: 'BonkLogo',
          color: '#FF6B35',
          route: '/bonk-showcase'
        },
        {
          id: 'contact_parent',
          title: 'Contact Parent',
          description: 'WhatsApp or call parent',
          icon: 'ContactPhone',
          color: '#96CEB4',
          action: 'contact'
        },
        {
          id: 'generate_report',
          title: 'Generate Report',
          description: 'Student progress report',
          icon: 'Description',
          color: '#FFEAA7',
          route: '/reports'
        },
        {
          id: 'billing_dashboard',
          title: 'Billing',
          description: 'Invoices & payments',
          icon: 'AccountBalance',
          color: '#DDA0DD',
          route: '/billing'
        }
      ],

      // Mobile notifications
      notifications: [
        {
          id: 1,
          title: 'Session Reminder',
          message: 'Zara Patel - Mathematics session in 30 minutes',
          type: 'reminder',
          time: new Date(Date.now() + 30 * 60 * 1000),
          priority: 'high',
          actionable: true
        },
        {
          id: 2,
          title: 'Payment Received',
          message: '🐕 BONK payment confirmed - R350 from Arjun Singh',
          type: 'payment',
          time: new Date(Date.now() - 2 * 60 * 60 * 1000),
          priority: 'medium',
          actionable: false
        },
        {
          id: 3,
          title: 'New Message',
          message: 'WhatsApp from Sarah van der Merwe about schedule change',
          type: 'communication',
          time: new Date(Date.now() - 4 * 60 * 60 * 1000),
          priority: 'medium',
          actionable: true
        },
        {
          id: 4,
          title: 'Achievement Unlocked',
          message: 'Liam achieved 90%+ attendance this month! 🏆',
          type: 'achievement',
          time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          priority: 'low',
          actionable: false
        }
      ],

      // Mobile-optimized student cards
      studentCards: [
        {
          id: 'student_1',
          name: 'Amara Okafor',
          grade: 'Grade 12',
          avatar: '👩🏾‍🎓',
          status: 'active',
          nextSession: 'Today 3:00 PM',
          subject: 'Mathematics',
          progress: 78,
          attendance: 92,
          lastPayment: 'BONK - 2 days ago',
          urgentFlags: []
        },
        {
          id: 'student_2',
          name: 'Liam van der Merwe',
          grade: 'Grade 11',
          avatar: '👨🏼‍🎓',
          status: 'active',
          nextSession: 'Tomorrow 2:00 PM',
          subject: 'Accounting',
          progress: 82,
          attendance: 88,
          lastPayment: 'Bank Transfer - 1 week ago',
          urgentFlags: []
        },
        {
          id: 'student_3',
          name: 'Zara Patel',
          grade: 'Grade 10',
          avatar: '👩🏽‍🎓',
          status: 'active',
          nextSession: 'Today 4:30 PM',
          subject: 'Natural Sciences',
          progress: 85,
          attendance: 95,
          lastPayment: 'BONK - Today',
          urgentFlags: []
        },
        {
          id: 'student_4',
          name: 'Thabo Mthembu',
          grade: 'Grade 12',
          avatar: '👨🏿‍🎓',
          status: 'active',
          nextSession: 'Friday 3:30 PM',
          subject: 'Physical Sciences',
          progress: 76,
          attendance: 90,
          lastPayment: 'Cash - 3 days ago',
          urgentFlags: []
        },
        {
          id: 'student_5',
          name: 'Emma Johnson',
          grade: 'Grade 11',
          avatar: '👩🏻‍🎓',
          status: 'active',
          nextSession: 'Tomorrow 1:00 PM',
          subject: 'English',
          progress: 79,
          attendance: 87,
          lastPayment: 'Card - 1 week ago',
          urgentFlags: ['payment_overdue']
        },
        {
          id: 'student_6',
          name: 'Arjun Singh',
          grade: 'Grade 10',
          avatar: '👨🏽‍🎓',
          status: 'active',
          nextSession: 'Today 5:00 PM',
          subject: 'Computer Applications',
          progress: 88,
          attendance: 93,
          lastPayment: 'BONK - Today',
          urgentFlags: [],
          siblingId: 'student_7'
        },
        {
          id: 'student_7',
          name: 'Anaya Singh',
          grade: 'Grade 8',
          avatar: '👩🏽‍🎓',
          status: 'active',
          nextSession: 'Tomorrow 4:00 PM',
          subject: 'Natural Sciences',
          progress: 84,
          attendance: 89,
          lastPayment: 'Family Plan - Today',
          urgentFlags: [],
          siblingId: 'student_6'
        }
      ],

      // Mobile session summary
      todaySessions: [
        {
          id: 1,
          time: '15:00',
          student: 'Amara Okafor',
          subject: 'Mathematics',
          duration: 90,
          type: 'Individual',
          status: 'upcoming',
          location: 'Online'
        },
        {
          id: 2,
          time: '16:30',
          student: 'Zara Patel',
          subject: 'Natural Sciences',
          duration: 60,
          type: 'Individual',
          status: 'upcoming',
          location: 'In-Person'
        },
        {
          id: 3,
          time: '17:00',
          student: 'Arjun Singh',
          subject: 'Computer Applications',
          duration: 90,
          type: 'Individual',
          status: 'upcoming',
          location: 'Online'
        }
      ]
    };
  }

  // Get demo data for specific component
  getDemoData(component) {
    if (!this.shouldUseDemoData()) return null;
    return this.demoData[component] || null;
  }

  // Get all demo data
  getAllDemoData() {
    if (!this.shouldUseDemoData()) return null;
    return this.demoData;
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
export const mobileDemoService = new MobileDemoService();
export default mobileDemoService;
