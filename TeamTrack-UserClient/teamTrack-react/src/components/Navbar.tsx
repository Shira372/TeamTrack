import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { useUser } from '../use-Context/userProvider';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null; // מונע הצגת Navbar אם אין משתמש עדיין

  const firstLetter = user.userName?.charAt(0)?.toUpperCase() || '?';

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" component="div" sx={{ mr: 2 }}>
            TeamTrack
          </Typography>

          <Avatar
            sx={{
              bgcolor: 'transparent',
              background: 'linear-gradient(135deg, #0d47a1 0%, #90caf9 100%)',
              color: '#fff',
              width: 40,
              height: 40,
              mr: 1,
              fontWeight: 'bold',
            }}
          >
            {firstLetter}
          </Avatar>
        </Box>

        <Box>
          <Button color="inherit" component={Link} to="/meetings">Meetings</Button>
          <Button color="inherit" component={Link} to="/newMeeting">New Meeting</Button>
          <Button color="inherit" component={Link} to="/uploadFile">Upload File</Button>
          <Button color="inherit" component={Link} to="/keypoints">Key Points</Button>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
