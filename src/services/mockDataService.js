// Mock data service for testing when Firebase is not available
class MockDataService {
  constructor() {
    // PRODUCTION: Empty students array for fresh start
    this.mockStudents = [];

    // PRODUCTION: Empty attendance array for fresh start
    this.mockAttendance = [];

    // PRODUCTION: Empty marks array for fresh start
    this.mockMarks = [];

    // PRODUCTION: Empty invoices array for fresh start
    this.mockInvoices = [];

    // PRODUCTION: Empty parent logs array for fresh start
    this.mockParentLogs = [];

    // PRODUCTION: Empty documents array for fresh start
    this.mockDocuments = [];
  }

  // Simulate async operations
  delay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getStudents() {
    console.log('📝 Using mock data service - getStudents');
    await this.delay();
    // Add computed name property for compatibility
    return this.mockStudents.map(student => ({
      ...student,
      name: `${student.firstName} ${student.lastName}`,
    }));
  }

  async getStudent(studentId) {
    console.log('📝 Using mock data service - getStudent:', studentId);
    await this.delay();
    const student = this.mockStudents.find(s => s.id === studentId);
    if (!student) {
      throw new Error(`Student with ID ${studentId} not found`);
    }
    // Add computed name property for compatibility
    return {
      ...student,
      name: `${student.firstName} ${student.lastName}`,
    };
  }

