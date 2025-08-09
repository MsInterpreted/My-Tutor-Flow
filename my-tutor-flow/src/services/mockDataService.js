// Mock data service for testing when Firebase is not available
import { shouldUseDemoData } from '../config/mobileConfig';

class MockDataService {
  constructor() {
    // Use demo data for mobile demonstrations
    if (shouldUseDemoData()) {
      this.mockStudents = this.generateMobileStudents();
      this.mockAttendance = this.generateMobileAttendance();
      this.mockMarks = this.generateMobileMarks();
      this.mockInvoices = this.generateMobileInvoices();
      this.mockParentLogs = this.generateMobileParentLogs();
      this.mockDocuments = this.generateMobileDocuments();
    } else {
      // PRODUCTION: Empty arrays for fresh start
      this.mockStudents = [];
      this.mockAttendance = [];
      this.mockMarks = [];
      this.mockInvoices = [];
      this.mockParentLogs = [];
      this.mockDocuments = [];
    }
  }

  // Generate realistic students for mobile demo
  generateMobileStudents() {
    const currentDate = new Date();
    const students = [
      {
        id: 'student_1',
        firstName: 'Amara',
        lastName: 'Okafor',
        grade: 'Grade 12',
        subjects: ['Mathematics', 'Physical Sciences', 'Life Sciences'],
        parentName: 'Dr. Chioma Okafor',
        parentPhone: '+27 82 456 7890',
        parentEmail: 'chioma.okafor@gmail.com',
        emergencyContact: 'Uncle Emeka Okafor',
        emergencyPhone: '+27 83 567 8901',
        billingRate: 450,
        currency: 'ZAR',
        status: 'Active',
        enrollmentDate: new Date(2024, 0, 15),
        lastSession: new Date(currentDate.getTime() - 2 * 24 * 60 * 60 * 1000),
        totalSessions: 45,
        averageAttendance: 92,
        currentAverage: 78,
        notes: 'Excellent progress in Mathematics. Preparing for final exams.',
        profileImage: null,
        address: '123 Sandton Drive, Johannesburg',
        dateOfBirth: new Date(2006, 5, 15),
        schoolName: 'Redhill School',
      },
      {
        id: 'student_2',
        firstName: 'Liam',
        lastName: 'van der Merwe',
        grade: 'Grade 11',
        subjects: ['Mathematics', 'Accounting', 'Business Studies'],
        parentName: 'Sarah van der Merwe',
        parentPhone: '+27 84 123 4567',
        parentEmail: 'sarah.vdmerwe@outlook.com',
        emergencyContact: 'Johan van der Merwe',
        emergencyPhone: '+27 82 234 5678',
        billingRate: 400,
        currency: 'ZAR',
        status: 'Active',
        enrollmentDate: new Date(2024, 1, 3),
        lastSession: new Date(currentDate.getTime() - 1 * 24 * 60 * 60 * 1000),
        totalSessions: 38,
        averageAttendance: 88,
        currentAverage: 82,
        notes: 'Strong analytical skills. Needs support with complex accounting principles.',
        profileImage: null,
        address: '456 Constantia Road, Cape Town',
        dateOfBirth: new Date(2007, 8, 22),
        schoolName: 'Bishops Diocesan College',
      },
      {
        id: 'student_3',
        firstName: 'Zara',
        lastName: 'Patel',
        grade: 'Grade 10',
        subjects: ['Mathematics', 'Natural Sciences', 'English'],
        parentName: 'Raj Patel',
        parentPhone: '+27 83 789 0123',
        parentEmail: 'raj.patel@gmail.com',
        emergencyContact: 'Priya Patel',
        emergencyPhone: '+27 84 890 1234',
        billingRate: 350,
        currency: 'ZAR',
        status: 'Active',
        enrollmentDate: new Date(2024, 2, 10),
        lastSession: new Date(),
        totalSessions: 32,
        averageAttendance: 95,
        currentAverage: 85,
        notes: 'Exceptional student with strong work ethic. Advanced for her grade.',
        profileImage: null,
        address: '789 Umhlanga Ridge, Durban',
        dateOfBirth: new Date(2008, 3, 8),
        schoolName: 'Durban Girls College',
      },
      {
        id: 'student_4',
        firstName: 'Thabo',
        lastName: 'Mthembu',
        grade: 'Grade 12',
        subjects: ['Mathematics', 'Physical Sciences', 'Technical Drawing'],
        parentName: 'Nomsa Mthembu',
        parentPhone: '+27 81 345 6789',
        parentEmail: 'nomsa.mthembu@yahoo.com',
        emergencyContact: 'Sipho Mthembu',
        emergencyPhone: '+27 82 456 7890',
        billingRate: 420,
        currency: 'ZAR',
        status: 'Active',
        enrollmentDate: new Date(2023, 11, 5),
        lastSession: new Date(currentDate.getTime() - 3 * 24 * 60 * 60 * 1000),
        totalSessions: 52,
        averageAttendance: 90,
        currentAverage: 76,
        notes: 'Preparing for university entrance. Strong in technical subjects.',
        profileImage: null,
        address: '321 Alexandra Township, Johannesburg',
        dateOfBirth: new Date(2006, 1, 28),
        schoolName: 'Alexandra Secondary School',
      },
      {
        id: 'student_5',
        firstName: 'Emma',
        lastName: 'Johnson',
        grade: 'Grade 11',
        subjects: ['English', 'History', 'Life Orientation'],
        parentName: 'Michael Johnson',
        parentPhone: '+27 85 567 8901',
        parentEmail: 'michael.johnson@gmail.com',
        emergencyContact: 'Lisa Johnson',
        emergencyPhone: '+27 86 678 9012',
        billingRate: 380,
        currency: 'ZAR',
        status: 'Active',
        enrollmentDate: new Date(2024, 0, 20),
        lastSession: new Date(currentDate.getTime() - 1 * 24 * 60 * 60 * 1000),
        totalSessions: 28,
        averageAttendance: 87,
        currentAverage: 79,
        notes: 'Creative writer with excellent language skills. Improving in History.',
        profileImage: null,
        address: '654 Sea Point, Cape Town',
        dateOfBirth: new Date(2007, 6, 12),
        schoolName: 'Sea Point High School',
      },
      {
        id: 'student_6',
        firstName: 'Arjun',
        lastName: 'Singh',
        grade: 'Grade 10',
        subjects: ['Mathematics', 'Computer Applications Technology'],
        parentName: 'Preet Singh',
        parentPhone: '+27 87 789 0123',
        parentEmail: 'preet.singh@outlook.com',
        emergencyContact: 'Simran Singh',
        emergencyPhone: '+27 88 890 1234',
        billingRate: 360,
        currency: 'ZAR',
        status: 'Active',
        enrollmentDate: new Date(2024, 2, 1),
        lastSession: new Date(),
        totalSessions: 25,
        averageAttendance: 93,
        currentAverage: 88,
        notes: 'Tech-savvy student with strong logical thinking. Excels in programming.',
        profileImage: null,
        address: '987 Chatsworth, Durban',
        dateOfBirth: new Date(2008, 9, 5),
        schoolName: 'Chatsworth Secondary',
        siblingId: 'student_7', // Has a sibling
      },
      {
        id: 'student_7',
        firstName: 'Anaya',
        lastName: 'Singh',
        grade: 'Grade 8',
        subjects: ['Mathematics', 'Natural Sciences', 'English'],
        parentName: 'Preet Singh', // Same parent as Arjun
        parentPhone: '+27 87 789 0123', // Same contact details
        parentEmail: 'preet.singh@outlook.com',
        emergencyContact: 'Simran Singh',
        emergencyPhone: '+27 88 890 1234',
        billingRate: 320, // Lower rate for younger grade
        currency: 'ZAR',
        status: 'Active',
        enrollmentDate: new Date(2024, 2, 15), // Enrolled 2 weeks after brother
        lastSession: new Date(currentDate.getTime() - 1 * 24 * 60 * 60 * 1000),
        totalSessions: 22,
        averageAttendance: 89,
        currentAverage: 84,
        notes: 'Arjun\'s younger sister. Creative and enthusiastic learner. Strong in languages.',
        profileImage: null,
        address: '987 Chatsworth, Durban', // Same address as sibling
        dateOfBirth: new Date(2010, 7, 18),
        schoolName: 'Chatsworth Secondary',
        siblingId: 'student_6', // Has a sibling
      }
    ];

    return students.map(student => ({
      ...student,
      name: `${student.firstName} ${student.lastName}`,
      createdAt: student.enrollmentDate,
      updatedAt: new Date(),
    }));
  }

