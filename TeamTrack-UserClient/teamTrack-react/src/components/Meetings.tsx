import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Add as AddIcon,
  Visibility as VisibilityIcon
} from "@mui/icons-material";

interface Meeting {
  Id: string | number;
  MeetingName: string;
  CreatedAt: string;
}

const Meetings = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios.get(`${apiUrl}/api/meetings`);
        setMeetings(response.data);
      } catch (error) {
        setErrorMessage("לא הצלחנו להטעין את הפגישות, אנא נסה מאוחר יותר");
      } finally {
        setLoading(false);
      }
    };
    fetchMeetings();
  }, []);

  const handleMeetingClick = (meetingId: string | number) => {
    navigate(`/meeting/${meetingId}`);
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

      {meetings.length === 0 && !errorMessage ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            אין פגישות להצגה
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            לא נמצאו פגישות במערכת. צור פגישה חדשה כדי להתחיל.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateNewMeeting}
          >
            צור פגישה חדשה
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center" }}>
          {meetings.map((meeting) => (
            <Box
              key={meeting.Id}
              sx={{
                maxWidth: 300,
                width: "100%",
                bgcolor: "white",
                borderRadius: 2,
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                p: 3,
                display: "flex",
                flexDirection: "column"
              }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 1, fontWeight: 600, color: "#3f51b5" }}
              >
                {meeting.MeetingName}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {new Date(meeting.CreatedAt).toLocaleDateString("he-IL", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </Typography>

              <Button
                variant="outlined"
                color="primary"
                fullWidth
                onClick={() => handleMeetingClick(meeting.Id)}
                startIcon={<VisibilityIcon />}
              >
                צפה בפרטים
              </Button>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Meetings;