  async addStudent(studentData) {
    console.log('📝 Using mock data service - addStudent');
    await this.delay();
    const newStudent = {
      id: `student${Date.now()}`,
      ...studentData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.mockStudents.push(newStudent);
    return newStudent.id;
  }

  async updateStudent(studentId, studentData) {
    console.log('📝 Using mock data service - updateStudent:', studentId);
    await this.delay();
    const index = this.mockStudents.findIndex(s => s.id === studentId);
    if (index === -1) {
      throw new Error(`Student with ID ${studentId} not found`);
    }
    this.mockStudents[index] = {
      ...this.mockStudents[index],
      ...studentData,
      updatedAt: new Date(),
    };
  }

  async deleteStudent(studentId) {
    console.log('📝 Using mock data service - deleteStudent:', studentId);
    await this.delay();
    const index = this.mockStudents.findIndex(s => s.id === studentId);
    if (index === -1) {
      throw new Error(`Student with ID ${studentId} not found`);
    }
    this.mockStudents.splice(index, 1);
  }

  async getAttendanceForStudent(studentId) {
    console.log('📝 Using mock data service - getAttendanceForStudent:', studentId);
    await this.delay();
    return this.mockAttendance.filter(a => a.studentId === studentId);
  }

  async getAttendanceRecords(studentId, startDate, endDate) {
    console.log(
      '📝 Using mock data service - getAttendanceRecords:',
      studentId,
      'from',
      startDate,
      'to',
      endDate
    );
    await this.delay();

    const start = new Date(startDate);
    const end = new Date(endDate);

    console.log('📝 Date range:', start, 'to', end);
    console.log(
      '📝 Available attendance records for student:',
      this.mockAttendance.filter(a => a.studentId === studentId)
    );

    const filteredRecords = this.mockAttendance.filter(a => {
      if (a.studentId !== studentId) return false;
      const recordDate = new Date(a.date);
      const inRange = recordDate >= start && recordDate <= end;
      console.log('📝 Record date:', recordDate, 'in range:', inRange);
      return inRange;
    });

    console.log('📝 Filtered attendance records:', filteredRecords);
    return filteredRecords;
  }

  async addAttendanceRecord(attendanceData) {
    console.log('📝 Using mock data service - addAttendanceRecord:', attendanceData);
    await this.delay();

    const newRecord = {
      id: `attendance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...attendanceData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.mockAttendance.push(newRecord);
    return newRecord.id;
  }

  async getMarksForStudent(studentId) {
    console.log('📝 Using mock data service - getMarksForStudent:', studentId);
    await this.delay();
    return this.mockMarks.filter(m => m.studentId === studentId);
  }

  async addMarkForStudent(studentId, markData) {
    console.log('📝 Using mock data service - addMarkForStudent:', studentId, markData);
    await this.delay();

    const newMark = {
      id: `mark${Date.now()}`,
      studentId: studentId,
      ...markData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.mockMarks.push(newMark);
    return newMark.id;
  }

  async updateMarkForStudent(studentId, markId, markData) {
    console.log('📝 Using mock data service - updateMarkForStudent:', studentId, markId, markData);
    await this.delay();

    const markIndex = this.mockMarks.findIndex(m => m.id === markId && m.studentId === studentId);
    if (markIndex === -1) {
      throw new Error(`Mark with ID ${markId} not found for student ${studentId}`);
    }

    this.mockMarks[markIndex] = {
      ...this.mockMarks[markIndex],
      ...markData,
      updatedAt: new Date(),
    };

    return this.mockMarks[markIndex];
  }

  async deleteMarkForStudent(studentId, markId) {
    console.log('📝 Using mock data service - deleteMarkForStudent:', studentId, markId);
    await this.delay();

    const markIndex = this.mockMarks.findIndex(m => m.id === markId && m.studentId === studentId);
    if (markIndex === -1) {
      throw new Error(`Mark with ID ${markId} not found for student ${studentId}`);
    }

    this.mockMarks.splice(markIndex, 1);
    return true;
  }

  async getAllMarks() {
    console.log('📝 Using mock data service - getAllMarks');
    await this.delay();

    // Add student information to marks for dashboard statistics
    const students = await this.getStudents();
    const allMarks = this.mockMarks.map(mark => {
      const student = students.find(s => s.id === mark.studentId);
      return {
        ...mark,
        studentName: student ? student.name : 'Unknown Student',
      };
    });

    return allMarks;
  }

  async getInvoicesForStudent(studentId, limit = null) {
    console.log('📝 Using mock data service - getInvoicesForStudent:', studentId);
    await this.delay();
    const invoices = this.mockInvoices.filter(i => i.studentId === studentId);
    return limit ? invoices.slice(0, limit) : invoices;
  }

  async getAllInvoices(limit = null) {
    console.log('📝 Using mock data service - getAllInvoices');
    await this.delay();
    const invoices = [...this.mockInvoices];
    return limit ? invoices.slice(0, limit) : invoices;
  }

  async getAllAttendance() {
    console.log('📝 Using mock data service - getAllAttendance');
    await this.delay();
    return [...this.mockAttendance];
  }

  async createInvoice(invoiceData) {
    console.log('📝 Using mock data service - createInvoice:', invoiceData);
    await this.delay();
    const newInvoice = {
      id: `inv${Date.now()}`,
      invoiceNumber: `INV-${String(this.mockInvoices.length + 1).padStart(3, '0')}`,
      ...invoiceData,
      // Ensure invoiceDate is present if not provided
      invoiceDate: invoiceData.invoiceDate || new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.mockInvoices.push(newInvoice);
    console.log('📝 Created mock invoice:', newInvoice);
    return newInvoice.id;
  }

  async getParentLogsForStudent(studentId) {
    console.log('📝 Using mock data service - getParentLogsForStudent:', studentId);
    await this.delay();
    return this.mockParentLogs.filter(l => l.studentId === studentId);
  }

  async addParentLogForStudent(studentId, logData) {
    console.log('📝 Using mock data service - addParentLogForStudent:', studentId, logData);
    await this.delay();

    const newLog = {
      id: `log${Date.now()}`,
      studentId: studentId,
      ...logData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.mockParentLogs.push(newLog);
    return newLog.id;
  }

  async getDocumentsForStudent(studentId) {
    console.log('📝 Using mock data service - getDocumentsForStudent:', studentId);
    await this.delay();
    return this.mockDocuments.filter(d => d.studentId === studentId);
  }

  async testConnection() {
    console.log('📝 Mock data service - connection test');
    await this.delay(100);
    return true;
  }

  getErrorInfo(error) {
    return {
      code: 'mock-error',
      message: error.message || 'Mock service error',
      stack: error.stack,
      isCorsError: false,
      isNetworkError: false,
      isPermissionError: false,
      timestamp: new Date().toISOString(),
    };
  }

  // Mock authentication methods
  async signInWithEmailAndPassword(email, password) {
    console.log('📝 Mock authentication - signInWithEmailAndPassword:', email);
    await this.delay(500); // Simulate network delay

    // Mock user credentials for testing
    const mockUsers = {
      'dalraealimohamed@gmail.com': {
        uid: 'mock-user-1',
        email: 'dalraealimohamed@gmail.com',
        displayName: 'Mock User',
        emailVerified: true,
      },
      'yourmail@gmail.com': {
        uid: 'mock-user-2',
        email: 'yourmail@gmail.com',
        displayName: 'Test User',
        emailVerified: true,
      },
      'admin@test.com': {
        uid: 'mock-admin-1',
        email: 'admin@test.com',
        displayName: 'Mock Admin',
        emailVerified: true,
      },
    };

    // Check if email exists in mock users
    if (mockUsers[email]) {
      // For mock mode, accept any password
      return {
        user: mockUsers[email],
        credential: null,
      };
    } else {
      // Simulate Firebase auth error for unknown users
      throw new Error('Firebase: Error (auth/user-not-found)');
    }
  }

  async signInWithPopup(provider) {
    console.log('📝 Mock authentication - signInWithPopup');
    await this.delay(1000); // Simulate Google sign-in delay

    // Return mock Google user
    return {
      user: {
        uid: 'mock-google-user-1',
        email: 'mockuser@gmail.com',
        displayName: 'Mock Google User',
        photoURL: 'https://via.placeholder.com/150',
        emailVerified: true,
        providerData: [
          {
            providerId: 'google.com',
            uid: 'mock-google-uid',
            displayName: 'Mock Google User',
            email: 'mockuser@gmail.com',
            photoURL: 'https://via.placeholder.com/150',
          },
        ],
      },
      credential: null,
      operationType: 'signIn',
    };
  }

  async signOut() {
    console.log('📝 Mock authentication - signOut');
    await this.delay(200);
    return Promise.resolve();
  }

  // Mock user profile service
  async getUserProfile(uid) {
    console.log('📝 Mock authentication - getUserProfile:', uid);
    await this.delay(300);

    // Return mock user profile based on UID
    const mockProfiles = {
      'mock-user-1': {
        uid: 'mock-user-1',
        email: 'dalraealimohamed@gmail.com',
        role: 'admin',
        permissions: ['all'],
        roleInfo: {
          name: 'Administrator',
          permissions: ['all'],
          canManageUsers: true,
          canAccessBusiness: true,
        },
        createdAt: new Date('2024-01-01'),
        lastLogin: new Date(),
      },
      'mock-user-2': {
        uid: 'mock-user-2',
        email: 'yourmail@gmail.com',
        role: 'tutor',
        permissions: ['students', 'attendance', 'reports', 'dashboard'],
        roleInfo: {
          name: 'Tutor',
          permissions: ['students', 'attendance', 'reports', 'dashboard'],
          canManageUsers: false,
          canAccessBusiness: false,
        },
        createdAt: new Date('2024-01-01'),
        lastLogin: new Date(),
      },
      'mock-admin-1': {
        uid: 'mock-admin-1',
        email: 'admin@test.com',
        role: 'admin',
        permissions: ['all'],
        roleInfo: {
          name: 'Administrator',
          permissions: ['all'],
          canManageUsers: true,
          canAccessBusiness: true,
        },
        createdAt: new Date('2024-01-01'),
        lastLogin: new Date(),
      },
      'mock-google-user-1': {
        uid: 'mock-google-user-1',
        email: 'mockuser@gmail.com',
        role: 'tutor',
        permissions: ['students', 'attendance', 'reports', 'dashboard'],
        roleInfo: {
          name: 'Tutor',
          permissions: ['students', 'attendance', 'reports', 'dashboard'],
          canManageUsers: false,
          canAccessBusiness: false,
        },
        createdAt: new Date('2024-01-01'),
        lastLogin: new Date(),
      },
    };

    return mockProfiles[uid] || null;
  }
}

// Create and export singleton instance
const mockDataService = new MockDataService();
export default mockDataService;