  // Generate realistic attendance for mobile demo
  generateMobileAttendance() {
    const attendance = [];
    const studentIds = ['student_1', 'student_2', 'student_3', 'student_4', 'student_5', 'student_6', 'student_7'];
    const subjects = ['Mathematics', 'Physical Sciences', 'Life Sciences', 'Accounting', 'Business Studies', 'Natural Sciences', 'English', 'History', 'Life Orientation', 'Technical Drawing', 'Computer Applications Technology'];
    const sessionTypes = ['Individual', 'Group', 'Online', 'Intensive'];
    const statuses = ['Present', 'Absent', 'Late', 'Excused'];

    // Generate attendance for the last 3 months
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);

    let recordId = 1;

    for (let d = new Date(startDate); d <= new Date(); d.setDate(d.getDate() + 1)) {
      // Skip weekends for most sessions
      if (d.getDay() === 0 || d.getDay() === 6) {
        // Only 20% chance of weekend sessions
        if (Math.random() > 0.2) continue;
      }

      // Generate 2-4 sessions per day
      const sessionsPerDay = Math.floor(Math.random() * 3) + 2;

      for (let session = 0; session < sessionsPerDay; session++) {
        const studentId = studentIds[Math.floor(Math.random() * studentIds.length)];
        const subject = subjects[Math.floor(Math.random() * subjects.length)];
        const sessionType = sessionTypes[Math.floor(Math.random() * sessionTypes.length)];

        // 90% attendance rate
        const status = Math.random() < 0.9 ? 'Present' : statuses[Math.floor(Math.random() * statuses.length)];

        // Generate realistic session times
        const sessionHour = 14 + Math.floor(Math.random() * 6); // 2 PM to 8 PM
        const sessionDate = new Date(d);
        sessionDate.setHours(sessionHour, 0, 0, 0);

        const duration = [60, 90, 120][Math.floor(Math.random() * 3)]; // 1, 1.5, or 2 hours

        attendance.push({
          id: `attendance_${recordId++}`,
          studentId,
          subject,
          sessionType,
          date: new Date(sessionDate),
          duration,
          status,
          notes: status === 'Present' ?
            ['Excellent participation', 'Good progress', 'Completed all exercises', 'Asked great questions', 'Showed improvement'][Math.floor(Math.random() * 5)] :
            status === 'Late' ? 'Arrived 15 minutes late' :
            status === 'Excused' ? 'Family emergency' :
            'No show - will reschedule',
          createdAt: new Date(sessionDate),
          updatedAt: new Date(sessionDate),
        });
      }
    }

