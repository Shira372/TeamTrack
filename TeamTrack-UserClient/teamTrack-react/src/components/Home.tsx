import { Link } from "react-router-dom";
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useUser } from "../use-Context/userProvider";
import Grid from '@mui/material/Grid';
import { Button, Box, Typography, Paper, Container, Divider, Card, CardContent, useMediaQuery, useTheme, AppBar, Toolbar, IconButton, Menu, MenuItem, Fade, Zoom, Grow, Collapse, Avatar } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import GroupsIcon from '@mui/icons-material/Groups';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventNoteIcon from '@mui/icons-material/EventNote';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DescriptionIcon from '@mui/icons-material/Description';
import SpeedIcon from '@mui/icons-material/Speed';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';

const Home = () => {
  const { user } = useUser();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Consolidated user authentication check at the top
  const isLoggedIn = user?.id !== undefined && user?.id !== 0;
  
  // State management
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const [hoverStates, setHoverStates] = useState<Record<string, boolean>>({});
  
  const heroRef = useRef<HTMLDivElement>(null);
  const open = Boolean(anchorEl);
  const profileOpen = Boolean(profileAnchorEl);

  // Set loaded state after component mount for animations
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Handle scroll animations
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const heroElement = heroRef.current;

      if (heroElement) {
        const heroTop = heroElement.getBoundingClientRect().top;
        const heroHeight = heroElement.offsetHeight;

        if (heroTop < window.innerHeight && heroTop > -heroHeight) {
          const parallaxOffset = scrollPosition * 0.3;
          heroElement.style.backgroundPositionY = `-${parallaxOffset}px`;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Event handlers
  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleProfileClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  }, []);

  const handleProfileClose = useCallback(() => {
    setProfileAnchorEl(null);
  }, []);

  const handleFeatureHover = useCallback((index: number) => {
    setActiveFeature(index);
  }, []);

  const handleFeatureLeave = useCallback(() => {
    setActiveFeature(null);
  }, []);

  const handleButtonHover = useCallback((id: string, isHovered: boolean) => {
    setHoverStates(prev => ({ ...prev, [id]: isHovered }));
  }, []);

  // Get user display text for avatar
  const getUserDisplayText = useCallback((name: string) => {
    if (!name) return 'U';
    if (name.length <= 2) return name.toUpperCase();
    return name[0].toUpperCase();
  }, []);

  // Features configuration
  const features = useMemo(() => [
    {
      icon: <EventNoteIcon sx={{ fontSize: 50, color: '#3f51b5' }} />,
      title: "תיעוד ישיבות",
      description: "תעד את כל הישיבות במקום אחד עם אפשרות לחיפוש וסינון מהיר",
      bullets: ["ארגון אוטומטי", "תיוג משתתפים", "חיפוש מהיר"]
    },
    {
      icon: <AssignmentIcon sx={{ fontSize: 50, color: '#3f51b5' }} />,
      title: "דוחות וסיכומים",
      description: "הפק דוחות מותאמים אישית וקבל תובנות על פעילות הצוות",
      bullets: ["ניתוח מגמות", "מעקב החלטות", "יצוא לפורמטים שונים"]
    },
  ], []);

  // Metrics configuration
  const metrics = useMemo(() => [
    { value: "87%", label: "חיסכון בזמן", icon: <AccessTimeIcon /> },
    { value: "1000+", label: "לקוחות מרוצים", icon: <EmojiPeopleIcon /> },
    { value: "3X", label: "שיפור בתפוקה", icon: <SpeedIcon /> }
  ], []);

  // Optimized styles
  const styles = useMemo(() => ({
    gradientText: {
      background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    primaryButton: {
      borderRadius: 2,
      py: 1.5,
      px: 4,
      textTransform: 'none' as const,
      fontSize: '1rem',
      fontWeight: 600,
      background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
      boxShadow: '0 4px 20px rgba(63, 81, 181, 0.3)',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      '&:hover': {
        background: 'linear-gradient(45deg, #303f9f 30%, #3f51b5 90%)',
        boxShadow: '0 6px 25px rgba(63, 81, 181, 0.5)',
        transform: 'translateY(-3px) scale(1.02)',
      },
    },
    featureBox: (isActive: boolean) => ({
      width: { xs: '100%', sm: '48%', md: '30%' },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      p: 3,
      borderRadius: 3,
      border: '1px solid #e8eaf6',
      boxShadow: isActive
        ? '0 15px 35px rgba(63, 81, 181, 0.15)'
        : '0 2px 10px rgba(0, 0, 0, 0.08)',
      transform: isActive ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      background: isActive
        ? 'linear-gradient(135deg, #ffffff 0%, #f0f3ff 100%)'
        : 'white',
      '&:hover': {
        transform: 'translateY(-8px) scale(1.02)',
        boxShadow: '0 15px 35px rgba(63, 81, 181, 0.15)',
        background: 'linear-gradient(135deg, #ffffff 0%, #f0f3ff 100%)'
      },
    }),
    iconCircle: (isActive: boolean) => ({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      mb: 2,
      bgcolor: isActive ? 'rgba(63, 81, 181, 0.1)' : 'rgba(63, 81, 181, 0.05)',
      borderRadius: '50%',
      width: '80px',
      height: '80px',
      transition: 'all 0.3s ease',
      transform: isActive ? 'scale(1.1)' : 'scale(1)',
    }),
    heroContainer: {
      p: { xs: 3, md: 5 },
      borderRadius: 3,
      background: 'linear-gradient(135deg, #ffffff 0%, #f5f7ff 100%)',
      border: '1px solid #e8eaf6',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    floatingElement: {
      position: 'absolute',
      borderRadius: '50%',
      opacity: 0.1,
      background: 'linear-gradient(45deg, #3f51b5, #5c6bc0)',
      animation: 'floatUp 8s infinite ease-in-out',
      zIndex: 0,
      '@keyframes floatUp': {
        '0%': { transform: 'translateY(100vh) translateX(0px) rotate(0deg)', opacity: 0.1 },
        '10%': { opacity: 0.15 },
        '50%': { transform: 'translateY(-20vh) translateX(30px) rotate(180deg)', opacity: 0.1 },
        '90%': { opacity: 0.05 },
        '100%': { transform: 'translateY(-120vh) translateX(0px) rotate(360deg)', opacity: 0 }
      }
    },
    metricCard: {
      p: 3,
      textAlign: 'center',
      borderRadius: 2,
      background: 'white',
      boxShadow: '0 3px 10px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
      }
    },
    bullet: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 1,
      my: 0.5
    }
  }), []);

  // Navigation buttons render function
  const renderNavButtons = useCallback(() => {
    if (isLoggedIn) {
      return null; // Don't show anything when logged in
    } else {
      return (
        <>
          <Button
            component={Link}
            to="/login"
            variant="outlined"
            color="primary"
            startIcon={<LoginIcon />}
            onMouseEnter={() => handleButtonHover('login', true)}
            onMouseLeave={() => handleButtonHover('login', false)}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
              transition: 'all 0.3s ease',
              transform: hoverStates['login'] ? 'translateY(-2px)' : 'translateY(0)',
              boxShadow: hoverStates['login'] ? '0 4px 8px rgba(0, 0, 0, 0.1)' : 'none'
            }}
          >
            התחברות
          </Button>
          <Button
            component={Link}
            to="/signup"
            variant="outlined"
            color="primary"
            startIcon={<PersonAddIcon />}
            onMouseEnter={() => handleButtonHover('signup', true)}
            onMouseLeave={() => handleButtonHover('signup', false)}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
              transition: 'all 0.3s ease',
              transform: hoverStates['signup'] ? 'translateY(-2px)' : 'translateY(0)',
              boxShadow: hoverStates['signup'] ? '0 4px 8px rgba(0, 0, 0, 0.1)' : 'none'
            }}
          >
            הרשמה
          </Button>
        </>
      );
    }
  }, [isLoggedIn, hoverStates, handleButtonHover]);

  // Floating bubbles for hero section (enhanced with 6 bubbles and animation delay)
  const floatingBubbles = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => ({
      size: 80 + Math.random() * 120,
      left: `${Math.random() * 90}%`,
      animationDuration: `${4 + Math.random() * 3}s`,
      animationDelay: `${Math.random() * 8}s`,
    }));
  }, []);

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header/Navigation Bar */}
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{
          bgcolor: 'white',
          borderBottom: '1px solid #e0e0e0',
          transform: isLoaded ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.5s ease'
        }}
      >
        <Container>
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 0, sm: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <GroupsIcon sx={{
                mr: 1,
                color: '#3f51b5',
                animation: isLoaded ? 'pulse 2s infinite ease-in-out' : 'none',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.1)' },
                  '100%': { transform: 'scale(1)' }
                }
              }} />
              <Typography variant="h6" component="div" sx={{ fontWeight: 700, ...styles.gradientText }}>
                TeamTrack
              </Typography>
            </Box>

            {isMobile ? (
              <>
                <IconButton
                  color="primary"
                  aria-label="menu"
                  onClick={handleClick}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={open}
                  onClose={handleClose}
                  TransitionComponent={Fade}
                >
                  {isLoggedIn ? (
                    <>
                      <MenuItem onClick={handleClose} component={Link} to="/showUploadFile">
                        <AddCircleOutlineIcon fontSize="small" sx={{ mr: 1 }} />
                        הוסף ישיבה חדשה
                      </MenuItem>
                      <MenuItem onClick={handleClose} component={Link} to="/profile">
                        <AccountCircleIcon fontSize="small" sx={{ mr: 1 }} />
                        פרופיל אישי
                      </MenuItem>
                      <MenuItem onClick={handleClose} component={Link} to="/settings">
                        <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
                        הגדרות
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={handleClose} component={Link} to="/logout">
                        <LogoutIcon fontSize="small" sx={{ mr: 1, color: '#f44336' }} />
                        <Typography color="#f44336">התנתק</Typography>
                      </MenuItem>
                    </>
                  ) : (
                    <>
                      <MenuItem onClick={handleClose} component={Link} to="/login">
                        <LoginIcon fontSize="small" sx={{ mr: 1 }} />
                        התחברות
                      </MenuItem>
                      <MenuItem onClick={handleClose} component={Link} to="/signUp">
                        <PersonAddIcon fontSize="small" sx={{ mr: 1 }} />
                        הרשמה
                      </MenuItem>
                    </>
                  )}
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                {renderNavButtons()}
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ mt: 6, mb: 8 }}>
        <Zoom in={isLoaded} style={{ transitionDelay: '100ms' }}>
          <Paper elevation={0} ref={heroRef} sx={styles.heroContainer}>
            {/* Enhanced floating background elements with 6 bubbles that float upward */}
            {floatingBubbles.map((bubble, i) => (
              <Box
                key={i}
                sx={{
                  ...styles.floatingElement,
                  width: bubble.size,
                  height: bubble.size,
                  bottom: 0,
                  left: bubble.left,
                  animationDuration: bubble.animationDuration,
                  animationDelay: bubble.animationDelay,
                }}
              />
            ))}

            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography
                component="h1"
                variant="h3"
                fontWeight="800"
                sx={{
                  mb: 2,
                  ...styles.gradientText,
                  textShadow: '0px 2px 5px rgba(0,0,0,0.05)',
                  letterSpacing: '1px',
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
              
              {/* Show signup button only if user is not logged in */}
              {!isLoggedIn && (
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  to="/signup"
                  sx={styles.primaryButton}
                >
                  הירשם עכשיו חינם
                </Button>
              )}
            </Box>
          </Paper>
        </Zoom>
      </Container>

      {/* Metrics Section */}
      <Box sx={{ py: 4, bgcolor: '#f0f3ff' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 3 }}>
            {metrics.map((metric, index) => (
              <Grow
                in={isLoaded}
                key={index}
                style={{ transformOrigin: 'center bottom', transitionDelay: `${index * 100 + 300}ms` }}
              >
                <Box sx={{ width: { xs: '100%', sm: '33%' } }}>
                  <Box sx={styles.metricCard}>
                    <Box sx={{ color: '#3f51b5', mb: 1 }}>
                      {metric.icon}
                    </Box>
                    <Typography variant="h3" component="div" fontWeight="bold" color="primary">
                      {metric.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {metric.label}
                    </Typography>
                  </Box>
                </Box>
              </Grow>
            ))}
          </Box>
        </Container>
      </Box>

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

          <Divider
            sx={{
              width: '60px',
              mx: 'auto',
              mb: 5,
              borderColor: '#3f51b5',
              borderWidth: 2,
            }}
          />

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 4,
            }}
          >
            {features.map((feature, index) => (
              <Fade
                in={isLoaded}
                key={index}
                style={{ transitionDelay: `${index * 150 + 100}ms` }}
              >
                <Box
                  onMouseEnter={() => handleFeatureHover(index)}
                  onMouseLeave={handleFeatureLeave}
                  sx={styles.featureBox(activeFeature === index)}
                >
                  <Box sx={styles.iconCircle(activeFeature === index)}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" fontWeight="600" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {feature.description}
                  </Typography>

                  <Collapse in={activeFeature === index}>
                    <Box sx={{ mt: 2 }}>
                      {feature.bullets.map((bullet, i) => (
                        <Box key={i} sx={styles.bullet}>
                          <CheckCircleIcon fontSize="small" sx={{ color: '#3f51b5', fontSize: 16 }} />
                          <Typography variant="body2" color="text.secondary">
                            {bullet}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Collapse>
                </Box>
              </Fade>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;