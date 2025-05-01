import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Button, 
  Box, 
  Typography, 
  CircularProgress, 
  Paper,
  Container,
  Divider,
  IconButton,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
  Grid,
  Tooltip
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Meeting } from "../moduls/meeting";
import GroupsIcon from '@mui/icons-material/Groups';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import SortIcon from '@mui/icons-material/Sort';
import SearchIcon from '@mui/icons-material/Search';

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL; 
        const response = await axios.get(`${apiUrl}/api/meetings`);
        setMeetings(response.data);
      } catch (error) {
        setErrorMessage("לא הצלחנו להטען את הפגישות, אנא נסה מאוחר יותר");
      } finally {
        setLoading(false);
      }
    };
    fetchMeetings();
  }, []);

  const handleMeetingClick = (meetingId) => {
    navigate(`/meeting/${meetingId}`);
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        bgcolor: '#f8f9fa'
      }}>
        <CircularProgress sx={{ color: '#3f51b5' }} />
      </Box>
    );
  }

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
              <>
                <IconButton
                  color="primary"
                  aria-label="menu"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleClick}
                >
                  <MenuIcon />
                </IconButton>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: '10px' }}>
                <Button 
                  component={RouterLink} 
                  to="/home" 
                  variant="outlined" 
                  color="primary"
                  startIcon={<HomeIcon />}
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

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(to bottom right, #ffffff, #f5f5f5)',
            border: '1px solid #e8eaf6',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.05)',
            mb: 3
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
              bgcolor: 'rgba(63, 81, 181, 0.05)',
              borderRadius: '50%',
              width: '80px',
              height: '80px',
              alignItems: 'center'
            }}>
              <ListAltIcon sx={{ fontSize: 40, color: '#3f51b5' }} />
            </Box>

            <Typography
              component="h1"
              variant="h4"
              fontWeight="bold"
              sx={{ 
                mb: 2,
                background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0px 2px 5px rgba(0,0,0,0.05)'
              }}
              align="center"
            >
              הפגישות שלך
            </Typography>

            <Typography
              variant="subtitle1"
              color="text.secondary"
              align="center"
              sx={{ mt: 1, mb: 3 }}
            >
              רשימת כל הפגישות המוקלטות שלך
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
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
              פגישה חדשה
            </Button>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="חיפוש">
                <IconButton
                  sx={{ 
                    color: '#3f51b5',
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: 'rgba(63, 81, 181, 0.05)'
                    }
                  }}
                >
                  <SearchIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="מיון">
                <IconButton
                  sx={{ 
                    color: '#3f51b5',
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: 'rgba(63, 81, 181, 0.05)'
                    }
                  }}
                >
                  <SortIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {errorMessage && (
            <Paper 
              elevation={2} 
              sx={{ 
                p: 2, 
                mb: 3, 
                bgcolor: '#ffebee', 
                color: '#c62828',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Typography>{errorMessage}</Typography>
            </Paper>
          )}

          {meetings.length === 0 && !errorMessage ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <ListAltIcon sx={{ fontSize: 60, color: '#9e9e9e', mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" color="text.secondary">אין פגישות להצגה</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                לא נמצאו פגישות במערכת. צור פגישה חדשה כדי להתחיל.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
                  boxShadow: '0 3px 5px 2px rgba(63, 81, 181, .3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #303f9f 30%, #3f51b5 90%)',
                    boxShadow: '0 4px 12px rgba(63, 81, 181, 0.4)',
                  }
                }}
              >
                צור פגישה חדשה
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {meetings.map((meeting) => (
                <Grid item xs={12} sm={6} md={4} key={meeting.Id}>
                  <Paper 
                    elevation={2}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
                      }
                    }}
                  >
                    <Box sx={{ mb: 'auto' }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          mb: 1, 
                          fontWeight: 600,
                          color: '#3f51b5'
                        }}
                      >
                        {meeting.MeetingName}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CalendarTodayIcon sx={{ fontSize: 16, color: '#78909c', mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {new Date(meeting.CreatedAt).toLocaleDateString('he-IL', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      onClick={() => handleMeetingClick(meeting.Id)}
                      startIcon={<VisibilityIcon />}
                      sx={{
                        mt: 2,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500,
                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(63, 81, 181, 0.2)',
                        }
                      }}
                    >
                      צפה בפרטים
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} Shira Steinmetz | 055-6755372
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Meetings;