    return attendance;
  }

  // Generate realistic marks for mobile demo
  generateMobileMarks() {
    const marks = [];
    const studentIds = ['student_1', 'student_2', 'student_3', 'student_4', 'student_5', 'student_6', 'student_7'];
    const subjects = ['Mathematics', 'Physical Sciences', 'Life Sciences', 'Accounting', 'Business Studies', 'Natural Sciences', 'English', 'History', 'Life Orientation', 'Technical Drawing', 'Computer Applications Technology'];
    const terms = ['Term 1', 'Term 2', 'Term 3', 'Term 4'];
    const assessmentTypes = ['Test', 'Assignment', 'Project', 'Exam', 'Quiz', 'Practical'];

    let markId = 1;

    studentIds.forEach(studentId => {
      // Get student's subjects
      const student = this.mockStudents.find(s => s.id === studentId);
      const studentSubjects = student ? student.subjects : subjects.slice(0, 3);

      terms.forEach(term => {
        studentSubjects.forEach(subject => {
          // Generate 3-5 marks per subject per term
          const marksPerSubject = Math.floor(Math.random() * 3) + 3;

          for (let i = 0; i < marksPerSubject; i++) {
            const assessmentType = assessmentTypes[Math.floor(Math.random() * assessmentTypes.length)];

            // Generate realistic marks based on student performance
            let baseMark;
            switch (studentId) {
              case 'student_1': baseMark = 75; break; // Amara - good student
              case 'student_2': baseMark = 80; break; // Liam - strong student
              case 'student_3': baseMark = 85; break; // Zara - excellent student
              case 'student_4': baseMark = 73; break; // Thabo - average student
              case 'student_5': baseMark = 77; break; // Emma - good student
              case 'student_6': baseMark = 86; break; // Arjun - excellent student
              case 'student_7': baseMark = 82; break; // Anaya - strong student (Arjun's sister)
              default: baseMark = 75;
            }

            // Add some variation
            const mark = Math.max(40, Math.min(100, baseMark + (Math.random() - 0.5) * 20));

            const markDate = new Date();
            markDate.setMonth(markDate.getMonth() - (4 - terms.indexOf(term)));
            markDate.setDate(Math.floor(Math.random() * 28) + 1);

            marks.push({
              id: `mark_${markId++}`,
              studentId,
              subject,
              term,
              assessmentType,
              mark: Math.round(mark),
              totalMarks: assessmentType === 'Quiz' ? 20 : assessmentType === 'Test' ? 50 : 100,
              date: markDate,
              notes: mark >= 80 ? 'Excellent work!' :
                     mark >= 70 ? 'Good effort' :
                     mark >= 60 ? 'Needs improvement' : 'Requires additional support',
              createdAt: markDate,
              updatedAt: markDate,
            });
          }
        });
      });
    });

    return marks;
  }

  // Generate realistic invoices for mobile demo
  generateMobileInvoices() {
    const invoices = [];
    const studentIds = ['student_1', 'student_2', 'student_3', 'student_4', 'student_5', 'student_6', 'student_7'];
    const statuses = ['Paid', 'Pending', 'Overdue', 'Partial'];
    const paymentMethods = ['Bank Transfer', 'Cash', 'Card', 'BONK', 'SOL'];

    let invoiceId = 1;

    // Generate invoices for the last 6 months
    for (let month = 0; month < 6; month++) {
      studentIds.forEach(studentId => {
        const student = this.mockStudents.find(s => s.id === studentId);
        if (!student) return;

        const invoiceDate = new Date();
        invoiceDate.setMonth(invoiceDate.getMonth() - month);
        invoiceDate.setDate(1);

        // Calculate sessions for the month
        const sessionsThisMonth = this.mockAttendance.filter(a =>
          a.studentId === studentId &&
          a.date.getMonth() === invoiceDate.getMonth() &&
          a.date.getFullYear() === invoiceDate.getFullYear() &&
          a.status === 'Present'
        ).length;

        if (sessionsThisMonth === 0) return;

        const hourlyRate = student.billingRate;
        const totalHours = sessionsThisMonth * 1.5; // Average 1.5 hours per session
        const subtotal = totalHours * hourlyRate;
        const discount = Math.random() < 0.3 ? subtotal * 0.1 : 0; // 30% chance of 10% discount
        const total = subtotal - discount;

        const status = month === 0 ? 'Pending' :
                      month === 1 && Math.random() < 0.2 ? 'Overdue' :
                      Math.random() < 0.1 ? 'Partial' : 'Paid';

        const paymentMethod = status === 'Paid' ? paymentMethods[Math.floor(Math.random() * paymentMethods.length)] : null;

        invoices.push({
          id: `invoice_${invoiceId++}`,
          studentId,
          studentName: student.name,
          invoiceNumber: `INV-${new Date().getFullYear()}-${String(invoiceId).padStart(4, '0')}`,
          date: invoiceDate,
          dueDate: new Date(invoiceDate.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days
          sessions: sessionsThisMonth,
          totalHours,
          hourlyRate,
          subtotal,
          discount,
          total,
          currency: student.currency,
          status,
          paymentMethod,
          paymentDate: status === 'Paid' ? new Date(invoiceDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000) : null,
          notes: discount > 0 ? 'Family discount applied' : '',
          createdAt: invoiceDate,
          updatedAt: new Date(),
        });
      });
    }

    return invoices;
  }

  // Generate realistic parent logs for mobile demo
  generateMobileParentLogs() {
    const logs = [];
    const studentIds = ['student_1', 'student_2', 'student_3', 'student_4', 'student_5', 'student_6', 'student_7'];
    const communicationTypes = ['Phone Call', 'WhatsApp', 'Email', 'SMS', 'In-Person'];
    const topics = [
      'Progress Update', 'Homework Discussion', 'Exam Preparation', 'Behavioral Concerns',
      'Schedule Change', 'Payment Reminder', 'Academic Achievement', 'Study Tips',
      'Parent-Teacher Conference', 'Holiday Schedule', 'Extra Support Needed'
    ];

    let logId = 1;

    // Generate logs for the last 3 months
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);

    for (let d = new Date(startDate); d <= new Date(); d.setDate(d.getDate() + Math.random() * 7 + 1)) {
      // Random communication every 3-7 days
      const studentId = studentIds[Math.floor(Math.random() * studentIds.length)];
      const student = this.mockStudents.find(s => s.id === studentId);
      if (!student) continue;

      const communicationType = communicationTypes[Math.floor(Math.random() * communicationTypes.length)];
      const topic = topics[Math.floor(Math.random() * topics.length)];

      const logDate = new Date(d);
      logDate.setHours(Math.floor(Math.random() * 12) + 8, Math.floor(Math.random() * 60), 0, 0); // 8 AM to 8 PM

      logs.push({
        id: `log_${logId++}`,
        studentId,
        studentName: student.name,
        parentName: student.parentName,
        communicationType,
        topic,
        date: logDate,
        duration: communicationType === 'Phone Call' ? Math.floor(Math.random() * 20) + 5 : null, // 5-25 minutes
        summary: this.generateLogSummary(topic, student.name),
        followUpRequired: Math.random() < 0.3, // 30% chance
        followUpDate: Math.random() < 0.3 ? new Date(logDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000) : null,
        createdAt: logDate,
        updatedAt: logDate,
      });
    }

    return logs;
  }

  // Generate realistic documents for mobile demo
  generateMobileDocuments() {
    const documents = [];
    const studentIds = ['student_1', 'student_2', 'student_3', 'student_4', 'student_5', 'student_6', 'student_7'];
    const documentTypes = ['Report Card', 'Assignment', 'Test Paper', 'Progress Report', 'Certificate', 'Study Guide'];
    const subjects = ['Mathematics', 'Physical Sciences', 'Life Sciences', 'Accounting', 'Business Studies', 'Natural Sciences', 'English', 'History'];

    let docId = 1;

    studentIds.forEach(studentId => {
      const student = this.mockStudents.find(s => s.id === studentId);
      if (!student) return;

      // Generate 5-10 documents per student
      const numDocs = Math.floor(Math.random() * 6) + 5;

      for (let i = 0; i < numDocs; i++) {
        const docType = documentTypes[Math.floor(Math.random() * documentTypes.length)];
        const subject = subjects[Math.floor(Math.random() * subjects.length)];

        const uploadDate = new Date();
        uploadDate.setDate(uploadDate.getDate() - Math.floor(Math.random() * 90)); // Last 3 months

        documents.push({
          id: `doc_${docId++}`,
          studentId,
          studentName: student.name,
          fileName: `${student.firstName}_${docType.replace(' ', '_')}_${subject.replace(' ', '_')}.pdf`,
          originalName: `${docType} - ${subject} - ${student.name}.pdf`,
          fileType: 'application/pdf',
          fileSize: Math.floor(Math.random() * 2000000) + 100000, // 100KB to 2MB
          documentType: docType,
          subject,
          description: `${docType} for ${subject} - ${student.name}`,
          uploadDate,
          tags: [docType, subject, student.grade],
          isPublic: false,
          downloadCount: Math.floor(Math.random() * 10),
          createdAt: uploadDate,
          updatedAt: uploadDate,
        });
      }
    });

    return documents;
  }

  // Helper function to generate realistic log summaries
  generateLogSummary(topic, studentName) {
    const summaries = {
      'Progress Update': `Discussed ${studentName}'s recent academic progress. Parent pleased with improvement in test scores. Recommended continued focus on homework completion.`,
      'Homework Discussion': `Reviewed homework completion patterns with parent. Agreed on new study schedule to improve consistency. Parent will monitor daily progress.`,
      'Exam Preparation': `Outlined exam preparation strategy for upcoming tests. Provided study materials and practice papers. Scheduled additional revision sessions.`,
      'Behavioral Concerns': `Addressed minor behavioral issues in class. Parent supportive and will reinforce expectations at home. Follow-up meeting scheduled.`,
      'Schedule Change': `Discussed upcoming schedule changes due to school holidays. Adjusted session times to accommodate family travel plans.`,
      'Payment Reminder': `Gentle reminder about outstanding invoice. Parent confirmed payment will be processed by end of week. No issues with service.`,
      'Academic Achievement': `Celebrated ${studentName}'s excellent performance in recent assessments. Parent very proud. Discussed maintaining momentum.`,
      'Study Tips': `Shared effective study techniques tailored to ${studentName}'s learning style. Parent taking notes to support home study environment.`,
      'Parent-Teacher Conference': `Comprehensive discussion about ${studentName}'s overall progress. Aligned on goals for next term. Very positive meeting.`,
      'Holiday Schedule': `Confirmed tutoring schedule during school holidays. Arranged intensive sessions to maintain learning momentum.`,
      'Extra Support Needed': `Identified areas where ${studentName} needs additional support. Planned supplementary materials and extra practice sessions.`
    };

    return summaries[topic] || `Productive discussion with parent regarding ${studentName}'s education and progress.`;
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
