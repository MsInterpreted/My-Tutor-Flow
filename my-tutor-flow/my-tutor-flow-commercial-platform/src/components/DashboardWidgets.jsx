import React from 'react';
import { Card, CardContent, Typography, Grid, Chip } from '@mui/material';
import dayjs from 'dayjs';
import { useTheme } from '../theme/ThemeContext';

function getUpcomingBirthdays(students) {
  const today = dayjs();
  return students.filter(s => {
    if (!s.dob) return false;
    const dob = dayjs(s.dob.toDate ? s.dob.toDate() : s.dob);
    const nextBirthday = dob.year(today.year()).isBefore(today)
      ? dob.add(today.year() + 1 - dob.year(), 'year')
      : dob.year(today.year());
    const days = nextBirthday.diff(today, 'day');
    return days >= 0 && days <= 14;
  });
}

export default function DashboardWidgets({ students, invoices, marks }) {
  const theme = useTheme();
  // SIMPLIFIED: Basic counts only - no complex filtering
  const atRisk = [];
  const birthdays = [];
  const outstanding = [];

  return (
    <Grid container spacing={2} mb={2}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Students at Risk</Typography>
            <Typography variant="h4" color="error">
              {atRisk.length}
            </Typography>
            {atRisk.map(s => (
              <Chip key={s.id} label={s.name} size="small" sx={{ mr: 1, mt: 1 }} />
            ))}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Upcoming Birthdays</Typography>
            <Typography variant="h4" color="primary">
              {birthdays.length}
            </Typography>
            {birthdays.map(s => (
              <Chip key={s.id} label={s.name} size="small" sx={{ mr: 1, mt: 1 }} />
            ))}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Outstanding Invoices</Typography>
            <Typography variant="h4" sx={{ color: theme.colors.status.warning }}>
              {outstanding.length}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
