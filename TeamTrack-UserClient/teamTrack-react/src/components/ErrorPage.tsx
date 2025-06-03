import React, { useState, MouseEvent } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Paper, 
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GroupsIcon from '@mui/icons-material/Groups';
import MenuIcon from '@mui/icons-material/Menu';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate, Link } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header/Navigation Bar */}
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{
          bgcolor: 'white',
          borderBottom: '1px solid #e0e0e0'
        }}
      >
        <Container>
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 0, sm: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <GroupsIcon sx={{ mr: 1, color: '#3f51b5' }} />
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                TeamTrack
              </Typography>
            </Box>

            {isMobile ? (
              <IconButton
                color="primary"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleClick}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <Box sx={{ display: 'flex', gap: '10px' }}>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  color="primary"
                  startIcon={<LoginIcon />}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                >
                  התחברות
                </Button>
                <Button
                  component={Link}
                  to="/signup"
                  variant="outlined"
                  color="primary"
                  startIcon={<HowToRegIcon />}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                >
                  הרשמה
                </Button>
                <Button
                  component={Link}
                  to="/"
                  variant="outlined"
                  color="primary"
                  startIcon={<GroupsIcon />}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                >
                  דף הבית
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(to bottom right, #ffffff, #f5f5f5)',
            border: '1px solid #e8eaf6',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.05)'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 3
            }}
          >
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 2,
              bgcolor: 'rgba(211, 47, 47, 0.05)',
              borderRadius: '50%',
              width: '80px',
              height: '80px',
              alignItems: 'center'
            }}>
              <ErrorOutlineIcon sx={{ fontSize: 40, color: '#d32f2f' }} />
            </Box>

            <Typography
              component="h1"
              variant="h4"
              fontWeight="bold"
              sx={{
                mb: 2,
                background: 'linear-gradient(45deg, #d32f2f 30%, #f44336 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0px 2px 5px rgba(0,0,0,0.05)'
              }}
              align="center"
            >
              שגיאה 404
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Typography
            variant="h6"
            color="text.primary"
            align="center"
            sx={{ mt: 1, mb: 2, fontWeight: 500 }}
          >
            הדף שביקשת לא נמצא
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            align="center"
            sx={{ mb: 4 }}
          >
            ייתכן שהכתובת שהזנת שגויה או שהדף הועבר למיקום אחר.
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
              sx={{
                py: 1.5,
                px: 3,
                borderRadius: 2,
                background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
                boxShadow: '0 3px 5px 2px rgba(63, 81, 181, .3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #303f9f 30%, #3f51b5 90%)',
                  boxShadow: '0 4px 12px rgba(63, 81, 181, 0.4)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s',
                }
              }}
            >
              חזור לדף הבית
            </Button>

            <Button
              variant="outlined"
              color="primary"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{
                py: 1.5,
                px: 3,
                borderRadius: 2,
                '&:hover': {
                  boxShadow: '0 2px 5px rgba(63, 81, 181, 0.2)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s',
                }
              }}
            >
              חזור אחורה
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ErrorPage;