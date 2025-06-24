import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
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
import GroupsIcon from '@mui/icons-material/Groups';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ArticleIcon from '@mui/icons-material/Article';
import DescriptionIcon from '@mui/icons-material/Description';

interface Meeting {
  Id: number | string;
  MeetingName: string;
  CreatedAt: string;
  CreatedByUserId: string;
  TranscriptionLink?: string;
  SummaryLink?: string;
}

const MeetingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchMeetingDetail = async () => {
      const apiUrl = process.env.REACT_APP_API_URL;
      if (!apiUrl) {
        setErrorMessage("שגיאה בהגדרות השרת");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("jwt_token");
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};

        const response = await axios.get(`${apiUrl}/api/meetings/${id}`, config);
        setMeeting(response.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          localStorage.removeItem("jwt_token");
          navigate("/login");
          return;
        }
        setErrorMessage("לא הצלחנו להטען את פרטי הפגישה");
      } finally {
        setLoading(false);
      }
    };

    fetchMeetingDetail();
  }, [id, navigate]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "#f8f9fa"
        }}
      >
        <CircularProgress sx={{ color: "#3f51b5" }} />
      </Box>
    );
  }

  if (!meeting) {
    return (
      <Container sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h5" color="text.secondary">
          לא נמצאה פגישה
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/meetings")}
          sx={{ mt: 3, borderRadius: 2 }}
        >
          חזרה לפגישות
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh" }}>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ bgcolor: "white", borderBottom: "1px solid #e0e0e0" }}
      >
        <Container>
          <Toolbar sx={{ justifyContent: "space-between", px: { xs: 0, sm: 2 } }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <GroupsIcon sx={{ mr: 1, color: "#3f51b5" }} />
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 700,
                  background:
                    "linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
              >
                TeamTrack
              </Typography>
            </Box>
            {isMobile ? (
              <IconButton color="primary" onClick={handleClick}>
                <MenuIcon />
              </IconButton>
            ) : (
              <Box sx={{ display: "flex", gap: "10px" }}>
                <Button
                  component={RouterLink}
                  to="/meetings"
                  variant="outlined"
                  color="primary"
                  startIcon={<ArrowBackIcon />}
                  sx={{ borderRadius: 2, textTransform: "none", fontWeight: 500 }}
                >
                  חזרה לפגישות
                </Button>
                <Button
                  component={RouterLink}
                  to="/home"
                  variant="outlined"
                  color="primary"
                  startIcon={<HomeIcon />}
                  sx={{ borderRadius: 2, textTransform: "none", fontWeight: 500 }}
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
            sx={{ p: 2, mb: 3, bgcolor: "#ffebee", color: "#c62828", borderRadius: 2 }}
          >
            <Typography>{errorMessage}</Typography>
          </Paper>
        )}

        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            background: "linear-gradient(to bottom right, #ffffff, #f5f5f5)",
            border: "1px solid #e8eaf6",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.05)"
          }}
        >
          <Box
            sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 2,
                bgcolor: "rgba(63, 81, 181, 0.05)",
                borderRadius: "50%",
                width: "80px",
                height: "80px",
                alignItems: "center"
              }}
            >
              <EventIcon sx={{ fontSize: 40, color: "#3f51b5" }} />
            </Box>
            <Typography
              component="h1"
              variant="h4"
              fontWeight="bold"
              sx={{
                mb: 2,
                background:
                  "linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0px 2px 5px rgba(0,0,0,0.05)"
              }}
              align="center"
            >
              {meeting.MeetingName}
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2, dir: "rtl" }}>
              <CalendarTodayIcon sx={{ mr: 1, color: "#3f51b5" }} />
              <Typography
                variant="body1"
                sx={{ fontWeight: 500, ml: 1, color: "#546e7a" }}
              >
                תאריך יצירה:{" "}
                {new Date(meeting.CreatedAt).toLocaleDateString("he-IL", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <PersonIcon sx={{ mr: 1, color: "#3f51b5" }} />
              <Typography
                variant="body1"
                sx={{ fontWeight: 500, ml: 1, color: "#546e7a" }}
              >
                נוצר על ידי: {meeting.CreatedByUserId}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {meeting.TranscriptionLink && (
              <a
                href={meeting.TranscriptionLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", color: "#3f51b5", textDecoration: "none" }}
              >
                <DescriptionIcon sx={{ mr: 1 }} />
                <Typography variant="body1">קישור לתמלול</Typography>
              </a>
            )}

            {meeting.SummaryLink && (
              <a
                href={meeting.SummaryLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", color: "#3f51b5", textDecoration: "none" }}
              >
                <ArticleIcon sx={{ mr: 1 }} />
                <Typography variant="body1">קישור לסיכום</Typography>
              </a>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default MeetingDetail;
