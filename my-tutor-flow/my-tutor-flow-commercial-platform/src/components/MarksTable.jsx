import React, { lazy, Suspense } from 'react';
import {
  IconButton,
  Tooltip,
  Box,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useTheme } from '../theme/ThemeContext';
import MobileOptimizedTable from './MobileOptimizedTable';
const ExportCSVButton = lazy(() => import('./ExportCSVButton'));

export default function MarksTable({ data, onEdit, student, reload }) {
  const theme = useTheme();

  const columns = [
    {
      key: 'term',
      label: 'Term',
    },
    {
      key: 'subject',
      label: 'Subject',
    },
    {
      key: 'mark',
      label: 'Mark (%)',
      render: (row) => `${row.mark}%`,
    },
  ];

  const renderActions = (row) => (
    <Tooltip title="Edit Mark">
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
          Recent Marks
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
          <Tooltip title="Refresh Marks">
            <IconButton
              onClick={reload}
              size="small"
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
          <Suspense fallback={null}>
            <ExportCSVButton
              data={data}
              columns={[
                { label: 'Term', value: 'term' },
                { label: 'Subject', value: 'subject' },
                { label: 'Mark', value: 'mark' },
              ]}
              filename={`${student?.name || 'student'}_marks.csv`}
            />
          </Suspense>
        </Box>
      </Box>

      <MobileOptimizedTable
        columns={columns}
        data={data}
        renderActions={renderActions}
        emptyMessage="No marks recorded."
      />
    </Box>
  );
}
