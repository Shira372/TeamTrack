import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Typography,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Alert,
  useTheme,
  useMediaQuery,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Tooltip,
} from "@mui/material";
import { Link } from "react-router-dom";
import GroupsIcon from "@mui/icons-material/Groups";
import MenuIcon from "@mui/icons-material/Menu";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import HistoryIcon from "@mui/icons-material/History";

type HistoryItem = {
  s3Key: string;
  result: string;
  timestamp: number;
};

const LOCAL_STORAGE_KEY = "keypoints_history";
const API_URL = "https://teamtrack-server.onrender.com";

const KeyPointsProcessing = () => {
  const [s3Key, setS3Key] = useState<string>("");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    const storedKey = localStorage.getItem("s3Key");
    const token = localStorage.getItem("jwt_token");
    if (storedKey && token) {
      setS3Key(storedKey);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (s3Key && token) {
      handleProcess(s3Key, token);
    }
  }, [s3Key]);

  const handleProcess = async (key: string, token: string) => {
    setProcessing(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/extract-keypoints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ s3Key: key }),
      });

      if (response.status === 401) {
        localStorage.removeItem("jwt_token");
        throw new Error("פג תוקף ההתחברות. אנא התחבר מחדש.");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || errorData?.error || "שגיאה כללית בשרת");
      }

      const data = await response.json();
      const keyPoints = data.keyPoints || "לא נמצאו נקודות מפתח";
      setResult(keyPoints);

      const newItem: HistoryItem = {
        s3Key: key.trim(),
        result: keyPoints,
        timestamp: Date.now(),
      };
      setHistory((prev) => [newItem, ...prev]);
    } catch (e: any) {
      setError(e.message || "שגיאת רשת לא צפויה");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh" }}>
      <AppBar position="static" color="default" elevation={0} sx={{ bgcolor: "white", borderBottom: "1px solid #e0e0e0" }}>
        <Container>
          <Toolbar sx={{ justifyContent: "space-between", px: { xs: 0, sm: 2 } }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <GroupsIcon sx={{ mr: 1, color: "#3f51b5" }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                TeamTrack
              </Typography>
            </Box>

            {isMobile ? (
              <IconButton color="primary" aria-label="menu">
                <MenuIcon />
              </IconButton>
            ) : (
              <Box sx={{ display: "flex", gap: "10px" }}>
                <Button component={Link} to="/login" variant="outlined" color="primary" sx={{ borderRadius: 2 }}>
                  התחברות
                </Button>
                <Button component={Link} to="/signup" variant="outlined" color="primary" sx={{ borderRadius: 2 }}>
                  הרשמה
                </Button>
                <Button component={Link} to="/" variant="outlined" color="primary" sx={{ borderRadius: 2 }}>
                  דף הבית
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Box
          sx={{
            p: 4,
            borderRadius: 3,
            background: "linear-gradient(to bottom right, #ffffff, #f5f5f5)",
            border: "1px solid #e8eaf6",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            fontWeight="bold"
            sx={{
              mb: 3,
              background: "linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            align="center"
          >
            עיבוד נקודות מפתח
          </Typography>

          {processing && (
            <Box sx={{ width: "100%", mt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: "center" }}>
                מעבד את הקובץ...
              </Typography>
              <LinearProgress sx={{ height: 8, borderRadius: 4 }} />
            </Box>
          )}

          {result && (
            <Box sx={{ mt: 3 }}>
              <Alert severity="success" icon={<CheckCircleIcon />} sx={{ borderRadius: 2, whiteSpace: "pre-line" }}>
                {result}
              </Alert>
            </Box>
          )}

          {error && (
            <Box sx={{ mt: 3 }}>
              <Alert severity="error" icon={<ErrorIcon />} sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            </Box>
          )}
        </Box>

        {history.length > 0 && (
          <Box
            sx={{
              mt: 4,
              p: 3,
              borderRadius: 3,
              background: "#fff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
            component={Paper}
            elevation={3}
          >
            <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <HistoryIcon /> היסטוריית עיבודים אחרונים
            </Typography>
            <List dense sx={{ maxHeight: 300, overflowY: "auto" }}>
              {history.map(({ s3Key, result, timestamp }, index) => (
                <React.Fragment key={timestamp + index}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <>
                          <Typography component="span" fontWeight="bold">
                            {s3Key}
                          </Typography>{" "}
                          -{" "}
                          <Tooltip title={new Date(timestamp).toLocaleString()}>
                            <Typography component="span" color="text.secondary" sx={{ cursor: "default" }} variant="body2">
                              {new Date(timestamp).toLocaleDateString()}
                            </Typography>
                          </Tooltip>
                        </>
                      }
                      secondary={
                        <Typography sx={{ whiteSpace: "pre-line", mt: 0.5 }} variant="body2" color="text.primary">
                          {result}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < history.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default KeyPointsProcessing;
