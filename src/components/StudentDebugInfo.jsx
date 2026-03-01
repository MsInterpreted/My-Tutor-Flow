import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Alert } from '@mui/material';
import firebaseService from '../services/firebaseService';

const StudentDebugInfo = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [connectionTest, setConnectionTest] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('🔧 Debug: Fetching all students...');
      const studentsData = await firebaseService.getStudents();
      console.log('🔧 Debug: Students data:', studentsData);
      setStudents(studentsData);
    } catch (err) {
      console.error('🔧 Debug: Error fetching students:', err);
      const errorInfo = firebaseService.getErrorInfo(err);
      setError(
        `${errorInfo.message} (CORS: ${errorInfo.isCorsError}, Network: ${errorInfo.isNetworkError})`
      );
    }
    setLoading(false);
  };

  const testConnection = async () => {
    console.log('🔧 Manual connection test...');
    const result = await firebaseService.testConnection();
    setConnectionTest(result);
    console.log('🔧 Connection test result:', result);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Student Debug Information
      </Typography>

      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={fetchStudents} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh Students'}
        </Button>
        <Button variant="outlined" onClick={testConnection}>
          Test Connection
        </Button>
      </Box>

      {connectionTest !== null && (
        <Alert severity={connectionTest ? 'success' : 'warning'} sx={{ mb: 2 }}>
          {connectionTest
            ? 'Firebase Connection: SUCCESS ✅'
            : 'Firebase Connection: FAILED ❌ - Using Mock Data 📝'}
        </Alert>
      )}

      {error && (
        <Paper sx={{ p: 2, mb: 2, backgroundColor: '#ffebee' }}>
          <Typography color="error">Error: {error}</Typography>
        </Paper>
      )}

      <Typography variant="h6" gutterBottom>
        Found {students.length} students:
      </Typography>

      {students.map((student, index) => (
        <Paper key={student.id} sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Student #{index + 1} (ID: {student.id})
          </Typography>
          <Box component="pre" sx={{ fontSize: '0.875rem', overflow: 'auto' }}>
            {JSON.stringify(student, null, 2)}
          </Box>
        </Paper>
      ))}

      {students.length === 0 && !loading && !error && (
        <Typography color="text.secondary">No students found in the database.</Typography>
      )}
    </Box>
  );
};

export default StudentDebugInfo;
