import { useEffect, useState, useCallback } from 'react';
import firebaseService from '../services/firebaseService';

export default function useStudentProfileData(studentId) {
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [allAttendance, setAllAttendance] = useState([]);
  const [marks, setMarks] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [allInvoices, setAllInvoices] = useState([]);
  const [parentLogs, setParentLogs] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const reloadData = useCallback(async () => {
    setLoading(true);
    setError(''); // Clear previous errors

    try {
      // Student - using enhanced Firebase service
      console.log('🔄 Fetching student with ID:', studentId);

      try {
        const studentData = await firebaseService.getStudent(studentId);
        console.log('✅ Student data fetched:', studentData);
        setStudent(studentData);
      } catch (studentError) {
        console.error('❌ Failed to fetch student:', studentError);
        const errorInfo = firebaseService.getErrorInfo(studentError);

        if (studentError.message?.includes('not found')) {
          setError('Student not found.');
        } else if (errorInfo.isCorsError) {
          setError('Connection error: CORS policy issue. Please check your network connection.');
        } else {
          setError(`Failed to load student data: ${errorInfo.message}`);
        }
        setLoading(false);
        return;
      }

      // Attendance - using enhanced Firebase service
      try {
        console.log('🔄 Fetching attendance for student:', studentId);
        const attendanceData = await firebaseService.getAttendanceForStudent(studentId);
        console.log('📊 Raw attendance data:', attendanceData);

        // Process dates and set both recent and all attendance
        const processedAttendance = attendanceData.map(record => {
          console.log('🔄 Processing attendance record:', record);
          return {
            ...record,
            date: record.date?.toDate ? record.date.toDate() : new Date(record.date),
          };
        });

        setAllAttendance(processedAttendance);
        setAttendance(processedAttendance.slice(0, 5)); // Recent 5
        console.log('✅ Attendance processed and set:', {
          total: processedAttendance.length,
          recent: processedAttendance.slice(0, 5).length,
          data: processedAttendance,
        });
      } catch (attendanceError) {
        console.error('❌ Error fetching attendance:', attendanceError);
        setAttendance([]);
        setAllAttendance([]);
      }

      // Calculate attendance summary from fetched data
      try {
        const summary = {};
        const attendanceForSummary = await firebaseService.getAttendanceForStudent(studentId);
        attendanceForSummary.forEach(a => {
          if (!summary[a.sessionType]) summary[a.sessionType] = { count: 0, totalHours: 0 };
          summary[a.sessionType].count += 1;
          summary[a.sessionType].totalHours += Number(a.duration || 0);
        });
        setAttendanceSummary(summary);
        console.log('✅ Attendance summary calculated');
      } catch (summaryError) {
        console.warn('⚠️ Error calculating attendance summary:', summaryError);
        setAttendanceSummary({});
      }

      // Marks - using enhanced Firebase service
      try {
        console.log('🔄 Fetching marks...');
        const marksData = await firebaseService.getMarksForStudent(studentId);
        setMarks(marksData);
        console.log('✅ Marks fetched successfully:', marksData.length, 'records');
      } catch (marksError) {
        console.warn('⚠️ Error fetching marks (non-critical):', marksError);
        setMarks([]);
      }

      // Invoices - using enhanced Firebase service
      try {
        console.log('🔄 Fetching invoices...');
        const recentInvoices = await firebaseService.getInvoicesForStudent(studentId, 5);
        const allInvoicesData = await firebaseService.getInvoicesForStudent(studentId);

        setInvoices(recentInvoices);
        setAllInvoices(allInvoicesData);
        console.log(
          '✅ Invoices fetched successfully:',
          recentInvoices.length,
          'recent,',
          allInvoicesData.length,
          'total'
        );
      } catch (invoicesError) {
        console.warn('⚠️ Error fetching invoices (non-critical):', invoicesError);
        setInvoices([]);
        setAllInvoices([]);
      }

      // Parent Logs - using enhanced Firebase service
      try {
        console.log('🔄 Fetching parent logs...');
        const parentLogsData = await firebaseService.getParentLogsForStudent(studentId);
        setParentLogs(parentLogsData);
        console.log('✅ Parent logs fetched successfully:', parentLogsData.length, 'records');
      } catch (logsError) {
        console.warn('⚠️ Error fetching parent logs (non-critical):', logsError);
        setParentLogs([]);
      }

      // Documents - using enhanced Firebase service
      try {
        console.log('🔄 Fetching documents...');
        const documentsData = await firebaseService.getDocumentsForStudent(studentId);
        setDocuments(documentsData);
        console.log('✅ Documents fetched successfully:', documentsData.length, 'files');

        // Check for CORS errors in documents
        const corsErrors = documentsData.filter(doc => !doc.accessible);
        if (corsErrors.length > 0) {
          console.warn('⚠️ Some documents have CORS access issues:', corsErrors.length, 'files');
        }
      } catch (docsError) {
        console.warn('⚠️ Error fetching documents (non-critical):', docsError);
        const errorInfo = firebaseService.getErrorInfo(docsError);
        if (errorInfo.isCorsError) {
          console.warn('⚠️ CORS error in documents - using fallback handling');
        }
        setDocuments([]);
      }

      console.log('All data fetched successfully');
      setError('');
    } catch (err) {
      console.error('Critical error in data fetching:', err);
      setError(`Failed to fetch student data: ${err.message}`);
    }
    setLoading(false);
  }, [studentId]);

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  return {
    student,
    attendance,
    allAttendance,
    marks,
    invoices,
    allInvoices,
    parentLogs,
    documents,
    attendanceSummary,
    loading,
    error,
    snackbar,
    setSnackbar,
    reloadData,
  };
}
