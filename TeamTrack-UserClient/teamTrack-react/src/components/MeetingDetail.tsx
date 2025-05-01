import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Paper, 
  Link, 
  Container, 
  Divider,
  Button,
  IconButton,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import { Meeting } from "../moduls/meeting";
import ArticleIcon from '@mui/icons-material/Article';
import SummarizeIcon from '@mui/icons-material/Summarize';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GroupsIcon from '@mui/icons-material/Groups';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';

const MeetingDetail = () => {
  const { id } = useParams();
  const [meeting, setMeeting] = useState(null);
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
    const fetchMeetingDetail = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios.get(`${apiUrl}/api/meetings/${id}`);
        setMeeting(response.data);
      } catch (error) {
        setErrorMessage("לא הצלחנו להטען את פרטי הפגישה");
      } finally {
        setLoading(false);
      }
    };
    fetchMeetingDetail();
  }, [id]);

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

  if (!meeting) {
    return (
      <Container sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="text.secondary">No meeting found</Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/meetings')}
          sx={{ mt: 3, borderRadius: 2 }}
        >
          Back to Meetings
        </Button>
      </Container>
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
                  to="/meetings" 
                  variant="outlined" 
                  color="primary"
                  startIcon={<ArrowBackIcon />}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                >
                  חזרה לפגישות
                </Button>
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

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        {errorMessage && (
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              mb: 3, 
              bgcolor: '#ffebee', 
              color: '#c62828',
              borderRadius: 2
            }}
          >
            <Typography>{errorMessage}</Typography>
          </Paper>
        )}

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
              bgcolor: 'rgba(63, 81, 181, 0.05)',
              borderRadius: '50%',
              width: '80px',
              height: '80px',
              alignItems: 'center'
            }}>
              <EventIcon sx={{ fontSize: 40, color: '#3f51b5' }} />
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
              {meeting.MeetingName}
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, dir: 'rtl' }}>
              <CalendarTodayIcon sx={{ mr: 1, color: '#3f51b5' }} />
              <Typography variant="body1" sx={{ fontWeight: 500, ml: 1, color: '#546e7a' }}>
                תאריך יצירה: {new Date(meeting.CreatedAt).toLocaleDateString('he-IL', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, dir: 'rtl' }}>
              <PersonIcon sx={{ mr: 1, color: '#3f51b5' }} />
              <Typography variant="body1" sx={{ fontWeight: 500, ml: 1, color: '#546e7a' }}>
                נוצר על ידי: {meeting.CreatedByUserId}
              </Typography>
            </Box>
          </Box>

          <Paper 
            elevation={2}
            sx={{
              mb: 3,
              p: 3,
              borderRadius: 2,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ArticleIcon sx={{ fontSize: 28, color: '#3f51b5', mr: 1 }} />
              <Typography 
                variant="h6"
                sx={{ 
                  fontWeight: 600,
                  color: '#3f51b5'
                }}
              >
                תמלול הפגישה
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              צפה בתמלול המלא של הפגישה
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              component={Link}
              href={meeting.TranscriptionLink}
              target="_blank"
              rel="noopener"
              startIcon={<ArticleIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(63, 81, 181, 0.2)',
                }
              }}
            >
              צפה בתמלול
            </Button>
          </Paper>

          <Paper 
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 2,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SummarizeIcon sx={{ fontSize: 28, color: '#3f51b5', mr: 1 }} />
              <Typography 
                variant="h6"
                sx={{ 
                  fontWeight: 600,
                  color: '#3f51b5'
                }}
              >
                סיכום הפגישה
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              צפה בסיכום המלא של הפגישה
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              component={Link}
              href={meeting.SummaryLink}
              target="_blank"
              rel="noopener"
              startIcon={<SummarizeIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(63, 81, 181, 0.2)',
                }
              }}
            >
              צפה בסיכום
            </Button>
          </Paper>
        </Paper>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/meetings')}
            startIcon={<ArrowBackIcon />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
              background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
              boxShadow: '0 3px 5px 2px rgba(63, 81, 181, .3)',
              py: 1,
              px: 3,
              '&:hover': {
                background: 'linear-gradient(45deg, #303f9f 30%, #3f51b5 90%)',
                boxShadow: '0 4px 12px rgba(63, 81, 181, 0.4)',
                transform: 'translateY(-2px)',
                transition: 'all 0.3s',
              }
            }}
          >
            חזרה לרשימת הפגישות
          </Button>
        </Box>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} Shira Steinmetz | 055-6755372
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default MeetingDetail;