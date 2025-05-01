import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useUser } from "../use-Context/userProvider";
import { 
  Button, 
  Grid, 
  Box, 
  Typography, 
  Paper, 
  Container,
  Divider,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Fade
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import GroupsIcon from '@mui/icons-material/Groups';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventNoteIcon from '@mui/icons-material/EventNote';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Home = () => {
  const { user } = useUser();
  const [showUploadFile, setShowUploadFile] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);  // הגדרת טיפוס anchorEl
  const open = Boolean(anchorEl);
  
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Features array for the feature cards
  const features = [
    {
      icon: <EventNoteIcon sx={{ fontSize: 50, color: '#3f51b5' }} />,
      title: "תיעוד ישיבות",
      description: "תעד את כל הישיבות במקום אחד עם אפשרות לחיפוש וסינון מהיר"
    },
    {
      icon: <AssignmentIcon sx={{ fontSize: 50, color: '#3f51b5' }} />,
      title: "דוחות וסיכומים",
      description: "הפק דוחות מותאמים אישית וקבל תובנות על פעילות הצוות"
    }
  ];

  useEffect(() => {
    if (user?.Id !== 0) {
      setShowUploadFile(true);
    } else {
      setShowUploadFile(false);
    }
  }, [user]);

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
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={handleClose}
                  TransitionComponent={Fade}
                >
                  <MenuItem onClick={handleClose} component={Link} to="Login">
                    <LoginIcon fontSize="small" sx={{ mr: 1 }} />
                    התחברות
                  </MenuItem>
                  <MenuItem onClick={handleClose} component={Link} to="SignUp">
                    <PersonAddIcon fontSize="small" sx={{ mr: 1 }} />
                    הרשמה
                  </MenuItem>
                  {user?.Id !== undefined && showUploadFile && (
                    <MenuItem onClick={handleClose} component={Link} to="showUploadFile">
                      <AddCircleOutlineIcon fontSize="small" sx={{ mr: 1 }} />
                      הוסף ישיבה חדשה
                    </MenuItem>
                  )}
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: '10px' }}>
                <Button 
                  component={Link} 
                  to="Login" 
                  variant="outlined" 
                  color="primary"
                  startIcon={<LoginIcon />}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                >
                  התחברות
                </Button>
                <Button 
                  component={Link} 
                  to="SignUp" 
                  variant="outlined" 
                  color="primary"
                  startIcon={<PersonAddIcon />}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                >
                  הרשמה
                </Button>
                {user?.Id !== undefined && showUploadFile && (
                  <Button
                    component={Link}
                    to="showUploadFile"
                    variant="contained"
                    startIcon={<AddCircleOutlineIcon />}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 500,
                      background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
                      boxShadow: '0 2px 10px rgba(63, 81, 181, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #303f9f 30%, #3f51b5 90%)',
                        boxShadow: '0 4px 12px rgba(63, 81, 181, 0.4)',
                      },
                    }}
                  >
                    הוסף ישיבה חדשה
                  </Button>
                )}
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ mt: 6, mb: 8 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #f5f7ff 100%)',
            border: '1px solid #e8eaf6',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <Typography 
              component="h1" 
              variant="h3" 
              fontWeight="800" 
              sx={{ 
                mb: 2,
                background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0px 2px 5px rgba(0,0,0,0.05)'
              }}
            >
              TeamTrack
            </Typography>

            <Typography 
              variant="h5" 
              color="text.secondary" 
              sx={{ 
                mb: 4, 
                maxWidth: '700px', 
                mx: 'auto',
                fontWeight: 500,
                direction: 'rtl'
              }}
            >
              ניהול וסיכום ישיבות צוות בקליק
            </Typography>

            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ 
                mb: 4, 
                maxWidth: '600px', 
                mx: 'auto',
                direction: 'rtl'
              }}
            >
              האפליקציה המתקדמת לתיעוד, ניהול ומעקב אחר ישיבות צוות. חסכו זמן יקר, שפרו את התקשורת הפנים-ארגונית וקבלו החלטות טובות יותר.
            </Typography>

            <Button
              variant="contained"
              size="large"
              component={Link}
              to="SignUp"
              sx={{
                borderRadius: 2,
                py: 1.5,
                px: 4,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
                boxShadow: '0 4px 20px rgba(63, 81, 181, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #303f9f 30%, #3f51b5 90%)',
                  boxShadow: '0 6px 25px rgba(63, 81, 181, 0.4)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s',
                },
              }}
            >
             הירשם עכשיו חינם
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* Features Section */}
      <Box sx={{ py: 6, bgcolor: '#ffffff' }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h4" 
            component="h2" 
            align="center" 
            fontWeight="700" 
            color="primary" 
            gutterBottom
            sx={{ mb: 1 }}
          >
            יתרונות המערכת
          </Typography>
          
          <Divider sx={{ 
            width: '60px', 
            mx: 'auto', 
            mb: 5, 
            borderColor: '#3f51b5', 
            borderWidth: 2 
          }} />
          
          <Grid container spacing={4} justifyContent="center" sx={{ mt: 1 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index} component="div">
                <Card 
                  elevation={0} 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    textAlign: 'center',
                    p: 3,
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    border: '1px solid #e8eaf6',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
                    },
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
                    mx: 'auto',
                    alignItems: 'center'
                  }}>
                    {feature.icon}
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 0, direction: 'rtl' }}>
                    <Typography gutterBottom variant="h6" component="h3" fontWeight="600">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 3,
            background: 'linear-gradient(45deg, #3f51b5 10%, #5c6bc0 90%)',
            boxShadow: '0 8px 20px rgba(63, 81, 181, 0.3)',
          }}
        >
          <Typography variant="h5" component="p" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
            ? מוכנים להתחיל לנהל ישיבות צוות ביעילות
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 3 }}>
            הצטרפו לאלפי צוותים משתמשים ב-TeamTrack ומרגישים את השיפור
          </Typography>
        </Paper>
      </Container>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          px: 2, 
          mt: 'auto', 
          backgroundColor: 'white',
          borderTop: '1px solid #e0e0e0'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3} justifyContent="space-between" alignItems="center">
            <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                <GroupsIcon sx={{ mr: 1, color: '#3f51b5' }} />
                <Typography 
                  variant="h6" 
                  component="div" 
                  sx={{ 
                    fontWeight: 700, 
                    color: '#3f51b5'
                  }}
                >
                  TeamTrack
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'center', sm: 'right' } }}>
              <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} Shira Steinmetz | 055-6755372
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;

