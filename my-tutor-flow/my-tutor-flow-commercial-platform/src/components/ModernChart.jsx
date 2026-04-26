import React from 'react';
import { Box, Typography, useMediaQuery, useTheme as useMuiTheme } from '@mui/material';
import { useTheme } from '../theme/ThemeContext';

const ModernChart = ({
  data = [],
  type = 'bar',
  title,
  height = 200,
  showGrid = true,
  animated = true,
  dataKeys = [], // For multi-series bar charts
}) => {
  const theme = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  // Sample data if none provided
  const chartData =
    data.length > 0
      ? data
      : [
          { label: 'Mon', value: 65 },
          { label: 'Tue', value: 45 },
          { label: 'Wed', value: 80 },
          { label: 'Thu', value: 55 },
          { label: 'Fri', value: 70 },
          { label: 'Sat', value: 40 },
          { label: 'Sun', value: 60 },
        ];

  // Handle different data structures
  const getItemValue = (item, key = 'value') => {
    return item[key] || item.value || item.amount || item.count || 0;
  };

  // Calculate max value for scaling
  const maxValue =
    type === 'bar' && dataKeys.length > 0
      ? Math.max(...chartData.flatMap(item => dataKeys.map(dk => getItemValue(item, dk.key))))
      : Math.max(...chartData.map(item => getItemValue(item)));

  const BarChart = () => {
    // Multi-series bar chart for billing analytics
    if (dataKeys && dataKeys.length > 0) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'end', gap: 1, height: height - 40, px: 2 }}>
          {chartData.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
                gap: 1,
              }}
            >
              {/* Multi-series bars */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'end',
                  gap: 0.5,
                  width: '100%',
                  justifyContent: 'center',
                }}
              >
                {dataKeys.map((dataKey, seriesIndex) => {
                  const value = getItemValue(item, dataKey.key);
                  return (
                    <Box
                      key={dataKey.key}
                      sx={{
                        width: `${Math.max(8, 24 / dataKeys.length)}px`,
                        height: `${Math.max(4, (value / maxValue) * (height - 80))}px`,
                        background: `linear-gradient(180deg, ${dataKey.color}, ${dataKey.color}CC)`,
                        borderRadius: '4px 4px 1px 1px',
                        position: 'relative',
                        transition: animated ? 'height 1s ease-out' : 'none',
                        transitionDelay: animated
                          ? `${(index * dataKeys.length + seriesIndex) * 50}ms`
                          : '0ms',
                        '&:hover': {
                          transform: 'scaleY(1.05)',
                          filter: 'brightness(1.1)',
                        },
                      }}
                    >
                      {/* Glow effect */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '2px',
                          background: dataKey.color,
                          borderRadius: '4px 4px 0 0',
                          filter: 'blur(1px)',
                          opacity: 0.8,
                        }}
                      />
                    </Box>
                  );
                })}
              </Box>

              {/* Label */}
              <Typography
                variant="caption"
                sx={{
                  color: theme.colors.text.tertiary,
                  fontSize: '12px',
                  fontWeight: 500,
                }}
              >
                {item.name || item.label || `Item ${index + 1}`}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }

    // Single-series bar chart (original)
    return (
      <Box sx={{ display: 'flex', alignItems: 'end', gap: 1, height: height - 40, px: 2 }}>
        {chartData.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              gap: 1,
            }}
          >
            {/* Bar */}
            <Box
              sx={{
                width: '100%',
                maxWidth: '32px',
                height: `${(getItemValue(item) / maxValue) * (height - 80)}px`,
                background: `linear-gradient(180deg, ${theme.colors.brand.primary}, ${theme.colors.brand.secondary})`,
                borderRadius: '6px 6px 2px 2px',
                position: 'relative',
                transition: animated ? 'height 1s ease-out' : 'none',
                transitionDelay: animated ? `${index * 100}ms` : '0ms',
                '&:hover': {
                  transform: 'scaleY(1.05)',
                  filter: 'brightness(1.1)',
                },
              }}
            >
              {/* Glow effect */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: theme.colors.brand.primary,
                  borderRadius: '6px 6px 0 0',
                  filter: 'blur(2px)',
                  opacity: 0.8,
                }}
              />
            </Box>

            {/* Label */}
            <Typography
              variant="caption"
              sx={{
                color: theme.colors.text.tertiary,
                fontSize: '12px',
                fontWeight: 500,
              }}
            >
              {item.label || item.name || `Item ${index + 1}`}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  const LineChart = () => {
    const points = chartData
      .map((item, index) => {
        const x = (index / (chartData.length - 1)) * 100;
        const y = 100 - ((item.value || item.count || 0) / maxValue) * 80;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <Box sx={{ height: height - 40, px: 2, position: 'relative' }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ overflow: 'visible' }}
        >
          {/* Grid lines */}
          {showGrid && (
            <g opacity="0.1">
              {[20, 40, 60, 80].map(y => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="100"
                  y2={y}
                  stroke={theme.colors.text.secondary}
                  strokeWidth="0.5"
                />
              ))}
            </g>
          )}

          {/* Area under curve */}
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={theme.colors.brand.primary} stopOpacity="0.3" />
              <stop offset="100%" stopColor={theme.colors.brand.primary} stopOpacity="0" />
            </linearGradient>
          </defs>

          <path
            d={`M 0,100 L ${points} L 100,100 Z`}
            fill="url(#areaGradient)"
            style={{
              transition: animated ? 'all 1s ease-out' : 'none',
            }}
          />

          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke={theme.colors.brand.primary}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0, 212, 170, 0.3))',
              transition: animated ? 'all 1s ease-out' : 'none',
            }}
          />

          {/* Data points */}
          {chartData.map((item, index) => {
            const x = (index / (chartData.length - 1)) * 100;
            const y = 100 - ((item.value || item.count || 0) / maxValue) * 80;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="2"
                fill={theme.colors.brand.primary}
                style={{
                  filter: 'drop-shadow(0 2px 4px rgba(0, 212, 170, 0.5))',
                  transition: animated ? 'all 1s ease-out' : 'none',
                  transitionDelay: animated ? `${index * 100}ms` : '0ms',
                }}
              />
            );
          })}
        </svg>

        {/* X-axis labels */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mt: 1,
            px: 1,
          }}
        >
          {chartData.map((item, index) => (
            <Typography
              key={index}
              variant="caption"
              sx={{
                color: theme.colors.text.tertiary,
                fontSize: '12px',
                fontWeight: 500,
              }}
            >
              {item.label || item.week || `${index + 1}`}
            </Typography>
          ))}
        </Box>
      </Box>
    );
  };

  const PieChart = () => {
    const total = chartData.reduce((sum, item) => sum + getItemValue(item), 0);
    let cumulativePercentage = 0;

    const colors = [
      theme.colors.brand.primary,
      theme.colors.brand.secondary,
      theme.colors.status.success,
      theme.colors.status.warning,
      theme.colors.status.error,
      theme.colors.status.info,
    ];

    return (
      <Box
        sx={{
          height: isMobile ? height + 60 : height - 40,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Chart Container */}
        <Box
          sx={{
            position: 'relative',
            width: isMobile ? '250px' : '200px',
            height: isMobile ? '250px' : '200px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <svg
            width={isMobile ? "250" : "200"}
            height={isMobile ? "250" : "200"}
            viewBox={isMobile ? "0 0 250 250" : "0 0 200 200"}
          >
            {chartData.map((item, index) => {
              const value = getItemValue(item);
              const percentage = (value / total) * 100;
              const angle = (percentage / 100) * 360;

              const centerX = isMobile ? 125 : 100;
              const centerY = isMobile ? 125 : 100;
              const radius = isMobile ? 100 : 80;

              const startAngle = (cumulativePercentage / 100) * 360 - 90;
              const endAngle = startAngle + angle;

              const startX = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
              const startY = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
              const endX = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
              const endY = centerY + radius * Math.sin((endAngle * Math.PI) / 180);

              const largeArcFlag = angle > 180 ? 1 : 0;

              const pathData = [
                `M ${centerX} ${centerY}`,
                `L ${startX} ${startY}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                'Z',
              ].join(' ');

              cumulativePercentage += percentage;

              return (
                <path
                  key={index}
                  d={pathData}
                  fill={item.color || colors[index % colors.length]}
                  stroke={theme.colors.background.primary}
                  strokeWidth="2"
                  style={{
                    transition: animated ? 'all 0.5s ease-out' : 'none',
                    transitionDelay: animated ? `${index * 100}ms` : '0ms',
                  }}
                />
              );
            })}
          </svg>

          {/* Desktop Legend - Right Side */}
          {!isMobile && (
            <Box
              sx={{
                position: 'absolute',
                right: '-120px',
                top: '50%',
                transform: 'translateY(-50%)',
                minWidth: '100px',
              }}
            >
              {chartData.map((item, index) => {
                const percentage = ((getItemValue(item) / total) * 100).toFixed(1);
                return (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        backgroundColor: item.color || colors[index % colors.length],
                        borderRadius: '2px',
                        mr: 1,
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: theme.colors.text.secondary,
                        fontSize: '10px',
                      }}
                    >
                      {item.name || item.type || item.label || `Item ${index + 1}`} ({percentage}%)
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>

        {/* Mobile Legend - Below Chart */}
        {isMobile && (
          <Box
            sx={{
              mt: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
            }}
          >
            {chartData.map((item, index) => {
              const percentage = ((getItemValue(item) / total) * 100).toFixed(1);
              return (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 1,
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: 14,
                      height: 14,
                      backgroundColor: item.color || colors[index % colors.length],
                      borderRadius: '3px',
                      mr: 1.5,
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.colors.text.secondary,
                      fontSize: '12px',
                      textAlign: 'center',
                    }}
                  >
                    {item.name || item.type || item.label || `Item ${index + 1}`} ({percentage}%)
                  </Typography>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        background: theme.colors.background.secondary,
        borderRadius: '16px',
        p: 2,
        border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        height: height,
      }}
    >
      {title && (
        <Typography
          variant="h6"
          sx={{
            color: theme.colors.text.primary,
            fontWeight: 600,
            mb: 2,
            fontSize: '16px',
          }}
        >
          {title}
        </Typography>
      )}

      {type === 'bar' && <BarChart />}
      {type === 'line' && <LineChart />}
      {type === 'pie' && <PieChart />}
    </Box>
  );
};

export default ModernChart;
