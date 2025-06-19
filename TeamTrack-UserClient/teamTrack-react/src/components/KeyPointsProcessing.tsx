import React, { useState } from "react";
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
  TextField
} from "@mui/material";
import { Link } from 'react-router-dom';
import GroupsIcon from '@mui/icons-material/Groups';
import MenuIcon from '@mui/icons-material/Menu';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const KeyPointsProcessing = () => {
  const [s3Key, setS3Key] = useState<string>("");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleProcess = async () => {
    if (!s3Key.trim()) return;

    setProcessing(true);
    setResult(null);
    setError(null);

    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) throw new Error("לא נמצא טוקן התחברות, יש להתחבר מחדש");

      const response = await fetch("/api/keypoints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ s3Key })
      });

      if (response.status === 401) {
        throw new Error("פג תוקף ההתחברות. אנא התחבר מחדש.");
      }

      if (!response.ok) {
        let errorMsg = "שגיאה בשרת בעיבוד נקודות מפתח";
        try {
          const errorData = await response.json();
          errorMsg = errorData?.error || errorData?.message || errorMsg;
        } catch {
          // אין JSON תקין
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      setResult(data.keyPoints || "לא נמצאו נקודות מפתח");
    } catch (e) {
      setError(e instanceof Error ? e.message : "אירעה שגיאה לא ידועה");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      <AppBar position="static" color="default" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #e0e0e0' }}>
        <Container>
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 0, sm: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <GroupsIcon sx={{ mr: 1, color: '#3f51b5' }} />
              <Typography variant="h6" sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                TeamTrack
              </Typography>
            </Box>

            {isMobile ? (
              <IconButton color="primary" aria-label="menu" onClick={() => { }}>
                <MenuIcon />
              </IconButton>
            ) : (
              <Box sx={{ display: 'flex', gap: '10px' }}>
                <Button component={Link} to="/login" variant="outlined" color="primary" sx={{ borderRadius: 2 }}>התחברות</Button>
                <Button component={Link} to="/signup" variant="outlined" color="primary" sx={{ borderRadius: 2 }}>הרשמה</Button>
                <Button component={Link} to="/" variant="outlined" color="primary" sx={{ borderRadius: 2 }}>דף הבית</Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ p: 4, borderRadius: 3, background: 'linear-gradient(to bottom right, #ffffff, #f5f5f5)', border: '1px solid #e8eaf6', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.05)' }}>
          <Typography component="h1" variant="h4" fontWeight="bold" sx={{ mb: 3, background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} align="center">
            עיבוד נקודות מפתח
          </Typography>

          <TextField
            label="מפתח הקובץ מ-S3 (s3Key)"
            fullWidth
            variant="outlined"
            value={s3Key}
            onChange={(e) => setS3Key(e.target.value)}
            disabled={processing}
            sx={{ mb: 3 }}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={handleProcess}
            disabled={!s3Key || processing}
            sx={{ py: 1.5, borderRadius: 2 }}
          >
            {processing ? 'מעבד...' : 'שלח ל-AI'}
          </Button>

          {processing && (
            <Box sx={{ width: '100%', mt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
                מעבד את הקובץ...
              </Typography>
              <LinearProgress sx={{ height: 8, borderRadius: 4 }} />
            </Box>
          )}

          {result && (
            <Box sx={{ mt: 3 }}>
              <Alert severity="success" icon={<CheckCircleIcon />} sx={{ borderRadius: 2, whiteSpace: 'pre-line' }}>
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
      </Container>
    </Box>
  );
};

export default KeyPointsProcessing;
