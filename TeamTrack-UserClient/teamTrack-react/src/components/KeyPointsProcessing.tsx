import React, { useState } from "react";
import {
  Button,
  Box,
  Typography,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Divider,
  Alert,
  useTheme,
  useMediaQuery,
  LinearProgress
} from "@mui/material";
import { Link } from 'react-router-dom';
import GroupsIcon from '@mui/icons-material/Groups';
import MenuIcon from '@mui/icons-material/Menu';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const KeyPointsProcessing = () => {
  const [inputText, setInputText] = useState("");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleProcess = async () => {
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
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ text: inputText })
      });

      if (response.status === 401) {
        throw new Error("פג תוקף ההתחברות. אנא התחבר מחדש.");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "שגיאה בשרת בעיבוד נקודות מפתח");
      }

      const data = await response.json();
      setResult(data.keyPoints || "לא נמצאו נקודות מפתח");
    } catch (e) {
      setError((e as Error).message || "אירעה שגיאה לא ידועה");
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
              <Typography variant="h6" component="div" sx={{ fontWeight: 700, background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                TeamTrack
              </Typography>
            </Box>

            {isMobile ? (
              <IconButton color="primary" aria-label="menu" onClick={() => {}}>
                <MenuIcon />
              </IconButton>
            ) : (
              <Box sx={{ display: 'flex', gap: '10px' }}>
                <Button component={Link} to="/login" variant="outlined" color="primary" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 500 }}>התחברות</Button>
                <Button component={Link} to="/signup" variant="outlined" color="primary" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 500 }}>הרשמה</Button>
                <Button component={Link} to="/" variant="outlined" color="primary" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 500 }}>דף הבית</Button>
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

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={6}
            placeholder="הדביקי כאן טקסט לעיבוד"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              resize: 'vertical',
              marginBottom: '20px',
              fontFamily: 'inherit',
            }}
            disabled={processing}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={handleProcess}
            disabled={!inputText.trim() || processing}
            sx={{ py: 1.5, borderRadius: 2, background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)', boxShadow: '0 3px 5px 2px rgba(63, 81, 181, .3)', '&:hover': { background: 'linear-gradient(45deg, #303f9f 30%, #3f51b5 90%)', boxShadow: '0 4px 12px rgba(63, 81, 181, 0.4)', transform: 'translateY(-2px)', transition: 'all 0.3s' } }}
          >
            {processing ? 'מעבד...' : 'עבד טקסט'}
          </Button>

          {processing && (
            <Box sx={{ width: '100%', mt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
                מעבד את הטקסט...
              </Typography>
              <LinearProgress sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(63, 81, 181, 0.1)' }} />
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
