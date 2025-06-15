import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, CircularProgress, Paper, Link, Container, Divider, Button, IconButton, AppBar, Toolbar, useTheme, useMediaQuery } from "@mui/material";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import { Meeting } from "../moduls/meeting"; // ודא שיש את המודול הזה
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
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f8f9fa' }}>
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
      {/* Header */}
      <AppBar position="static" color="default" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #e0e0e0' }}>
        <Container>
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 0, sm: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <GroupsIcon sx={{ mr: 1, color: '#3f51b5' }} />
              <Typography variant="h6" component="div" sx={{ fontWeight: 700, background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                TeamTrack
              </Typography>
            </Box>
            {isMobile ? (
              <IconButton color="primary" onClick={handleClick}><MenuIcon /></IconButton>
            ) : (
              <Box sx={{ display: 'flex', gap: '10px' }}>
                <Button component={RouterLink} to="/meetings" variant="outlined" color="primary" startIcon={<ArrowBackIcon />} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 500 }}>
                  חזרה לפגישות
                </Button>
                <Button component={RouterLink} to="/home" variant="outlined" color="primary" startIcon={<HomeIcon />} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 500 }}>
                  דף הבית
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Meeting Details */}
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        {errorMessage && (
          <Paper elevation={2} sx={{ p: 2, mb: 3, bgcolor: '#ffebee', color: '#c62828', borderRadius: 2 }}>
            <Typography>{errorMessage}</Typography>
          </Paper>
        )}

        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, background: 'linear-gradient(to bottom right, #ffffff, #f5f5f5)', border: '1px solid #e8eaf6', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.05)' }}>
          {/* Meeting Info */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, bgcolor: 'rgba(63, 81, 181, 0.05)', borderRadius: '50%', width: '80px', height: '80px', alignItems: 'center' }}>
              <EventIcon sx={{ fontSize: 40, color: '#3f51b5' }} />
            </Box>
            <Typography component="h1" variant="h4" fontWeight="bold" sx={{ mb: 2, background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0px 2px 5px rgba(0,0,0,0.05)' }} align="center">
              {meeting.meetingName}
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Date and Creator */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, dir: 'rtl' }}>
              <CalendarTodayIcon sx={{ mr: 1, color: '#3f51b5' }} />
              <Typography variant="body1" sx={{ fontWeight: 500, ml: 1, color: '#546e7a' }}>
                תאריך יצירה: {new Date(meeting.createdAt).toLocaleDateString('he-IL', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                })}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonIcon sx={{ mr: 1, color: '#3f51b5' }} />
              <Typography variant="body1" sx={{ fontWeight: 500, ml: 1, color: '#546e7a' }}>
                נוצר על ידי: {meeting.createdByUserId}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Links */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {meeting.transcriptionLink && (
              <Link href={meeting.transcriptionLink} target="_blank" rel="noopener" sx={{ display: 'flex', alignItems: 'center' }}>
                <ArticleIcon sx={{ mr: 1 }} />
                <Typography variant="body1">קישור לתמלול</Typography>
              </Link>
            )}

            {meeting.summaryLink && (
              <Link href={meeting.summaryLink} target="_blank" rel="noopener" sx={{ display: 'flex', alignItems: 'center' }}>
                <SummarizeIcon sx={{ mr: 1 }} />
                <Typography variant="body1">קישור לסיכום</Typography>
              </Link>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default MeetingDetail;
