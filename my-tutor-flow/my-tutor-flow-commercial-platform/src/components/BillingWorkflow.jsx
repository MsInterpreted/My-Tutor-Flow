import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Chip,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import {
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Receipt as ReceiptIcon,
  CheckCircle as CheckIcon,
  Groups as FamilyIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';
import firebaseService from '../services/firebaseService';
import currencyService from '../services/currencyService';
import { getCurrency, formatCurrency } from '../config/currencyConfig';
// PRODUCTION: Removed test imports

const steps = [
  'Select Period & Students',
  'Review Attendance Data',
  'Configure Rates',
  'Generate Invoices',
];

function BillingWorkflow({ onInvoiceCreated }) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [startDate, setStartDate] = useState(dayjs('2025-06-01'));
  const [endDate, setEndDate] = useState(dayjs('2025-06-30'));
  const [attendanceData, setAttendanceData] = useState([]);
  const [rates, setRates] = useState({
    online: 25,
    in_person_class: 30,
    in_person_one_on_one: 40,
  });
  const [invoicePreview, setInvoicePreview] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [invoiceMode, setInvoiceMode] = useState('individual'); // 'individual' or 'consolidated'
  const [siblingGroups, setSiblingGroups] = useState([]);
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [availableGrades, setAvailableGrades] = useState([]);

  // Sibling detection and billing preferences
  const [siblingDialogOpen, setSiblingDialogOpen] = useState(false);
  const [detectedSiblings, setDetectedSiblings] = useState([]);
  const [currentSiblingGroup, setCurrentSiblingGroup] = useState(null);
  const [billingPreferences, setBillingPreferences] = useState({});
  const [familyBillingDecisions, setFamilyBillingDecisions] = useState({});

  useEffect(() => {
    // PRODUCTION: Removed mock data URL parameter functionality

    // Load saved billing preferences
    const savedPreferences = localStorage.getItem('billingPreferences');
    if (savedPreferences) {
      try {
        setBillingPreferences(JSON.parse(savedPreferences));
      } catch (error) {
        console.warn('Failed to load billing preferences:', error);
      }
    }

    loadStudents();
  }, []);

  // Save billing preferences to localStorage
  useEffect(() => {
    if (Object.keys(billingPreferences).length > 0) {
      localStorage.setItem('billingPreferences', JSON.stringify(billingPreferences));
    }
  }, [billingPreferences]);

  const loadStudents = async () => {
    try {
      const studentsData = await firebaseService.getStudents();
      console.log('📚 Loaded students:', studentsData);

      // Debug: Check for Alice and Emma Smith specifically
      const alice = studentsData.find(s => s.firstName === 'Alice' && s.lastName === 'Smith');
      const emma = studentsData.find(s => s.firstName === 'Emma' && s.lastName === 'Smith');
      console.log('🔍 Alice Smith found:', alice);
      console.log('🔍 Emma Smith found:', emma);

      if (alice && emma) {
        console.log('🔍 Alice parent email:', alice.parentEmail);
        console.log('🔍 Emma parent email:', emma.parentEmail);
        console.log('🔍 Parent emails match:', alice.parentEmail === emma.parentEmail);
      }

      setStudents(studentsData);
      detectSiblings(studentsData);

      // Extract unique grades for filtering
      const grades = [...new Set(studentsData.map(s => s.grade))].sort();
      setAvailableGrades(grades);
      console.log('📚 Available grades:', grades);
    } catch (error) {
      console.error('Error loading students:', error);
      setError('Failed to load students');
    }
  };

  const detectSiblings = studentsData => {
    console.log('👨‍👩‍👧‍👦 Detecting siblings from students:', studentsData);

    // Group students by parent email
    const parentGroups = {};
    studentsData.forEach(student => {
      const parentEmail = student.parentEmail || student.parentPhone;
      if (parentEmail) {
        if (!parentGroups[parentEmail]) {
          parentGroups[parentEmail] = [];
        }
        parentGroups[parentEmail].push(student);
      }
    });

    // Filter groups with more than one student (siblings)
    const siblings = Object.entries(parentGroups)
      .filter(([_, students]) => students.length > 1)
      .map(([parentContact, students]) => ({
        parentContact,
        parentName: students[0].parentName,
        parentEmail: students[0].parentEmail,
        students: students,
      }));

    console.log('👨‍👩‍👧‍👦 Detected sibling groups:', siblings);
    setSiblingGroups(siblings);
  };

  const handleNext = async () => {
    setError('');

    if (activeStep === 0) {
      // Validate period and students selection
      if (selectedStudents.length === 0) {
        setError('Please select at least one student');
        return;
      }
      if (!startDate || !endDate) {
        setError('Please select both start and end dates');
        return;
      }
      if (endDate.isBefore(startDate)) {
        setError('End date must be after start date');
        return;
      }

      // Load attendance data
      await loadAttendanceData();
    } else if (activeStep === 1) {
      // Generate invoice preview
      generateInvoicePreview();
    } else if (activeStep === 2) {
      // Create invoices
      await createInvoices();
      return; // Don't increment step, we're done
    }

    setActiveStep(prevStep => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };

  const loadAttendanceData = async (onComplete = null) => {
    setLoading(true);
    try {
      console.log('🔍 Loading attendance data for students:', selectedStudents);
      console.log(
        '🔍 Date range:',
        startDate.format('YYYY-MM-DD'),
        'to',
        endDate.format('YYYY-MM-DD')
      );

      const attendancePromises = selectedStudents.map(async studentId => {
        console.log('🔍 Fetching attendance for student:', studentId);
        const records = await firebaseService.getAttendanceRecords(
          studentId,
          startDate.format('YYYY-MM-DD'),
          endDate.format('YYYY-MM-DD')
        );
        console.log('📊 Attendance records for student', studentId, ':', records);
        return {
          studentId,
          student: students.find(s => s.id === studentId),
          records,
        };
      });

      const data = await Promise.all(attendancePromises);
      console.log('📊 Final attendance data:', data);
      setAttendanceData(data);

      // Call completion callback if provided
      if (onComplete) {
        await onComplete(data);
      }
    } catch (error) {
      console.error('Error loading attendance:', error);
      setError('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const generateInvoicePreview = () => {
    console.log('💰 ========== INVOICE PREVIEW GENERATION START ==========');
    console.log('💰 Attendance data:', attendanceData);
    console.log('💰 Invoice mode:', invoiceMode);
    console.log('💰 Selected students:', selectedStudents);
    console.log('💰 Sibling groups:', siblingGroups);
    console.log('💰 Rates:', rates);
    console.log(
      '💰 Date range:',
      startDate?.format('YYYY-MM-DD'),
      'to',
      endDate?.format('YYYY-MM-DD')
    );

    // Validate prerequisites
    if (!attendanceData || attendanceData.length === 0) {
      console.error('💰 ERROR: No attendance data available for invoice generation');
      setError(
        'No attendance data available. Please ensure students have attendance records in the selected period.'
      );
      return;
    }

    if (invoiceMode === 'individual') {
      console.log('💰 Generating individual invoices...');
      generateIndividualInvoices();
    } else {
      console.log('💰 Generating consolidated invoices...');
      generateConsolidatedInvoices();
    }

    console.log('💰 ========== INVOICE PREVIEW GENERATION END ==========');
  };

  const generateInvoicePreviewFromData = attendanceDataParam => {
    console.log('⚡ Generating invoice preview from provided data:', attendanceDataParam);

    if (invoiceMode === 'individual') {
      return generateIndividualInvoicesFromData(attendanceDataParam);
    } else {
      return generateConsolidatedInvoicesFromData(attendanceDataParam);
    }
  };

  const generateIndividualInvoicesFromData = attendanceDataParam => {
    const preview = attendanceDataParam
      .map(({ studentId, student, records }) => {
        const studentName =
          student?.name || `${student?.firstName} ${student?.lastName}` || 'Unknown Student';
        console.log(
          '⚡ Processing individual invoice for student:',
          studentName,
          'with records:',
          records
        );

        const sessionTotals = {
          online: 0,
          in_person_class: 0,
          in_person_one_on_one: 0,
        };

        records.forEach(record => {
          console.log(
            '⚡ Processing record:',
            record,
            'Status:',
            record.status,
            'SessionType:',
            record.sessionType
          );
          if (record.status === 'present') {
            if (sessionTotals.hasOwnProperty(record.sessionType)) {
              sessionTotals[record.sessionType] += record.duration || 1;
              console.log(
                '⚡ Added to totals:',
                record.sessionType,
                record.duration || 1,
                'New total:',
                sessionTotals[record.sessionType]
              );
            } else {
              console.error(
                '⚡ Unknown session type:',
                record.sessionType,
                'Available types:',
                Object.keys(sessionTotals)
              );
            }
          } else {
            console.log('⚡ Skipped record due to status:', record.status);
          }
        });

        console.log('⚡ Session totals for', studentName, ':', sessionTotals);

        const lineItems = Object.entries(sessionTotals)
          .filter(([_, hours]) => hours > 0)
          .map(([sessionType, hours]) => {
            const rate = rates[sessionType];
            if (!rate) {
              console.error(
                '⚡ No rate found for session type:',
                sessionType,
                'Available rates:',
                rates
              );
            }
            console.log('⚡ Creating line item:', {
              sessionType,
              hours,
              rate,
              total: hours * rate,
            });
            const studentCurrency = student.preferredCurrency || 'ZAR';
            const total = hours * (rate || 0);

            return {
              sessionType,
              hours,
              rate: rate || 0,
              total: total,
              currency: studentCurrency,
              formattedRate: formatCurrency(rate || 0, studentCurrency),
              formattedTotal: formatCurrency(total, studentCurrency),
            };
          });

        const totalAmount = lineItems.reduce((sum, item) => sum + item.total, 0);

        console.log('⚡ Line items for', studentName, ':', lineItems, 'Total:', totalAmount);

        const studentCurrency = student.preferredCurrency || 'ZAR';
        const currencyInfo = getCurrency(studentCurrency);

        return {
          studentId,
          student: {
            ...student,
            name: studentName,
            preferredCurrency: studentCurrency,
            currencySymbol: currencyInfo.symbol,
          },
          lineItems,
          totalAmount,
          currency: studentCurrency,
          formattedTotalAmount: formatCurrency(totalAmount, studentCurrency),
          period: `${startDate.format('MMM DD')} - ${endDate.format('MMM DD, YYYY')}`,
          invoiceType: 'individual',
        };
      })
      .filter(invoice => invoice.totalAmount > 0);

    console.log('⚡ Final individual invoice preview:', preview);
    return preview;
  };

  const generateConsolidatedInvoicesFromData = attendanceDataParam => {
    console.log('⚡ Generating intelligent consolidated invoices...');
    console.log('⚡ Family billing decisions:', familyBillingDecisions);
    console.log('⚡ Sibling groups:', siblingGroups);

    const consolidatedInvoices = [];
    const processedStudents = new Set();

    // Process intelligent family billing decisions first
    Object.entries(familyBillingDecisions).forEach(([familyKey, decision]) => {
      console.log(`⚡🏠 Processing family billing decision for ${familyKey}:`, decision);

      const familyStudentIds = decision.students.map(s => s.id);
      const familyAttendance = attendanceDataParam.filter(({ studentId }) =>
        familyStudentIds.includes(studentId)
      );

      if (familyAttendance.length === 0) return;

      let totalAmount = 0;
      const childrenDetails = [];

      familyAttendance.forEach(({ studentId, student, records }) => {
        processedStudents.add(studentId);
        const studentName =
          student?.name || `${student?.firstName} ${student?.lastName}` || 'Unknown Student';

        const sessionTotals = {
          online: 0,
          in_person_class: 0,
          in_person_one_on_one: 0,
        };

        records.forEach(record => {
          if (record.status === 'present' && sessionTotals.hasOwnProperty(record.sessionType)) {
            sessionTotals[record.sessionType] += record.duration || 1;
          }
        });

        const lineItems = Object.entries(sessionTotals)
          .filter(([_, hours]) => hours > 0)
          .map(([sessionType, hours]) => ({
            sessionType,
            hours,
            rate: rates[sessionType] || 0,
            total: hours * (rates[sessionType] || 0),
          }));

        const childTotal = lineItems.reduce((sum, item) => sum + item.total, 0);
        totalAmount += childTotal;

        if (childTotal > 0) {
          childrenDetails.push({
            student: {
              ...student,
              name: studentName,
            },
            lineItems,
            total: childTotal,
          });
        }
      });

      if (totalAmount > 0) {
        consolidatedInvoices.push({
          studentId: decision.primaryStudent.id,
          student: {
            name: `${decision.primaryStudent.parentName} Family`,
            parentName: decision.primaryStudent.parentName,
            parentEmail: decision.primaryStudent.parentEmail,
          },
          lineItems: childrenDetails,
          totalAmount,
          period: `${startDate.format('MMM DD')} - ${endDate.format('MMM DD, YYYY')}`,
          invoiceType: 'consolidated',
          billingType: decision.type,
          children: decision.students,
        });
      }
    });

    // Process sibling groups first
    siblingGroups.forEach(group => {
      const groupAttendance = attendanceDataParam.filter(({ studentId }) =>
        group.students.some(s => s.id === studentId)
      );

      if (groupAttendance.length === 0) return;

      console.log(
        '⚡ Processing sibling group:',
        group.parentName,
        'with attendance:',
        groupAttendance
      );

      let totalAmount = 0;
      const childrenDetails = [];

      groupAttendance.forEach(({ studentId, student, records }) => {
        processedStudents.add(studentId);
        const studentName =
          student?.name || `${student?.firstName} ${student?.lastName}` || 'Unknown Student';
        console.log('⚡ Processing child in family:', studentName, 'with records:', records);

        const sessionTotals = {
          online: 0,
          in_person_class: 0,
          in_person_one_on_one: 0,
        };

        records.forEach(record => {
          if (record.status === 'present' && sessionTotals.hasOwnProperty(record.sessionType)) {
            sessionTotals[record.sessionType] += record.duration || 1;
          }
        });

        const lineItems = Object.entries(sessionTotals)
          .filter(([_, hours]) => hours > 0)
          .map(([sessionType, hours]) => ({
            sessionType,
            hours,
            rate: rates[sessionType] || 0,
            total: hours * (rates[sessionType] || 0),
          }));

        const childTotal = lineItems.reduce((sum, item) => sum + item.total, 0);
        totalAmount += childTotal;
        console.log('⚡ Child total for', studentName, ':', childTotal);

        if (childTotal > 0) {
          childrenDetails.push({
            student: {
              ...student,
              name: studentName,
            },
            lineItems,
            total: childTotal,
          });
        }
      });

      if (totalAmount > 0) {
        consolidatedInvoices.push({
          studentId: group.students[0].id,
          student: {
            name: `${group.parentName} Family`,
            parentName: group.parentName,
            parentEmail: group.parentEmail,
          },
          lineItems: childrenDetails,
          totalAmount,
          period: `${startDate.format('MMM DD')} - ${endDate.format('MMM DD, YYYY')}`,
          invoiceType: 'consolidated',
          children: group.students.filter(s => processedStudents.has(s.id)),
        });
      }
    });

    // Process remaining individual students
    const individualInvoices = attendanceDataParam
      .filter(({ studentId }) => !processedStudents.has(studentId))
      .map(({ studentId, student, records }) => {
        const studentName =
          student?.name || `${student?.firstName} ${student?.lastName}` || 'Unknown Student';

        const sessionTotals = {
          online: 0,
          in_person_class: 0,
          in_person_one_on_one: 0,
        };

        records.forEach(record => {
          if (record.status === 'present' && sessionTotals.hasOwnProperty(record.sessionType)) {
            sessionTotals[record.sessionType] += record.duration || 1;
          }
        });

        const studentCurrency = student.preferredCurrency || 'ZAR';
        const lineItems = Object.entries(sessionTotals)
          .filter(([_, hours]) => hours > 0)
          .map(([sessionType, hours]) => {
            const rate = rates[sessionType] || 0;
            const total = hours * rate;
            return {
              sessionType,
              hours,
              rate: rate,
              total: total,
              currency: studentCurrency,
              formattedRate: formatCurrency(rate, studentCurrency),
              formattedTotal: formatCurrency(total, studentCurrency),
            };
          });

        const totalAmount = lineItems.reduce((sum, item) => sum + item.total, 0);

        const currencyInfo = getCurrency(studentCurrency);

        return {
          studentId,
          student: {
            ...student,
            name: studentName,
            preferredCurrency: studentCurrency,
            currencySymbol: currencyInfo.symbol,
          },
          lineItems,
          totalAmount,
          currency: studentCurrency,
          formattedTotalAmount: formatCurrency(totalAmount, studentCurrency),
          period: `${startDate.format('MMM DD')} - ${endDate.format('MMM DD, YYYY')}`,
          invoiceType: 'individual',
        };
      })
      .filter(invoice => invoice.totalAmount > 0);

    const allInvoices = [...consolidatedInvoices, ...individualInvoices];
    console.log('⚡ Final consolidated invoice preview:', allInvoices);
    return allInvoices;
  };

  const generateIndividualInvoices = () => {
    const preview = attendanceData
      .map(({ studentId, student, records }) => {
        const studentName =
          student?.name || `${student?.firstName} ${student?.lastName}` || 'Unknown Student';
        console.log(
          '💰 Processing individual invoice for student:',
          studentName,
          'with records:',
          records
        );

        const sessionTotals = {
          online: 0,
          in_person_class: 0,
          in_person_one_on_one: 0,
        };

        records.forEach(record => {
          console.log(
            '💰 Processing record:',
            record,
            'Status:',
            record.status,
            'SessionType:',
            record.sessionType
          );
          if (record.status === 'present') {
            // Check if sessionType exists in our totals object
            if (sessionTotals.hasOwnProperty(record.sessionType)) {
              sessionTotals[record.sessionType] += record.duration || 1;
              console.log(
                '💰 Added to totals:',
                record.sessionType,
                record.duration || 1,
                'New total:',
                sessionTotals[record.sessionType]
              );
            } else {
              console.error(
                '💰 Unknown session type:',
                record.sessionType,
                'Available types:',
                Object.keys(sessionTotals)
              );
            }
          } else {
            console.log('💰 Skipped record due to status:', record.status);
          }
        });

        console.log('💰 Session totals for', student?.name, ':', sessionTotals);

        const lineItems = Object.entries(sessionTotals)
          .filter(([_, hours]) => hours > 0)
          .map(([sessionType, hours]) => {
            const rate = rates[sessionType];
            if (!rate) {
              console.error(
                '💰 No rate found for session type:',
                sessionType,
                'Available rates:',
                rates
              );
            }
            console.log('💰 Creating line item:', {
              sessionType,
              hours,
              rate,
              total: hours * rate,
            });
            return {
              sessionType,
              hours,
              rate: rate || 0,
              total: hours * (rate || 0),
            };
          });

        const totalAmount = lineItems.reduce((sum, item) => sum + item.total, 0);

        console.log('💰 Line items for', studentName, ':', lineItems, 'Total:', totalAmount);

        return {
          studentId,
          student: {
            ...student,
            name: studentName,
          },
          lineItems,
          totalAmount,
          period: `${startDate.format('MMM DD')} - ${endDate.format('MMM DD, YYYY')}`,
          invoiceType: 'individual',
        };
      })
      .filter(invoice => invoice.totalAmount > 0);

    console.log('💰 Final individual invoice preview:', preview);
    setInvoicePreview(preview);
  };

  const generateConsolidatedInvoices = () => {
    console.log('💰 ========== INTELLIGENT CONSOLIDATED INVOICE GENERATION START ==========');
    console.log('💰 Sibling groups available:', siblingGroups);
    console.log('💰 Family billing decisions:', familyBillingDecisions);
    console.log('💰 Attendance data available:', attendanceData);

    const consolidatedInvoices = [];
    const processedStudents = new Set();

    // Process intelligent family billing decisions first
    Object.entries(familyBillingDecisions).forEach(([familyKey, decision]) => {
      console.log(`🏠 Processing family billing decision for ${familyKey}:`, decision);

      const familyStudentIds = decision.students.map(s => s.id);
      const familyAttendance = attendanceData.filter(({ studentId }) =>
        familyStudentIds.includes(studentId)
      );

      if (familyAttendance.length === 0) {
        console.log('🏠 No attendance found for family:', decision.primaryStudent.parentName);
        return;
      }

      let totalAmount = 0;
      const childrenDetails = [];

      familyAttendance.forEach(({ studentId, student, records }) => {
        processedStudents.add(studentId);
        const studentName =
          student?.name || `${student?.firstName} ${student?.lastName}` || 'Unknown Student';
        console.log('🏠 Processing family member:', studentName, 'with records:', records);

        const sessionTotals = {
          online: 0,
          in_person_class: 0,
          in_person_one_on_one: 0,
        };

        records.forEach(record => {
          if (record.status === 'present' && sessionTotals.hasOwnProperty(record.sessionType)) {
            sessionTotals[record.sessionType] += record.duration || 1;
          }
        });

        const lineItems = Object.entries(sessionTotals)
          .filter(([_, hours]) => hours > 0)
          .map(([sessionType, hours]) => ({
            sessionType,
            hours,
            rate: rates[sessionType] || 0,
            total: hours * (rates[sessionType] || 0),
          }));

        const childTotal = lineItems.reduce((sum, item) => sum + item.total, 0);
        totalAmount += childTotal;
        console.log('🏠 Child total for', studentName, ':', childTotal);

        if (childTotal > 0) {
          childrenDetails.push({
            student: {
              ...student,
              name: studentName,
            },
            lineItems,
            total: childTotal,
          });
        }
      });

      if (totalAmount > 0) {
        consolidatedInvoices.push({
          studentId: decision.primaryStudent.id,
          student: {
            name: `${decision.primaryStudent.parentName} Family`,
            parentName: decision.primaryStudent.parentName,
            parentEmail: decision.primaryStudent.parentEmail,
          },
          lineItems: childrenDetails,
          totalAmount,
          period: `${startDate.format('MMM DD')} - ${endDate.format('MMM DD, YYYY')}`,
          invoiceType: 'consolidated',
          billingType: decision.type, // 'family' or 'custom'
          children: decision.students,
        });
      }
    });

    // Process traditional sibling groups (for backward compatibility)
    console.log('💰 Processing traditional sibling groups...');
    siblingGroups.forEach((group, groupIndex) => {
      // Skip if already processed by intelligent billing
      const familyKey = group.parentEmail || group.parentPhone;
      if (familyBillingDecisions[familyKey]) {
        console.log(
          '💰 Skipping traditional group - already processed by intelligent billing:',
          familyKey
        );
        return;
      }

      console.log(`💰 Processing traditional sibling group ${groupIndex + 1}:`, group);

      const groupAttendance = attendanceData.filter(({ studentId }) =>
        group.students.some(s => s.id === studentId)
      );

      if (groupAttendance.length === 0) {
        console.log('💰 No attendance found for sibling group:', group.parentName);
        return;
      }

      console.log(
        '💰 Processing sibling group:',
        group.parentName,
        'with attendance:',
        groupAttendance
      );

      let totalAmount = 0;
      const childrenDetails = [];

      groupAttendance.forEach(({ studentId, student, records }) => {
        processedStudents.add(studentId);
        const studentName =
          student?.name || `${student?.firstName} ${student?.lastName}` || 'Unknown Student';
        console.log('💰 Processing child in family:', studentName, 'with records:', records);

        const sessionTotals = {
          online: 0,
          in_person_class: 0,
          in_person_one_on_one: 0,
        };

        records.forEach(record => {
          if (record.status === 'present' && sessionTotals.hasOwnProperty(record.sessionType)) {
            sessionTotals[record.sessionType] += record.duration || 1;
          }
        });

        const lineItems = Object.entries(sessionTotals)
          .filter(([_, hours]) => hours > 0)
          .map(([sessionType, hours]) => ({
            sessionType,
            hours,
            rate: rates[sessionType] || 0,
            total: hours * (rates[sessionType] || 0),
          }));

        const childTotal = lineItems.reduce((sum, item) => sum + item.total, 0);
        totalAmount += childTotal;
        console.log('💰 Child total for', studentName, ':', childTotal);

        if (childTotal > 0) {
          childrenDetails.push({
            student: {
              ...student,
              name: studentName,
            },
            lineItems,
            total: childTotal,
          });
        }
      });

      if (totalAmount > 0) {
        consolidatedInvoices.push({
          studentId: group.students[0].id, // Use first child's ID as reference
          student: {
            name: `${group.parentName} Family`,
            parentName: group.parentName,
            parentEmail: group.parentEmail,
          },
          lineItems: childrenDetails,
          totalAmount,
          period: `${startDate.format('MMM DD')} - ${endDate.format('MMM DD, YYYY')}`,
          invoiceType: 'consolidated',
          children: group.students.filter(s => processedStudents.has(s.id)),
        });
      }
    });

    // Process remaining individual students
    console.log('💰 Processing remaining individual students...');
    const individualInvoices = attendanceData
      .filter(({ studentId }) => !processedStudents.has(studentId))
      .map(({ studentId, student, records }) => {
        const studentName =
          student?.name || `${student?.firstName} ${student?.lastName}` || 'Unknown Student';
        console.log('💰 Processing individual student:', studentName, 'with records:', records);

        const sessionTotals = {
          online: 0,
          in_person_class: 0,
          in_person_one_on_one: 0,
        };

        records.forEach(record => {
          if (record.status === 'present' && sessionTotals.hasOwnProperty(record.sessionType)) {
            sessionTotals[record.sessionType] += record.duration || 1;
          }
        });

        const lineItems = Object.entries(sessionTotals)
          .filter(([_, hours]) => hours > 0)
          .map(([sessionType, hours]) => ({
            sessionType,
            hours,
            rate: rates[sessionType] || 0,
            total: hours * (rates[sessionType] || 0),
          }));

        const totalAmount = lineItems.reduce((sum, item) => sum + item.total, 0);
        console.log('💰 Individual student total for', studentName, ':', totalAmount);

        return {
          studentId,
          student: {
            ...student,
            name: studentName,
          },
          lineItems,
          totalAmount,
          period: `${startDate.format('MMM DD')} - ${endDate.format('MMM DD, YYYY')}`,
          invoiceType: 'individual',
        };
      })
      .filter(invoice => invoice.totalAmount > 0);

    const allInvoices = [...consolidatedInvoices, ...individualInvoices];
    console.log('💰 ========== CONSOLIDATED INVOICE RESULTS ==========');
    console.log('💰 Consolidated invoices created:', consolidatedInvoices.length);
    console.log('💰 Individual invoices created:', individualInvoices.length);
    console.log('💰 Total invoices:', allInvoices.length);
    console.log('💰 Final consolidated invoice preview:', allInvoices);
    console.log('💰 Processed students:', Array.from(processedStudents));
    console.log('💰 ========== CONSOLIDATED INVOICE GENERATION END ==========');

    setInvoicePreview(allInvoices);
  };

  const createInvoices = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('💳 Creating invoices for preview:', invoicePreview);

      if (invoicePreview.length === 0) {
        setError('No invoices to create. Please ensure there are billable hours.');
        return;
      }

      const invoicePromises = invoicePreview.map(async (invoice, index) => {
        console.log(
          `💳 Creating invoice ${index + 1}/${invoicePreview.length} for student:`,
          invoice.student.name
        );

        // Get student currency information
        const studentCurrency = invoice.student.preferredCurrency || 'ZAR';
        const currencySymbol = invoice.student.currencySymbol || 'R';

        const invoiceData = {
          studentId: invoice.studentId,
          studentName: invoice.student.name,
          amount: invoice.totalAmount,
          currency: studentCurrency,
          currencySymbol: currencySymbol,
          lineItems: invoice.lineItems,
          period: invoice.period,
          invoiceDate: new Date().toISOString(),
          dueDate: dayjs().add(30, 'days').toISOString(),
          status: 'pending',
          // Multi-currency support
          exchangeRate: 1, // TODO: Get actual exchange rate
          baseCurrencyAmount: invoice.totalAmount, // TODO: Convert to ZAR if needed
          createdAt: new Date().toISOString(),
        };

        console.log('💳 Invoice data:', invoiceData);
        const result = await firebaseService.createInvoice(invoiceData);
        console.log('💳 Invoice created with ID:', result);
        return result;
      });

      const results = await Promise.all(invoicePromises);
      console.log('💳 All invoices created successfully:', results);

      setSuccess(
        `Successfully created ${invoicePreview.length} invoice${invoicePreview.length > 1 ? 's' : ''}!`
      );

      // Reset workflow after showing success
      setTimeout(() => {
        setActiveStep(0);
        setSelectedStudents([]);
        setAttendanceData([]);
        setInvoicePreview([]);
        setSuccess('');
        if (onInvoiceCreated) onInvoiceCreated();
      }, 3000);
    } catch (error) {
      console.error('💳 Error creating invoices:', error);
      setError(`Failed to create invoices: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentToggle = studentId => {
    console.log('👆 Student toggle clicked for ID:', studentId);
    const student = students.find(s => s.id === studentId);
    console.log('👆 Found student:', student?.firstName, student?.lastName);
    const isCurrentlySelected = selectedStudents.includes(studentId);
    console.log('👆 Currently selected:', isCurrentlySelected);

    if (isCurrentlySelected) {
      // Removing student - just remove from selection
      console.log('👆 Removing student from selection');
      setSelectedStudents(prev => prev.filter(id => id !== studentId));
    } else {
      // Adding student - check for siblings
      console.log('👆 Adding student - checking for siblings');
      const siblings = detectSiblingsForStudent(student);
      console.log('👆 Siblings found:', siblings.length);

      if (siblings.length > 0) {
        // Found siblings - show dialog
        console.log('👆 Showing sibling dialog');
        setCurrentSiblingGroup({
          primaryStudent: student,
          siblings: siblings,
          allFamily: [student, ...siblings],
        });
        setDetectedSiblings(siblings);
        setSiblingDialogOpen(true);
      } else {
        // No siblings - add normally
        console.log('👆 No siblings found - adding normally');
        setSelectedStudents(prev => [...prev, studentId]);
      }
    }
  };

  const detectSiblingsForStudent = student => {
    console.log('🔍 Detecting siblings for student:', student.firstName, student.lastName);
    console.log('🔍 Student parent email:', student.parentEmail);
    console.log('🔍 Student parent phone:', student.parentPhone);

    if (!student.parentEmail && !student.parentPhone) {
      console.log('🔍 No parent contact info found');
      return [];
    }

    const parentContact = student.parentEmail || student.parentPhone;
    console.log('🔍 Using parent contact:', parentContact);

    const siblings = students.filter(
      s =>
        s.id !== student.id && (s.parentEmail === parentContact || s.parentPhone === parentContact)
    );

    console.log(
      '🔍 Found siblings:',
      siblings.map(s => `${s.firstName} ${s.lastName}`)
    );
    return siblings;
  };

  const handleSiblingBillingDecision = (decision, customSelection = null) => {
    const { primaryStudent, siblings, allFamily } = currentSiblingGroup;
    const familyKey = primaryStudent.parentEmail || primaryStudent.parentPhone;

    console.log('🏠 Sibling billing decision:', decision, 'for family:', familyKey);

    switch (decision) {
      case 'individual':
        // Add only the primary student
        setSelectedStudents(prev => [...prev, primaryStudent.id]);
        setBillingPreferences(prev => ({
          ...prev,
          [familyKey]: 'individual',
        }));
        break;

      case 'family':
        // Add all family members and set family billing preference
        const allFamilyIds = allFamily.map(s => s.id);
        setSelectedStudents(prev => {
          const newSelection = [...prev];
          allFamilyIds.forEach(id => {
            if (!newSelection.includes(id)) {
              newSelection.push(id);
            }
          });
          return newSelection;
        });

        setBillingPreferences(prev => ({
          ...prev,
          [familyKey]: 'family',
        }));

        setFamilyBillingDecisions(prev => ({
          ...prev,
          [familyKey]: {
            type: 'family',
            students: allFamily,
            primaryStudent: primaryStudent,
          },
        }));

        // Auto-switch to consolidated mode
        setInvoiceMode('consolidated');
        break;

      case 'custom':
        // Add primary student plus custom selection
        const customIds = [primaryStudent.id, ...(customSelection || [])];
        setSelectedStudents(prev => {
          const newSelection = [...prev];
          customIds.forEach(id => {
            if (!newSelection.includes(id)) {
              newSelection.push(id);
            }
          });
          return newSelection;
        });

        setBillingPreferences(prev => ({
          ...prev,
          [familyKey]: 'custom',
        }));

        if (customSelection && customSelection.length > 0) {
          setInvoiceMode('consolidated');
          setFamilyBillingDecisions(prev => ({
            ...prev,
            [familyKey]: {
              type: 'custom',
              students: [primaryStudent, ...siblings.filter(s => customSelection.includes(s.id))],
              primaryStudent: primaryStudent,
            },
          }));
        }
        break;
    }

    setSiblingDialogOpen(false);
    setCurrentSiblingGroup(null);
    setDetectedSiblings([]);
  };

  const handleSelectAll = () => {
    const filteredStudents = getFilteredStudents();
    if (selectedStudents.length === filteredStudents.length) {
      // Deselect all
      setSelectedStudents([]);
      setFamilyBillingDecisions({});
      setBillingPreferences({});
    } else {
      // Select all with intelligent family detection
      const allStudentIds = filteredStudents.map(s => s.id);
      setSelectedStudents(allStudentIds);

      // Auto-detect families and set up family billing for all
      const familyGroups = {};
      filteredStudents.forEach(student => {
        const siblings = detectSiblingsForStudent(student);
        if (siblings.length > 0) {
          const familyKey = student.parentEmail || student.parentPhone;
          if (!familyGroups[familyKey]) {
            familyGroups[familyKey] = {
              type: 'family',
              students: [student, ...siblings],
              primaryStudent: student,
            };
          }
        }
      });

      if (Object.keys(familyGroups).length > 0) {
        setFamilyBillingDecisions(familyGroups);
        setInvoiceMode('consolidated');
        console.log('🏠 Auto-detected families for select all:', familyGroups);
      }
    }
  };

  const getFilteredStudents = () => {
    if (selectedGrades.length === 0) {
      return students;
    }
    return students.filter(student => selectedGrades.includes(student.grade));
  };

  const handleGradeToggle = grade => {
    setSelectedGrades(prev =>
      prev.includes(grade) ? prev.filter(g => g !== grade) : [...prev, grade]
    );
  };

  const handleSelectAllGrades = () => {
    if (selectedGrades.length === availableGrades.length) {
      setSelectedGrades([]);
    } else {
      setSelectedGrades([...availableGrades]);
    }
  };

  const handleProcessAllInvoices = async () => {
    // Skip to final step and process all invoices
    setError('');

    // Validate that we have students and attendance data
    if (selectedStudents.length === 0) {
      setError('Please select at least one student');
      return;
    }

    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    if (endDate.isBefore(startDate)) {
      setError('End date must be after start date');
      return;
    }

    try {
      console.log('⚡ Processing all invoices in one step...');

      // Load attendance data and process invoices in the callback
      await loadAttendanceData(async attendanceData => {
        console.log('⚡ Step 2: Generating invoice preview with data:', attendanceData);

        // Generate invoice preview using the fresh attendance data
        const preview = generateInvoicePreviewFromData(attendanceData);

        if (preview.length === 0) {
          setError('No billable hours found for selected students and period.');
          return;
        }

        console.log('⚡ Step 3: Creating invoices...', preview);

        // Create invoices directly
        const invoicePromises = preview.map(async (invoice, index) => {
          console.log(
            `💳 Creating invoice ${index + 1}/${preview.length} for student:`,
            invoice.student.name
          );

          // Get student currency information
          const studentCurrency = invoice.student.preferredCurrency || 'ZAR';
          const currencySymbol = invoice.student.currencySymbol || 'R';

          const invoiceData = {
            studentId: invoice.studentId,
            studentName: invoice.student.name,
            amount: invoice.totalAmount,
            currency: studentCurrency,
            currencySymbol: currencySymbol,
            lineItems: invoice.lineItems,
            period: invoice.period,
            invoiceDate: new Date().toISOString(),
            dueDate: dayjs().add(30, 'days').toISOString(),
            status: 'pending',
            // Multi-currency support
            exchangeRate: 1, // TODO: Get actual exchange rate
            baseCurrencyAmount: invoice.totalAmount, // TODO: Convert to ZAR if needed
            createdAt: new Date().toISOString(),
          };

          return await firebaseService.createInvoice(invoiceData);
        });

        const results = await Promise.all(invoicePromises);
        console.log('💳 All invoices created successfully:', results);

        setSuccess(
          `Successfully created ${preview.length} invoice${preview.length > 1 ? 's' : ''}!`
        );

        // Reset workflow after showing success
        setTimeout(() => {
          setActiveStep(0);
          setSelectedStudents([]);
          setAttendanceData([]);
          setInvoicePreview([]);
          setSuccess('');
          if (onInvoiceCreated) onInvoiceCreated();
        }, 3000);
      });
    } catch (error) {
      console.error('Error processing all invoices:', error);
      setError('Failed to process invoices');
    }
  };

  const getSessionTypeLabel = type => {
    const labels = {
      online: 'Online Session',
      in_person_class: 'In-Person Class',
      in_person_one_on_one: 'One-on-One',
    };
    return labels[type] || type;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper
        sx={{
          p: 3,
          backgroundColor: theme.colors.background.secondary,
          border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          boxShadow: theme.shadows.card,
          borderRadius: '16px',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              color: theme.colors.text.primary,
              fontWeight: 600,
            }}
          >
            Create Invoices from Attendance
          </Typography>

          {/* PRODUCTION: Removed test button */}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Stepper activeStep={activeStep} orientation="vertical">
          {/* Step 1: Select Period & Students */}
          <Step>
            <StepLabel icon={<CalendarIcon sx={{ color: theme.colors.brand.primary }} />}>
              <Typography sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                Select Billing Period & Students
              </Typography>
            </StepLabel>
            <StepContent>
              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={setStartDate}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: theme.isDarkMode
                                ? 'rgba(255,255,255,0.2)'
                                : 'rgba(0,0,0,0.2)',
                            },
                            '&:hover fieldset': {
                              borderColor: theme.colors.brand.primary,
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: theme.colors.brand.primary,
                            },
                          },
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={setEndDate}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: theme.isDarkMode
                                ? 'rgba(255,255,255,0.2)'
                                : 'rgba(0,0,0,0.2)',
                            },
                            '&:hover fieldset': {
                              borderColor: theme.colors.brand.primary,
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: theme.colors.brand.primary,
                            },
                          },
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>

              {/* Invoice Mode Selection */}
              <Box mb={3}>
                <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 2 }}>
                  Invoice Generation Mode
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                    value={invoiceMode}
                    onChange={e => setInvoiceMode(e.target.value)}
                    row
                  >
                    <FormControlLabel
                      value="individual"
                      control={<Radio sx={{ color: theme.colors.brand.primary }} />}
                      label={
                        <Box>
                          <Typography sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                            Individual Invoices
                          </Typography>
                          <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                            Create separate invoices for each student
                          </Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="consolidated"
                      control={<Radio sx={{ color: theme.colors.brand.primary }} />}
                      label={
                        <Box>
                          <Typography sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                            Family Consolidated
                          </Typography>
                          <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                            Combine siblings into family invoices
                            {siblingGroups.length > 0 && (
                              <span>
                                {' '}
                                ({siblingGroups.length} family group
                                {siblingGroups.length > 1 ? 's' : ''} detected)
                              </span>
                            )}
                          </Typography>
                        </Box>
                      }
                    />
                  </RadioGroup>
                </FormControl>
              </Box>

              {/* Grade Filtering */}
              <Box mb={3}>
                <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 2 }}>
                  Filter by Grade Level
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap" alignItems="center" mb={2}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleSelectAllGrades}
                    sx={{
                      borderColor: theme.colors.brand.primary,
                      color: theme.colors.brand.primary,
                      '&:hover': {
                        borderColor: theme.colors.brand.primary,
                        backgroundColor: theme.colors.brand.primary + '10',
                      },
                    }}
                  >
                    {selectedGrades.length === availableGrades.length
                      ? 'Clear All'
                      : 'Select All Grades'}
                  </Button>
                  {availableGrades.map(grade => (
                    <Chip
                      key={grade}
                      label={`Grade ${grade}`}
                      onClick={() => handleGradeToggle(grade)}
                      color={selectedGrades.includes(grade) ? 'primary' : 'default'}
                      variant={selectedGrades.includes(grade) ? 'filled' : 'outlined'}
                      sx={{
                        backgroundColor: selectedGrades.includes(grade)
                          ? theme.colors.brand.primary
                          : 'transparent',
                        color: selectedGrades.includes(grade)
                          ? '#000000'
                          : theme.colors.text.primary,
                        borderColor: theme.colors.brand.primary,
                        '&:hover': {
                          backgroundColor: selectedGrades.includes(grade)
                            ? theme.colors.brand.primary
                            : theme.colors.brand.primary + '20',
                        },
                      }}
                    />
                  ))}
                </Box>
                {selectedGrades.length > 0 && (
                  <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                    Showing students from grade{selectedGrades.length > 1 ? 's' : ''}:{' '}
                    {selectedGrades.join(', ')}
                  </Typography>
                )}
              </Box>

              <Box mb={3}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" sx={{ color: theme.colors.text.primary }}>
                    Select Students ({selectedStudents.length} of {getFilteredStudents().length})
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={handleSelectAll}
                    sx={{
                      borderColor: theme.colors.brand.primary,
                      color: theme.colors.brand.primary,
                      '&:hover': {
                        borderColor: theme.colors.brand.primary,
                        backgroundColor: theme.colors.brand.primary + '10',
                      },
                    }}
                  >
                    {selectedStudents.length === students.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </Box>

                <Grid container spacing={2}>
                  {getFilteredStudents().map(student => (
                    <Grid item xs={12} sm={6} md={4} key={student.id}>
                      <Card
                        sx={{
                          backgroundColor: selectedStudents.includes(student.id)
                            ? theme.colors.brand.primary + '20'
                            : theme.colors.background.primary,
                          border: selectedStudents.includes(student.id)
                            ? `2px solid ${theme.colors.brand.primary}`
                            : `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                          },
                        }}
                        onClick={() => handleStudentToggle(student.id)}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={selectedStudents.includes(student.id)}
                                sx={{
                                  color: theme.colors.brand.primary,
                                  '&.Mui-checked': {
                                    color: theme.colors.brand.primary,
                                  },
                                }}
                              />
                            }
                            label={
                              <Box>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <Typography
                                    variant="subtitle1"
                                    sx={{ color: theme.colors.text.primary }}
                                  >
                                    {student.name}
                                  </Typography>
                                  {detectSiblingsForStudent(student).length > 0 && (
                                    <Chip
                                      icon={<FamilyIcon />}
                                      label={`${detectSiblingsForStudent(student).length} sibling${detectSiblingsForStudent(student).length > 1 ? 's' : ''}`}
                                      size="small"
                                      sx={{
                                        backgroundColor: theme.colors.brand.primary + '20',
                                        color: theme.colors.brand.primary,
                                        fontSize: '10px',
                                        height: '20px',
                                        '& .MuiChip-icon': {
                                          fontSize: '12px',
                                          color: theme.colors.brand.primary,
                                        },
                                      }}
                                    />
                                  )}
                                </Box>
                                <Typography
                                  variant="body2"
                                  sx={{ color: theme.colors.text.secondary }}
                                >
                                  Grade {student.grade} • {student.subject}
                                </Typography>
                                {detectSiblingsForStudent(student).length > 0 && (
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: theme.colors.brand.primary,
                                      fontStyle: 'italic',
                                      fontSize: '11px',
                                    }}
                                  >
                                    Family billing available
                                  </Typography>
                                )}
                              </Box>
                            }
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Family Billing Summary */}
              {Object.keys(familyBillingDecisions).length > 0 && (
                <Box mb={3}>
                  <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 2 }}>
                    Family Billing Decisions
                  </Typography>
                  {Object.entries(familyBillingDecisions).map(([familyKey, decision]) => (
                    <Card
                      key={familyKey}
                      sx={{
                        mb: 2,
                        backgroundColor: theme.colors.brand.primary + '10',
                        border: `1px solid ${theme.colors.brand.primary}40`,
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box display="flex" alignItems="center" gap={2}>
                          <FamilyIcon sx={{ color: theme.colors.brand.primary }} />
                          <Box flex={1}>
                            <Typography
                              variant="subtitle1"
                              sx={{ color: theme.colors.text.primary, fontWeight: 600 }}
                            >
                              {decision.primaryStudent.parentName} Family
                            </Typography>
                            <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                              {decision.type === 'family'
                                ? 'Full Family Billing'
                                : 'Custom Selection'}{' '}
                              • {decision.students.length} student
                              {decision.students.length > 1 ? 's' : ''}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: theme.colors.text.secondary }}
                            >
                              {decision.students.map(s => s.name).join(', ')}
                            </Typography>
                          </Box>
                          <Chip
                            label={decision.type === 'family' ? 'Family Invoice' : 'Custom Invoice'}
                            size="small"
                            sx={{
                              backgroundColor: theme.colors.brand.primary,
                              color: '#000000',
                            }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}

              <Box display="flex" gap={2} justifyContent="space-between">
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={loading || selectedStudents.length === 0}
                  sx={{
                    backgroundColor: theme.colors.brand.primary,
                    color: '#000000',
                    '&:hover': {
                      backgroundColor: theme.colors.brand.primary,
                      opacity: 0.8,
                    },
                  }}
                >
                  {loading ? <CircularProgress size={20} /> : 'Next: Load Attendance'}
                </Button>

                <Button
                  variant="contained"
                  onClick={handleProcessAllInvoices}
                  disabled={loading || selectedStudents.length === 0}
                  sx={{
                    backgroundColor: theme.colors.status.success || '#4caf50',
                    color: '#ffffff',
                    '&:hover': {
                      backgroundColor: theme.colors.status.success || '#4caf50',
                      opacity: 0.8,
                    },
                  }}
                >
                  {loading ? <CircularProgress size={20} /> : '⚡ Process All Invoices'}
                </Button>
              </Box>
            </StepContent>
          </Step>

          {/* Step 2: Review Attendance Data */}
          <Step>
            <StepLabel icon={<AssessmentIcon sx={{ color: theme.colors.brand.primary }} />}>
              <Typography sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                Review Attendance Data
              </Typography>
            </StepLabel>
            <StepContent>
              {attendanceData.length > 0 ? (
                <Box>
                  {attendanceData.map(({ student, records }) => (
                    <Card
                      key={student.id}
                      sx={{ mb: 2, backgroundColor: theme.colors.background.primary }}
                    >
                      <CardContent>
                        <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 2 }}>
                          {student.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: theme.colors.text.secondary, mb: 2 }}
                        >
                          {records.length} sessions found in selected period
                        </Typography>

                        {records.length > 0 && (
                          <TableContainer>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell sx={{ color: theme.colors.text.primary }}>
                                    Date
                                  </TableCell>
                                  <TableCell sx={{ color: theme.colors.text.primary }}>
                                    Type
                                  </TableCell>
                                  <TableCell sx={{ color: theme.colors.text.primary }}>
                                    Status
                                  </TableCell>
                                  <TableCell sx={{ color: theme.colors.text.primary }}>
                                    Duration
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {records.slice(0, 5).map((record, index) => (
                                  <TableRow key={index}>
                                    <TableCell sx={{ color: theme.colors.text.secondary }}>
                                      {dayjs(record.date).format('MMM DD')}
                                    </TableCell>
                                    <TableCell sx={{ color: theme.colors.text.secondary }}>
                                      {getSessionTypeLabel(record.sessionType)}
                                    </TableCell>
                                    <TableCell>
                                      <Chip
                                        label={record.status}
                                        size="small"
                                        color={record.status === 'present' ? 'success' : 'default'}
                                      />
                                    </TableCell>
                                    <TableCell sx={{ color: theme.colors.text.secondary }}>
                                      {record.duration || 1}h
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        )}

                        {records.length > 5 && (
                          <Typography
                            variant="body2"
                            sx={{ color: theme.colors.text.secondary, mt: 1 }}
                          >
                            ... and {records.length - 5} more sessions
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              ) : (
                <Typography sx={{ color: theme.colors.text.secondary }}>
                  No attendance data found for selected period and students.
                </Typography>
              )}

              <Box display="flex" gap={2} mt={3}>
                <Button onClick={handleBack}>Back</Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={attendanceData.length === 0}
                  sx={{
                    backgroundColor: theme.colors.brand.primary,
                    color: '#000000',
                    '&:hover': {
                      backgroundColor: theme.colors.brand.primary,
                      opacity: 0.8,
                    },
                  }}
                >
                  Next: Generate Preview
                </Button>
              </Box>
            </StepContent>
          </Step>

          {/* Step 3: Invoice Preview */}
          <Step>
            <StepLabel icon={<ReceiptIcon sx={{ color: theme.colors.brand.primary }} />}>
              <Typography sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                Invoice Preview
              </Typography>
            </StepLabel>
            <StepContent>
              {invoicePreview.length > 0 ? (
                <Box>
                  <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 3 }}>
                    {invoicePreview.length} invoices will be created
                  </Typography>

                  {invoicePreview.map(invoice => (
                    <Card
                      key={invoice.studentId}
                      sx={{ mb: 3, backgroundColor: theme.colors.background.primary }}
                    >
                      <CardContent>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          mb={2}
                        >
                          <Typography variant="h6" sx={{ color: theme.colors.text.primary }}>
                            {invoice.student.name}
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{ color: theme.colors.brand.primary, fontWeight: 700 }}
                          >
                            {formatCurrency(invoice.totalAmount)}
                          </Typography>
                        </Box>

                        <Typography
                          variant="body2"
                          sx={{ color: theme.colors.text.secondary, mb: 2 }}
                        >
                          Period: {invoice.period}
                        </Typography>

                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ color: theme.colors.text.primary }}>
                                  Session Type
                                </TableCell>
                                <TableCell sx={{ color: theme.colors.text.primary }}>
                                  Hours
                                </TableCell>
                                <TableCell sx={{ color: theme.colors.text.primary }}>
                                  Rate
                                </TableCell>
                                <TableCell sx={{ color: theme.colors.text.primary }}>
                                  Total
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {invoice.lineItems.map((item, index) => (
                                <TableRow key={index}>
                                  <TableCell sx={{ color: theme.colors.text.secondary }}>
                                    {getSessionTypeLabel(item.sessionType)}
                                  </TableCell>
                                  <TableCell sx={{ color: theme.colors.text.secondary }}>
                                    {item.hours}
                                  </TableCell>
                                  <TableCell sx={{ color: theme.colors.text.secondary }}>
                                    {formatCurrency(item.rate)}/hr
                                  </TableCell>
                                  <TableCell sx={{ color: theme.colors.text.secondary }}>
                                    {formatCurrency(item.total)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              ) : (
                <Alert severity="warning">
                  No billable hours found for selected students and period.
                </Alert>
              )}

              <Box display="flex" gap={2} mt={3}>
                <Button onClick={handleBack}>Back</Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={loading || invoicePreview.length === 0}
                  sx={{
                    backgroundColor: theme.colors.brand.primary,
                    color: '#000000',
                    '&:hover': {
                      backgroundColor: theme.colors.brand.primary,
                      opacity: 0.8,
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={20} />
                  ) : (
                    `Create ${invoicePreview.length} Invoices`
                  )}
                </Button>
              </Box>
            </StepContent>
          </Step>
        </Stepper>
      </Paper>

      {/* Sibling Detection Dialog */}
      <SiblingDetectionDialog
        open={siblingDialogOpen}
        onClose={() => setSiblingDialogOpen(false)}
        primaryStudent={currentSiblingGroup?.primaryStudent}
        siblings={detectedSiblings}
        onDecision={handleSiblingBillingDecision}
        theme={theme}
      />
    </LocalizationProvider>
  );
}

// Sibling Detection Dialog Component
const SiblingDetectionDialog = ({ open, onClose, primaryStudent, siblings, onDecision, theme }) => {
  const [selectedOption, setSelectedOption] = useState('family');
  const [customSelection, setCustomSelection] = useState([]);

  useEffect(() => {
    if (open) {
      setSelectedOption('family');
      setCustomSelection([]);
    }
  }, [open]);

  const handleCustomSelectionToggle = siblingId => {
    setCustomSelection(prev =>
      prev.includes(siblingId) ? prev.filter(id => id !== siblingId) : [...prev, siblingId]
    );
  };

  const handleConfirm = () => {
    onDecision(selectedOption, selectedOption === 'custom' ? customSelection : null);
  };

  if (!primaryStudent || !siblings) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: theme.colors.background.secondary,
          border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          borderRadius: '16px',
        },
      }}
    >
      <DialogTitle
        sx={{
          color: theme.colors.text.primary,
          borderBottom: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          pb: 2,
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <FamilyIcon sx={{ color: theme.colors.brand.primary }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Siblings Detected!
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Alert
          severity="info"
          sx={{
            mb: 3,
            backgroundColor: theme.colors.brand.primary + '20',
            color: theme.colors.text.primary,
            '& .MuiAlert-icon': {
              color: theme.colors.brand.primary,
            },
          }}
        >
          We found {siblings.length} sibling{siblings.length > 1 ? 's' : ''} for{' '}
          <strong>{primaryStudent.name}</strong> based on parent contact information.
        </Alert>

        <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 2 }}>
          Family Members:
        </Typography>

        <Card
          sx={{
            mb: 3,
            backgroundColor: theme.colors.background.tertiary,
            border: `1px solid ${theme.colors.brand.primary}40`,
          }}
        >
          <CardContent>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon sx={{ color: theme.colors.brand.primary }} />
                </ListItemIcon>
                <ListItemText
                  primary={`${primaryStudent.name} (Selected)`}
                  secondary={`Grade ${primaryStudent.grade} • ${primaryStudent.subject}`}
                  primaryTypographyProps={{
                    color: theme.colors.text.primary,
                    fontWeight: 600,
                  }}
                  secondaryTypographyProps={{
                    color: theme.colors.text.secondary,
                  }}
                />
              </ListItem>

              {siblings.map(sibling => (
                <ListItem key={sibling.id}>
                  <ListItemIcon>
                    <PersonIcon sx={{ color: theme.colors.text.secondary }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={sibling.name}
                    secondary={`Grade ${sibling.grade} • ${sibling.subject}`}
                    primaryTypographyProps={{
                      color: theme.colors.text.primary,
                    }}
                    secondaryTypographyProps={{
                      color: theme.colors.text.secondary,
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 2 }}>
          How would you like to handle billing?
        </Typography>

        <FormControl component="fieldset" fullWidth>
          <RadioGroup value={selectedOption} onChange={e => setSelectedOption(e.target.value)}>
            <FormControlLabel
              value="individual"
              control={<Radio sx={{ color: theme.colors.brand.primary }} />}
              label={
                <Box>
                  <Typography sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                    Create Individual Invoice
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                    Bill only {primaryStudent.name} separately
                  </Typography>
                </Box>
              }
              sx={{
                mb: 2,
                p: 2,
                border: `1px solid ${selectedOption === 'individual' ? theme.colors.brand.primary : 'transparent'}`,
                borderRadius: '8px',
                backgroundColor:
                  selectedOption === 'individual'
                    ? theme.colors.brand.primary + '10'
                    : 'transparent',
              }}
            />

            <FormControlLabel
              value="family"
              control={<Radio sx={{ color: theme.colors.brand.primary }} />}
              label={
                <Box>
                  <Typography sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                    Create Family Consolidated Invoice (Recommended)
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                    Include all {siblings.length + 1} family members in one invoice addressed to the
                    parent
                  </Typography>
                </Box>
              }
              sx={{
                mb: 2,
                p: 2,
                border: `1px solid ${selectedOption === 'family' ? theme.colors.brand.primary : 'transparent'}`,
                borderRadius: '8px',
                backgroundColor:
                  selectedOption === 'family' ? theme.colors.brand.primary + '10' : 'transparent',
              }}
            />

            <FormControlLabel
              value="custom"
              control={<Radio sx={{ color: theme.colors.brand.primary }} />}
              label={
                <Box>
                  <Typography sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                    Let me choose siblings
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                    Manually select which siblings to include
                  </Typography>
                </Box>
              }
              sx={{
                mb: 2,
                p: 2,
                border: `1px solid ${selectedOption === 'custom' ? theme.colors.brand.primary : 'transparent'}`,
                borderRadius: '8px',
                backgroundColor:
                  selectedOption === 'custom' ? theme.colors.brand.primary + '10' : 'transparent',
              }}
            />
          </RadioGroup>
        </FormControl>

        {selectedOption === 'custom' && (
          <Card
            sx={{
              mt: 2,
              backgroundColor: theme.colors.background.tertiary,
              border: `1px solid ${theme.colors.brand.primary}40`,
            }}
          >
            <CardContent>
              <Typography variant="subtitle1" sx={{ color: theme.colors.text.primary, mb: 2 }}>
                Select siblings to include:
              </Typography>
              {siblings.map(sibling => (
                <FormControlLabel
                  key={sibling.id}
                  control={
                    <Checkbox
                      checked={customSelection.includes(sibling.id)}
                      onChange={() => handleCustomSelectionToggle(sibling.id)}
                      sx={{ color: theme.colors.brand.primary }}
                    />
                  }
                  label={
                    <Typography sx={{ color: theme.colors.text.primary }}>
                      {sibling.name} (Grade {sibling.grade})
                    </Typography>
                  }
                  sx={{ display: 'block', mb: 1 }}
                />
              ))}
            </CardContent>
          </Card>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          borderTop: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        }}
      >
        <Button onClick={onClose} sx={{ color: theme.colors.text.secondary }}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          sx={{
            backgroundColor: theme.colors.brand.primary,
            color: '#000000',
            '&:hover': {
              backgroundColor: theme.colors.brand.primary,
              opacity: 0.8,
            },
          }}
        >
          {selectedOption === 'individual' && 'Bill Individual'}
          {selectedOption === 'family' && 'Create Family Invoice'}
          {selectedOption === 'custom' && `Include ${customSelection.length} Siblings`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BillingWorkflow;
