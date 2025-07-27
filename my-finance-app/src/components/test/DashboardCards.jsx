import React from 'react';
import { Box, Card, CardContent, Typography, useTheme, useMediaQuery } from '@mui/material';

const DashboardCards = () => {
  const cardData = [
    "$22,50,000.00",
    "$22,50,000.00",
    "$22,50,000.00",
    "$22,50,000.00",
  ];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      justifyContent="space-between"
      gap={2}
      p={2}
    >
      {cardData.map((amount, index) => (
        <Box
          key={index}
          sx={{
            width: {
              xs: '100%',     // 1 per row on mobile
              sm: '48%',       // 2 per row on tablets
              md: '23%',       // 4 per row on desktops/laptops
            },
          }}
        >
          <Card
            sx={{
              height: 120,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f5f5f5',
              boxShadow: 3,
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                align="center"
                sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}
              >
                {amount}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      ))}
    </Box>
  );
};

export default DashboardCards;