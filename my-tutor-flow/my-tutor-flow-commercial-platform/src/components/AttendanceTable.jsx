import React from 'react';
import {
  IconButton,
  Tooltip,
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme as useMuiTheme,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExportCSVButton from './ExportCSVButton';
import MobileOptimizedTable from './MobileOptimizedTable';
import { SESSION_TYPE_LABELS } from '../utils/constants';
import { useTheme } from '../theme/ThemeContext';
import dayjs from 'dayjs';

function AttendanceTable({ data, onEdit, allData, student, reload }) {
  const theme = useTheme();

  const columns = [
    {
      key: 'date',
      label: 'Date',
      render: (row) => row.date ? dayjs(row.date).format('YYYY-MM-DD HH:mm') : '',
    },
    {
      key: 'sessionType',
      label: 'Session Type',
      render: (row) => SESSION_TYPE_LABELS[row.sessionType] || row.sessionType,
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (row) => `${row.duration}h`,
    },
    {
      key: 'status',
      label: 'Status',
    },
  ];

  const renderActions = (row) => (
    <Tooltip title="Edit Attendance">
      <IconButton
        onClick={() => onEdit(row)}
        size="small"
        sx={{
          color: theme.colors.brand.primary,
          '&:hover': {
            backgroundColor: theme.colors.background.tertiary,
          },
        }}
      >
        <EditIcon />
      </IconButton>
    </Tooltip>
  );

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden' }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
        sx={{
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 1 },
          alignItems: { xs: 'stretch', sm: 'center' },
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: theme.colors.text.primary,
            fontWeight: 600,
            textAlign: { xs: 'center', sm: 'left' },
          }}
        >
          Recent Attendance
        </Typography>
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          sx={{
            justifyContent: { xs: 'center', sm: 'flex-end' },
            flexWrap: 'wrap',
          }}
        >
          <Tooltip title="Refresh Attendance Data">
            <IconButton
              onClick={() => {
                console.log('🔄 Refreshing attendance data...');
                if (reload) reload();
              }}
              sx={{
                color: theme.colors.text.secondary,
                '&:hover': {
                  backgroundColor: theme.colors.background.tertiary,
                },
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <ExportCSVButton
            data={allData}
            columns={[
              { label: 'Date', value: row => dayjs(row.date).format('YYYY-MM-DD HH:mm') },
              { label: 'Session Type', value: row => SESSION_TYPE_LABELS[row.sessionType] },
              { label: 'Duration', value: 'duration' },
              { label: 'Status', value: 'status' },
            ]}
            filename={`${student?.name || 'student'}_attendance.csv`}
          />
        </Box>
      </Box>

      <MobileOptimizedTable
        columns={columns}
        data={data}
        renderActions={renderActions}
        emptyMessage="No attendance records."
      />
    </Box>
  );
}
export default React.memo(AttendanceTable);
