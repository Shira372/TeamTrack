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
  Link,
  Stack,
  Snackbar,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import GroupsIcon from "@mui/icons-material/Groups";
import MenuIcon from "@mui/icons-material/Menu";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import HistoryIcon from "@mui/icons-material/History";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

type HistoryItem = {
  s3Key: string;
  result: string;
  summaryLink: string;
  timestamp: number;
};

const LOCAL_STORAGE_KEY = "keypoints_history";
const API_URL = "https://teamtrack-server.onrender.com";

const KeyPointsProcessing = () => {
  const [s3Key, setS3Key] = useState<string>("");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [summaryLink, setSummaryLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copySuccess, setCopySuccess] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {}
    }
    const storedKey = localStorage.getItem("s3Key");
    if (storedKey) setS3Key(storedKey);
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const handleProcess = async () => {
    const token = localStorage.getItem("jwt_token");
    if (!token || !s3Key) return;

    setProcessing(true);
    setResult(null);
    setError(null);
    setSummaryLink(null);

    try {
      const response = await fetch(`${API_URL}/api/extract-keypoints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ s3Key }),
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
      const link = data.summaryLink || "";

      setResult(keyPoints);
      setSummaryLink(link);

      // שומרים רק ב-KeyPointsProcessing, לא ב-NewMeeting
      localStorage.setItem("summaryLink", link);

      const newItem: HistoryItem = {
        s3Key: s3Key.trim(),
        result: keyPoints,
        summaryLink: link,
        timestamp: Date.now(),
      };
      setHistory((prev) => [newItem, ...prev]);
    } catch (e: any) {
      setError(e.message || "שגיאת רשת לא צפויה");
    } finally {
      setProcessing(false);
    }
  };

  // העתקת הלינק לסיכום ללוח
  const handleCopyLink = () => {
    if (summaryLink) {
      navigator.clipboard.writeText(summaryLink);
      setCopySuccess(true);
    }
  };

  const handleDeleteItem = (timestamp: number) => {
    setHistory((prev) => prev.filter((item) => item.timestamp !== timestamp));
  };

  const handleClearHistory = () => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק את כל היסטוריית העיבודים?")) {
      setHistory([]);
    }
  };

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
                <Button component={RouterLink} to="/login" variant="outlined" color="primary">
                  התחברות
                </Button>
                <Button component={RouterLink} to="/signup" variant="outlined" color="primary">
                  הרשמה
                </Button>
                <Button component={RouterLink} to="/" variant="outlined" color="primary">
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

          <Button
            onClick={handleProcess}
            disabled={!s3Key || processing}
            fullWidth
            variant="contained"
            color="primary"
            sx={{ borderRadius: 3, mt: 2 }}
          >
            התחלת עיבוד
          </Button>

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

              {summaryLink && (
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Link href={summaryLink} target="_blank" rel="noopener" underline="hover">
                    הורדת קובץ סיכום
                  </Link>

                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<ContentCopyIcon />}
                      onClick={handleCopyLink}
                      sx={{ whiteSpace: "nowrap" }}
                    >
                      העתק קישור לסיכום
                    </Button>

                    <Button
                      component={RouterLink}
                      to="/newMeeting"
                      variant="outlined"
                      startIcon={<AddCircleOutlineIcon />}
                    >
                      צור פגישה חדשה
                    </Button>
                  </Box>
                </Box>
              )}
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

        {/* היסטוריית עיבודים */}
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
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <HistoryIcon /> היסטוריית עיבודים אחרונים
            </Typography>
            {history.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleClearHistory}
                size="small"
              >
                מחק הכול
              </Button>
            )}
          </Stack>

          {history.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ mt: 3 }}>
              אין היסטוריית עיבודים להצגה.
            </Typography>
          ) : (
            <List dense sx={{ maxHeight: 300, overflowY: "auto" }}>
              {history.map(({ s3Key, result, summaryLink, timestamp }, index) => (
                <React.Fragment key={timestamp + index}>
                  <ListItem
                    alignItems="flex-start"
                    secondaryAction={
                      <Tooltip title="מחק פריט">
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteItem(timestamp)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    }
                  >
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
                        <>
                          <Typography sx={{ whiteSpace: "pre-line", mt: 0.5 }} variant="body2" color="text.primary">
                            {result}
                          </Typography>
                          {summaryLink && (
                            <Typography sx={{ mt: 1 }}>
                              <Link href={summaryLink} target="_blank" rel="noopener" underline="hover">
                                צפייה/הורדה
                              </Link>
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                  {index < history.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>

        <Snackbar
          open={copySuccess}
          autoHideDuration={2000}
          onClose={() => setCopySuccess(false)}
          message="הקישור הועתק ללוח!"
        />
      </Container>
    </Box>
  );
};

export default KeyPointsProcessing;
