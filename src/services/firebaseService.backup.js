import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  limit,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
// REMOVED: mockDataService - Firebase only mode

// Firebase-only service - no mock data fallback
class FirebaseService {
  constructor() {
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1 second
    this.firebaseAvailable = null; // null = unknown, true = available, false = unavailable
  }

  // Generic retry mechanism
  async withRetry(operation, context = '') {
    let lastError;

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        console.log(`🔄 Attempting ${context} (attempt ${attempt}/${this.retryAttempts})`);
        const result = await operation();
        console.log(`✅ ${context} successful`);
        return result;
      } catch (error) {
        lastError = error;
        console.warn(`❌ ${context} failed (attempt ${attempt}/${this.retryAttempts}):`, error);

        // Don't retry on certain errors
        if (this.isNonRetryableError(error)) {
          console.error(`🚫 Non-retryable error for ${context}:`, error);
          throw error;
        }

        // Wait before retrying (except on last attempt)
        if (attempt < this.retryAttempts) {
          await this.delay(this.retryDelay * attempt);
        }
      }
    }

    console.error(`🔥 All retry attempts failed for ${context}:`, lastError);
    throw lastError;
  }

  // Check if error should not be retried
  isNonRetryableError(error) {
    const nonRetryableCodes = [
      'permission-denied',
      'not-found',
      'invalid-argument',
      'failed-precondition',
    ];

    return (
      nonRetryableCodes.includes(error.code) ||
      error.message?.includes('CORS') ||
      error.message?.includes('blocked')
    );
  }

  // Delay utility
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // REMOVED: shouldUseMockData method - Firebase only mode

  // PRODUCTION: Removed forceMockDataMode - no longer needed in production

  // Students operations - Firebase only
  async getStudents() {
    return this.withRetry(async () => {
      const studentsRef = collection(db, 'students');
      const snapshot = await getDocs(studentsRef);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    }, 'Get Students');
  }

  async getStudent(studentId) {
    return this.withRetry(async () => {
      const studentRef = doc(db, 'students', studentId);
      const snapshot = await getDoc(studentRef);

      if (!snapshot.exists()) {
        throw new Error(`Student with ID ${studentId} not found`);
      }

      return {
        id: snapshot.id,
        ...snapshot.data(),
      };
    }, `Get Student ${studentId}`);
  }

  async addStudent(studentData) {
    return this.withRetry(async () => {
      const studentsRef = collection(db, 'students');
      const docRef = await addDoc(studentsRef, {
        ...studentData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    }, 'Add Student');
  }

  async updateStudent(studentId, studentData) {
    return this.withRetry(async () => {
      const studentRef = doc(db, 'students', studentId);
      await updateDoc(studentRef, {
        ...studentData,
        updatedAt: serverTimestamp(),
      });
    }, `Update Student ${studentId}`);
  }

  async deleteStudent(studentId) {
    return this.withRetry(async () => {
      const studentRef = doc(db, 'students', studentId);
      await deleteDoc(studentRef);
    }, `Delete Student ${studentId}`);
  }

  // Attendance operations
  async getAttendanceForStudent(studentId) {
    if (await this.shouldUseMockData()) {
      return mockDataService.getAttendanceForStudent(studentId);
    }

    return this.withRetry(async () => {
      console.log('🔍 Querying attendance for studentId:', studentId);
      const attendanceRef = collection(db, 'attendance');
      const q = query(attendanceRef, where('studentId', '==', studentId), orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      const results = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log('📊 Firebase query results for student', studentId, ':', results);
      return results;
    }, `Get Attendance for Student ${studentId}`);
  }

  // Get attendance records for a specific date range (used by billing)
  async getAttendanceRecords(studentId, startDate, endDate) {
    if (await this.shouldUseMockData()) {
      return mockDataService.getAttendanceRecords(studentId, startDate, endDate);
    }

    return this.withRetry(async () => {
      console.log(
        '🔍 Querying attendance records for studentId:',
        studentId,
        'from',
        startDate,
        'to',
        endDate
      );

      // Convert string dates to Date objects for proper comparison
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      // Set end date to end of day to include records from that day
      endDateObj.setHours(23, 59, 59, 999);

      console.log('🔍 Converted dates - Start:', startDateObj, 'End:', endDateObj);

      const attendanceRef = collection(db, 'attendance');
      const q = query(
        attendanceRef,
        where('studentId', '==', studentId),
        where('date', '>=', startDateObj),
        where('date', '<=', endDateObj),
        orderBy('date', 'desc')
      );
      const snapshot = await getDocs(q);
      const results = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Ensure date is properly formatted
        date: doc.data().date?.toDate ? doc.data().date.toDate() : new Date(doc.data().date),
      }));
      console.log('📊 Firebase attendance records query results:', results);
      return results;
    }, `Get Attendance Records for Student ${studentId} (${startDate} to ${endDate})`);
  }

  // Add attendance record
  async addAttendanceRecord(attendanceData) {
    if (await this.shouldUseMockData()) {
      return mockDataService.addAttendanceRecord(attendanceData);
    }

    return this.withRetry(async () => {
      const attendanceRef = collection(db, 'attendance');
      const docRef = await addDoc(attendanceRef, {
        ...attendanceData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log('✅ Attendance record created with ID:', docRef.id);
      return docRef.id;
    }, 'Add Attendance Record');
  }

  // Update attendance record
  async updateAttendanceRecord(attendanceId, attendanceData) {
    return this.withRetry(async () => {
      const attendanceRef = doc(db, 'attendance', attendanceId);
      await updateDoc(attendanceRef, {
        ...attendanceData,
        updatedAt: serverTimestamp(),
      });
      console.log('✅ Attendance record updated:', attendanceId);
    }, `Update Attendance Record ${attendanceId}`);
  }

  // Delete attendance record
  async deleteAttendanceRecord(attendanceId) {
    return this.withRetry(async () => {
      const attendanceRef = doc(db, 'attendance', attendanceId);
      await deleteDoc(attendanceRef);
      console.log('✅ Attendance record deleted:', attendanceId);
    }, `Delete Attendance Record ${attendanceId}`);
  }

  // Marks operations
  async getMarksForStudent(studentId) {
    if (await this.shouldUseMockData()) {
      return mockDataService.getMarksForStudent(studentId);
    }

    return this.withRetry(async () => {
      console.log('🔍 Querying marks for studentId:', studentId);
      const marksRef = collection(db, 'students', studentId, 'marks');
      const q = query(marksRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const results = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log('📊 Firebase marks query results for student', studentId, ':', results);
      return results;
    }, `Get Marks for Student ${studentId}`);
  }

  async addMarkForStudent(studentId, markData) {
    if (await this.shouldUseMockData()) {
      return mockDataService.addMarkForStudent(studentId, markData);
    }

    return this.withRetry(async () => {
      const marksRef = collection(db, 'students', studentId, 'marks');
      const docRef = await addDoc(marksRef, {
        ...markData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log('✅ Mark created with ID:', docRef.id);
      return docRef.id;
    }, `Add Mark for Student ${studentId}`);
  }

  async updateMarkForStudent(studentId, markId, markData) {
    if (await this.shouldUseMockData()) {
      return mockDataService.updateMarkForStudent(studentId, markId, markData);
    }

    return this.withRetry(async () => {
      const markRef = doc(db, 'students', studentId, 'marks', markId);
      await updateDoc(markRef, {
        ...markData,
        updatedAt: serverTimestamp(),
      });
      console.log('✅ Mark updated:', markId);
    }, `Update Mark ${markId} for Student ${studentId}`);
  }

  async deleteMarkForStudent(studentId, markId) {
    if (await this.shouldUseMockData()) {
      return mockDataService.deleteMarkForStudent(studentId, markId);
    }

    return this.withRetry(async () => {
      const markRef = doc(db, 'students', studentId, 'marks', markId);
      await deleteDoc(markRef);
      console.log('✅ Mark deleted:', markId);
    }, `Delete Mark ${markId} for Student ${studentId}`);
  }

  // Get all marks across all students (for dashboard statistics)
  async getAllMarks() {
    if (await this.shouldUseMockData()) {
      return mockDataService.getAllMarks();
    }

    return this.withRetry(async () => {
      console.log('🔍 Querying all marks across all students...');
      const students = await this.getStudents();
      const allMarks = [];

      for (const student of students) {
        try {
          const studentMarks = await this.getMarksForStudent(student.id);
          const marksWithStudentInfo = studentMarks.map(mark => ({
            ...mark,
            studentId: student.id,
            studentName: student.name,
          }));
          allMarks.push(...marksWithStudentInfo);
        } catch (error) {
          console.warn(`⚠️ Could not fetch marks for student ${student.id}:`, error);
        }
      }

      console.log('📊 Total marks retrieved:', allMarks.length);
      return allMarks;
    }, 'Get All Marks');
  }

  // Invoices operations
  async getInvoicesForStudent(studentId, limitCount = null) {
    if (await this.shouldUseMockData()) {
      return mockDataService.getInvoicesForStudent(studentId, limitCount);
    }

    return this.withRetry(async () => {
      const invoicesRef = collection(db, 'invoices');
      let q = query(
        invoicesRef,
        where('studentId', '==', studentId),
        orderBy('invoiceDate', 'desc')
      );

      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        invoiceDate: doc.data().invoiceDate?.toDate
          ? doc.data().invoiceDate.toDate()
          : doc.data().invoiceDate,
      }));
    }, `Get Invoices for Student ${studentId}`);
  }

  async createInvoice(invoiceData) {
    if (await this.shouldUseMockData()) {
      return mockDataService.createInvoice(invoiceData);
    }

    return this.withRetry(async () => {
      const invoicesRef = collection(db, 'invoices');
      const docRef = await addDoc(invoicesRef, {
        ...invoiceData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    }, 'Create Invoice');
  }

  async getAllInvoices(limitCount = null) {
    if (await this.shouldUseMockData()) {
      return mockDataService.getAllInvoices(limitCount);
    }

    return this.withRetry(async () => {
      const invoicesRef = collection(db, 'invoices');
      let q = query(invoicesRef, orderBy('invoiceDate', 'desc'));

      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        invoiceDate: doc.data().invoiceDate?.toDate
          ? doc.data().invoiceDate.toDate()
          : doc.data().invoiceDate,
      }));
    }, 'Get All Invoices');
  }

  async getAllAttendance() {
    if (await this.shouldUseMockData()) {
      return mockDataService.getAllAttendance();
    }

    return this.withRetry(async () => {
      const attendanceRef = collection(db, 'attendance');
      const q = query(attendanceRef, orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate ? doc.data().date.toDate() : doc.data().date,
      }));
    }, 'Get All Attendance');
  }

  // Parent logs operations
  async getParentLogsForStudent(studentId) {
    if (await this.shouldUseMockData()) {
      return mockDataService.getParentLogsForStudent(studentId);
    }

    return this.withRetry(async () => {
      const logsRef = collection(db, 'students', studentId, 'communicationLogs');
      const q = query(logsRef, orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    }, `Get Parent Logs for Student ${studentId}`);
  }

  async addParentLogForStudent(studentId, logData) {
    if (await this.shouldUseMockData()) {
      return mockDataService.addParentLogForStudent(studentId, logData);
    }

    return this.withRetry(async () => {
      const logsRef = collection(db, 'students', studentId, 'communicationLogs');
      const docRef = await addDoc(logsRef, {
        ...logData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    }, `Add Parent Log for Student ${studentId}`);
  }

  // Documents operations with enhanced CORS prevention
  async getDocumentsForStudent(studentId) {
    if (await this.shouldUseMockData()) {
      return mockDataService.getDocumentsForStudent(studentId);
    }

    // If Firebase is not available, return empty array to prevent CORS errors
    if (this.firebaseAvailable === false) {
      console.log('📁 Firebase Storage not available - returning empty documents list');
      return [];
    }

    try {
      // Test Firebase project accessibility first
      const projectAccessible = await this.testFirebaseProject();
      if (!projectAccessible) {
        console.warn('📁 Firebase project not accessible - skipping document fetch');
        return [];
      }

      const {
        getStorage,
        ref: storageRef,
        listAll,
        getDownloadURL,
      } = await import('firebase/storage');
      const storage = getStorage();
      const folderRef = storageRef(storage, `student_documents/${studentId}`);

      const result = await listAll(folderRef);
      const documents = await Promise.all(
        result.items.map(async itemRef => {
          try {
            const url = await getDownloadURL(itemRef);
            return {
              name: itemRef.name,
              url: url,
              fullPath: itemRef.fullPath,
              accessible: true,
            };
          } catch (urlError) {
            console.warn('📁 Error getting download URL for:', itemRef.name, urlError);
            return {
              name: itemRef.name,
              url: null,
              fullPath: itemRef.fullPath,
              accessible: false,
              error: 'Document not accessible',
            };
          }
        })
      );

      console.log('📁 Documents fetched successfully:', documents.length, 'files');
      return documents;
    } catch (error) {
      console.warn('📁 Error accessing Firebase Storage:', error);
      const errorInfo = this.getErrorInfo(error);

      if (errorInfo.isCorsError || error.code === 'storage/project-not-found') {
        console.warn('📁 Firebase Storage not accessible - returning empty list');
        // Mark Firebase as unavailable to prevent future attempts
        this.firebaseAvailable = false;
        this.useMockData = true;
      }

      return [];
    }
  }

  // ENHANCED connection test with proper Firebase restoration
  async testConnection() {
    try {
      console.log('🔥 Testing Firebase connection...');

      // Quick check if Firebase services are available
      if (!db || !auth) {
        console.log('⚠️ Firebase services not initialized - using mock data');
        this.firebaseAvailable = false;
        this.useMockData = true;
        return false;
      }

      // Test Firestore connection with timeout
      const { collection, getDocs, query, limit } = await import('firebase/firestore');

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Connection timeout')), 3000)
      );

      const connectionPromise = (async () => {
        const testQuery = query(collection(db, 'students'), limit(1));
        await getDocs(testQuery);
        return true;
      })();

      await Promise.race([connectionPromise, timeoutPromise]);

      console.log('✅ Firebase connection successful');
      this.firebaseAvailable = true;
      this.useMockData = false;
      return true;

    } catch (error) {
      console.warn('⚠️ Firebase connection failed:', error.message);

      // Check for specific error types
      if (error.message.includes('403') || error.message.includes('PERMISSION_DENIED')) {
        console.log('🔧 Permission denied - likely domain configuration issue');
        console.log('💡 Recommendation: Add your domain to Firebase authorized domains');
      }

      console.log('🔄 Falling back to mock data');
      this.firebaseAvailable = false;
      this.useMockData = true;
      return false;
    }
  }

  // Test if Firebase project exists and is accessible
  async testFirebaseProject() {
    try {
      // Test the auth domain to see if the project exists
      const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
      const response = await fetch(`https://${authDomain}`, {
        method: 'HEAD',
        mode: 'no-cors', // Avoid CORS issues for this test
      });
      return true; // If we get here, the domain is accessible
    } catch (error) {
      console.warn('⚠️ Firebase project domain not accessible:', error.message);
      return false;
    }
  }

  // Get detailed error info
  getErrorInfo(error) {
    return {
      code: error.code || 'unknown',
      message: error.message || 'Unknown error',
      stack: error.stack,
      isCorsError: error.message?.includes('CORS') || error.message?.includes('blocked'),
      isNetworkError: error.message?.includes('network') || error.message?.includes('fetch'),
      isPermissionError: error.code === 'permission-denied',
      timestamp: new Date().toISOString(),
    };
  }
}

// Create and export singleton instance
const firebaseService = new FirebaseService();
export default firebaseService;
