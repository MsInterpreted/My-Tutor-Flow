import React, { useState, useMemo } from 'react';
import {
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  MenuItem,
  Select,
} from '@mui/material';
import { useTheme } from '../theme/ThemeContext';

export default function StudentsTable({ students }) {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [grade, setGrade] = useState('');

  const filtered = useMemo(
    () =>
      students.filter(
        s =>
          (!grade || s.grade === grade) &&
          (!search || s.name.toLowerCase().includes(search.toLowerCase()))
      ),
    [students, search, grade]
  );

  return (
    <Paper
      sx={{
        backgroundColor: theme.colors.background.secondary,
        border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        boxShadow: theme.shadows.card,
        borderRadius: '16px',
      }}
    >
      <Box p={2} display="flex" gap={2}>
        <TextField label="Search" value={search} onChange={e => setSearch(e.target.value)} />
        <Select value={grade} onChange={e => setGrade(e.target.value)} displayEmpty>
          <MenuItem value="">All Grades</MenuItem>
          {/* Dynamically render grade options */}
        </Select>
      </Box>
      {/* Usual table rendering for filtered */}
    </Paper>
  );
}
