import React, { lazy, Suspense } from 'react';
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { PARENT_LOG_TYPES } from '../utils/constants';
import { useTheme } from '../theme/ThemeContext';
import dayjs from 'dayjs';
const ExportCSVButton = lazy(() => import('./ExportCSVButton'));

export default function ParentLogsList({ logs, onAdd, student }) {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        p: 2,
        mb: 3,
        backgroundColor: theme.colors.background.secondary,
        border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        boxShadow: theme.shadows.card,
        borderRadius: '16px',
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <Typography
          variant="h6"
          sx={{
            color: theme.colors.text.primary,
            fontWeight: 600,
          }}
        >
          Parent Communication Log
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<AddIcon />}
          onClick={onAdd}
          sx={{
            borderColor: theme.colors.brand.primary,
            color: theme.colors.brand.primary,
            '&:hover': {
              borderColor: theme.colors.brand.primary,
              backgroundColor: `${theme.colors.brand.primary}20`,
            },
          }}
        >
          Add Log
        </Button>
      </Box>
      {logs.length === 0 ? (
        <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
          No communication logs yet.
        </Typography>
      ) : (
        <List dense>
          {logs.map(l => (
            <ListItem key={l.id} sx={{ px: 0 }}>
              <Avatar
                sx={{
                  bgcolor:
                    l.type === 'call'
                      ? '#1976d2'
                      : l.type === 'email'
                        ? '#43a047'
                        : l.type === 'sms'
                          ? '#fbc02d'
                          : '#bdbdbd',
                  width: 32,
                  height: 32,
                  fontSize: 16,
                }}
              >
                {l.type ? l.type[0].toUpperCase() : '?'}
              </Avatar>
              <ListItemText
                primary={
                  <span>
                    <b>{PARENT_LOG_TYPES.find(t => t.value === l.type)?.label || l.type}</b> (
                    {l.date
                      ? typeof l.date === 'string'
                        ? l.date
                        : l.date.toDate
                          ? dayjs(l.date.toDate()).format('YYYY-MM-DD')
                          : dayjs(l.date).format('YYYY-MM-DD')
                      : 'No date'}
                    )
                  </span>
                }
                secondary={l.notes}
                sx={{ ml: 2 }}
              />
            </ListItem>
          ))}
        </List>
      )}
      <Suspense fallback={null}>
        <ExportCSVButton
          data={logs}
          columns={[
            { label: 'Date', value: 'date' },
            { label: 'Type', value: 'type' },
            { label: 'Notes', value: 'notes' },
          ]}
          filename={`${student?.name || 'student'}_parentlogs.csv`}
        />
      </Suspense>
    </Paper>
  );
}
