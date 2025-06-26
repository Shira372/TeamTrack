import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Slide,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

interface User {
  id: number;
  userName: string;
  role?: string;
  company?: string;
  email?: string;
}

interface Meeting {
  id: number;
  meetingName: string;
  createdAt: string;
  updatedAt?: string;
  createdByUserFullName?: string;
  participants?: User[];
}

const Meetings = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showButton, setShowButton] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        if (!apiUrl) {
          setErrorMessage("שגיאה בהגדרות השרת");
          setLoading(false);
          return;
        }

        const token = localStorage.getItem("tt_token");
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};

        // חשוב: לקרוא לפגישות של המשתמש הנוכחי
        const response = await axios.get<Meeting[]>(`${apiUrl}/api/meetings/my`, config);

        setMeetings(response.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          localStorage.removeItem("tt_token");
          navigate("/login");
          return;
        }
        setErrorMessage("לא הצלחנו להטעין את הפגישות, אנא נסה מאוחר יותר");
      } finally {
        setLoading(false);
        setTimeout(() => setShowButton(true), 300);
      }
    };

    fetchMeetings();
  }, [navigate]);

  const handleMeetingClick = (meetingId: number) => {
    navigate(`/meetings/${meetingId}`);
  };

  const handleCreateNewMeeting = () => {
    navigate('/newMeeting');
  };

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

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", p: 4 }}>
      {errorMessage && (
        <Paper
          elevation={2}
          sx={{
            p: 2,
            mb: 3,
            bgcolor: "#ffebee",
            color: "#c62828",
            borderRadius: 2
          }}
        >
          <Typography>{errorMessage}</Typography>
        </Paper>
      )}

      <Slide direction="down" in={showButton} mountOnEnter unmountOnExit>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateNewMeeting}
            sx={{ fontWeight: "bold", borderRadius: 2 }}
          >
            פגישה חדשה
          </Button>
        </Box>
      </Slide>

      {meetings.length === 0 && !errorMessage ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            אין פגישות להצגה
          </Typography>
          <Typography variant="body2" color="text.secondary">
            לא נמצאו פגישות במערכת.
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "center"
          }}
        >
          {meetings.map((meeting) => (
            <Paper
              key={meeting.id}
              sx={{
                maxWidth: 320,
                width: "100%",
                bgcolor: "white",
                borderRadius: 2,
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                p: 3,
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
              elevation={3}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#3f51b5" }}
              >
                {meeting.meetingName}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                תאריך יצירה:{" "}
                {new Date(meeting.createdAt).toLocaleDateString("he-IL", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>

              {meeting.updatedAt && (
                <Typography variant="body2" color="text.secondary">
                  עדכון אחרון:{" "}
                  {new Date(meeting.updatedAt).toLocaleDateString("he-IL", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Typography>
              )}

              {meeting.createdByUserFullName && (
                <Typography variant="body2" color="text.secondary">
                  נוצר על ידי: {meeting.createdByUserFullName}
                </Typography>
              )}

              <Divider sx={{ my: 1 }} />

              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, color: "#1976d2" }}
              >
                משתתפים בפגישה:
              </Typography>

              {meeting.participants && meeting.participants.length > 0 ? (
                meeting.participants.map((participant) => (
                  <Box
                    key={participant.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      bgcolor: "#e3f2fd",
                      p: 1,
                      borderRadius: 1,
                    }}
                  >
                    <PersonIcon sx={{ color: "#1e88e5" }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {participant.userName}
                      {participant.role ? ` - ${participant.role}` : ""}
                      {participant.company ? `, ${participant.company}` : ""}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  אין משתתפים
                </Typography>
              )}

              <Button
                variant="outlined"
                color="primary"
                fullWidth
                onClick={() => handleMeetingClick(meeting.id)}
                startIcon={<VisibilityIcon />}
                sx={{ mt: 2 }}
              >
                צפה בפרטים
              </Button>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Meetings;
