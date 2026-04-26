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

// Firebase-only service - NO MOCK DATA
class FirebaseService {
  constructor() {
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1 second
  }

  // Generic retry mechanism
  async withRetry(operation, context = '') {
    let lastError;

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        console.warn(`⚠️ ${context} - Attempt ${attempt}/${this.retryAttempts} failed:`, error.message);

        if (attempt < this.retryAttempts) {
          await this.delay(this.retryDelay * attempt);
        }
      }
    }

    console.error(`❌ ${context} - All ${this.retryAttempts} attempts failed. Last error:`, lastError.message);
    throw lastError;
  }

  // Error information helper
  getErrorInfo(error) {
    const errorInfo = {
      message: error.message || 'Unknown error',
      code: error.code || 'unknown',
      isCorsError: false,
      isNetworkError: false,
      isPermissionError: false,
    };

    if (error.message?.includes('CORS') || error.message?.includes('cors')) {
      errorInfo.isCorsError = true;
    }

    if (error.message?.includes('network') || error.message?.includes('fetch')) {
      errorInfo.isNetworkError = true;
    }

    if (error.code === 'permission-denied' || error.message?.includes('permission')) {
      errorInfo.isPermissionError = true;
    }

    return errorInfo;
  }

  // Delay helper
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

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

  // Attendance operations - Firebase only
  async getAttendanceForStudent(studentId) {
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
    return this.withRetry(async () => {
      console.log(
        '🔍 Querying attendance records for studentId:',
        studentId,
        'from',
        startDate,
        'to',
        endDate
      );

      const attendanceRef = collection(db, 'attendance');
      let q = query(
        attendanceRef,
        where('studentId', '==', studentId),
        where('date', '>=', startDate),
        where('date', '<=', endDate),
        orderBy('date', 'desc')
      );

      const snapshot = await getDocs(q);
      const results = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Ensure date is properly formatted
          date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
        };
      });

      console.log(
        '📊 Firebase attendance records query results for student',
        studentId,
        ':',
        results.length,
        'records'
      );
      return results;
    }, `Get Attendance Records for Student ${studentId}`);
  }

  // Add attendance record
  async addAttendanceRecord(attendanceData) {
    return this.withRetry(async () => {
      const attendanceRef = collection(db, 'attendance');
      const docRef = await addDoc(attendanceRef, {
        ...attendanceData,
        createdAt: serverTimestamp(),
      });
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
    }, `Update Attendance Record ${attendanceId}`);
  }

  // Delete attendance record
  async deleteAttendanceRecord(attendanceId) {
    return this.withRetry(async () => {
      const attendanceRef = doc(db, 'attendance', attendanceId);
      await deleteDoc(attendanceRef);
    }, `Delete Attendance Record ${attendanceId}`);
  }

  // Marks operations - Firebase only
  async getMarksForStudent(studentId) {
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
    return this.withRetry(async () => {
      const marksRef = collection(db, 'students', studentId, 'marks');
      const docRef = await addDoc(marksRef, {
        ...markData,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    }, `Add Mark for Student ${studentId}`);
  }

  async updateMarkForStudent(studentId, markId, markData) {
    return this.withRetry(async () => {
      const markRef = doc(db, 'students', studentId, 'marks', markId);
      await updateDoc(markRef, {
        ...markData,
        updatedAt: serverTimestamp(),
      });
    }, `Update Mark for Student ${studentId}`);
  }

  async deleteMarkForStudent(studentId, markId) {
    return this.withRetry(async () => {
      const markRef = doc(db, 'students', studentId, 'marks', markId);
      await deleteDoc(markRef);
    }, `Delete Mark for Student ${studentId}`);
  }

  // Get all marks across all students (for dashboard statistics)
  async getAllMarks() {
    return this.withRetry(async () => {
      console.log('🔍 Querying all marks across all students...');
      const students = await this.getStudents();
      const allMarks = [];

      for (const student of students) {
        try {
          const studentMarks = await this.getMarksForStudent(student.id);
          allMarks.push(...studentMarks.map(mark => ({
            ...mark,
            studentId: student.id,
            studentName: student.name,
          })));
        } catch (error) {
          console.warn(`⚠️ Failed to get marks for student ${student.id}:`, error.message);
        }
      }

      console.log('📊 Total marks retrieved:', allMarks.length);
      return allMarks;
    }, 'Get All Marks');
  }

  // Invoices operations - Firebase only
  async getInvoicesForStudent(studentId, limitCount = null) {
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
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Ensure dates are properly formatted
          invoiceDate: data.invoiceDate?.toDate ? data.invoiceDate.toDate() : new Date(data.invoiceDate),
          dueDate: data.dueDate?.toDate ? data.dueDate.toDate() : new Date(data.dueDate),
        };
      });
    }, `Get Invoices for Student ${studentId}`);
  }

  async createInvoice(invoiceData) {
    return this.withRetry(async () => {
      const invoicesRef = collection(db, 'invoices');
      const docRef = await addDoc(invoicesRef, {
        ...invoiceData,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    }, 'Create Invoice');
  }

  async getAllInvoices(limitCount = null) {
    return this.withRetry(async () => {
      const invoicesRef = collection(db, 'invoices');
      let q = query(invoicesRef, orderBy('invoiceDate', 'desc'));

      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Ensure dates are properly formatted
          invoiceDate: data.invoiceDate?.toDate ? data.invoiceDate.toDate() : new Date(data.invoiceDate),
          dueDate: data.dueDate?.toDate ? data.dueDate.toDate() : new Date(data.dueDate),
        };
      });
    }, 'Get All Invoices');
  }

  async getAllAttendance() {
    return this.withRetry(async () => {
      const attendanceRef = collection(db, 'attendance');
      const q = query(attendanceRef, orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    }, 'Get All Attendance');
  }

  // Parent logs operations - Firebase only
  async getParentLogsForStudent(studentId) {
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
    return this.withRetry(async () => {
      const logsRef = collection(db, 'students', studentId, 'communicationLogs');
      const docRef = await addDoc(logsRef, {
        ...logData,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    }, `Add Parent Log for Student ${studentId}`);
  }

  // Documents operations - Firebase only
  async getDocumentsForStudent(studentId) {
    // For now, return empty array as document storage requires Firebase Storage setup
    console.log('📁 Document storage not yet implemented - returning empty array');
    return [];
  }

  // Enhanced connection test with proper Firebase restoration
  async testConnection() {
    try {
      console.log('🔥 Testing Firebase connection...');

      // Quick check if Firebase services are available
      if (!db) {
        console.log('⚠️ Firebase services not initialized');
        throw new Error('Firebase not initialized');
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
      return true;

    } catch (error) {
      console.warn('⚠️ Firebase connection failed:', error.message);

      // Check for specific error types
      if (error.message.includes('403') || error.message.includes('PERMISSION_DENIED')) {
        console.log('🔧 Permission denied - likely domain configuration issue');
        console.log('💡 Recommendation: Add your domain to Firebase authorized domains');
      }

      throw error;
    }
  }

  // Test if Firebase project exists and is accessible
  async testFirebaseProject() {
    try {
      // This is a basic test - we'll try to access the project
      const testRef = collection(db, 'test');
      await getDocs(query(testRef, limit(1)));
      return true;
    } catch (error) {
      console.warn('Firebase project test failed:', error.message);
      return false;
    }
  }

  // Update invoice with payment information
  async updateInvoicePayment(invoiceId, paymentData) {
    return this.withRetry(async () => {
      const invoiceRef = doc(db, 'invoices', invoiceId);
      await updateDoc(invoiceRef, {
        ...paymentData,
        updatedAt: serverTimestamp(),
      });
    }, `Update Invoice Payment ${invoiceId}`);
  }

  // Get invoice by ID
  async getInvoice(invoiceId) {
    return this.withRetry(async () => {
      const invoiceRef = doc(db, 'invoices', invoiceId);
      const snapshot = await getDoc(invoiceRef);

      if (!snapshot.exists()) {
        throw new Error(`Invoice with ID ${invoiceId} not found`);
      }

      const data = snapshot.data();
      return {
        id: snapshot.id,
        ...data,
        // Ensure dates are properly formatted
        invoiceDate: data.invoiceDate?.toDate ? data.invoiceDate.toDate() : new Date(data.invoiceDate),
        dueDate: data.dueDate?.toDate ? data.dueDate.toDate() : new Date(data.dueDate),
      };
    }, `Get Invoice ${invoiceId}`);
  }

  // Student credit management operations
  async addStudentCredit(studentId, creditData) {
    return this.withRetry(async () => {
      const creditsRef = collection(db, 'students', studentId, 'credits');
      const docRef = await addDoc(creditsRef, {
        ...creditData,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    }, `Add Credit for Student ${studentId}`);
  }

  async getStudentCredits(studentId) {
    return this.withRetry(async () => {
      const creditsRef = collection(db, 'students', studentId, 'credits');
      const q = query(creditsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    }, `Get Credits for Student ${studentId}`);
  }

  async getStudentCredit(creditId) {
    return this.withRetry(async () => {
      // Note: This requires knowing the studentId, but for now we'll search across all students
      // In a real implementation, you'd store the studentId with the creditId
      throw new Error('getStudentCredit requires studentId - use getStudentCredits instead');
    }, `Get Credit ${creditId}`);
  }

  async updateStudentCredit(creditId, creditData) {
    return this.withRetry(async () => {
      // Note: This requires knowing the studentId
      throw new Error('updateStudentCredit requires studentId parameter');
    }, `Update Credit ${creditId}`);
  }

  // Alternative methods that include studentId
  async updateStudentCreditById(studentId, creditId, creditData) {
    return this.withRetry(async () => {
      const creditRef = doc(db, 'students', studentId, 'credits', creditId);
      await updateDoc(creditRef, {
        ...creditData,
        updatedAt: serverTimestamp(),
      });
    }, `Update Credit ${creditId} for Student ${studentId}`);
  }

  async getStudentCreditById(studentId, creditId) {
    return this.withRetry(async () => {
      const creditRef = doc(db, 'students', studentId, 'credits', creditId);
      const snapshot = await getDoc(creditRef);

      if (!snapshot.exists()) {
        throw new Error(`Credit with ID ${creditId} not found for student ${studentId}`);
      }

      return {
        id: snapshot.id,
        ...snapshot.data(),
      };
    }, `Get Credit ${creditId} for Student ${studentId}`);
  }
}

// Create and export singleton instance
const firebaseService = new FirebaseService();
export default firebaseService;
