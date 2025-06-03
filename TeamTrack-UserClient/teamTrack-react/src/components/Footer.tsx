import React from 'react';
import { Container, Box, Typography, Divider } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* פס דק מעל הפוטר */}
      <Divider sx={{ borderColor: '#e0e0e0', width: '100%', mb: 3 }} />
      
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: { xs: 'center', sm: 'right' }, order: { xs: 2, sm: 1 } }}
          >
            © {new Date().getFullYear()} Shira Steinmetz | 055-6755372
          </Typography> 
          
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: { xs: 'center', sm: 'flex-end' },
              mb: { xs: 2, sm: 0 },
              order: { xs: 1, sm: 2 }
            }}
          >
            <GroupsIcon sx={{ mr: 1, color: '#3f51b5' }} />
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                color: '#3f51b5',
              }}
            >
              TeamTrack
            </Typography>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Footer;