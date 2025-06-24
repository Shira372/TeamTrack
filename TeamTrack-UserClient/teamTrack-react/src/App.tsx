import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useUser } from './use-Context/userProvider';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Meetings from './components/Meetings';
import MeetingDetail from './components/MeetingDetail';
import NewMeeting from './components/NewMeeting';
import Login from './components/Login';
import SignUp from './components/SignUp';
import UploadFile from './components/UploadFile';
import KeyPointsProcessing from './components/KeyPointsProcessing';
import ErrorPage from './components/ErrorPage';

const App = () => {
  const { user } = useUser();
  const location = useLocation();

  const path = location.pathname.toLowerCase();
  const isAuthRoute = ["/login", "/signup"].includes(path);

  if (isAuthRoute) {
    return (
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/home" />} />
        <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/home" />} />
      </Routes>
    );
  }

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      {user && <Navbar />}

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/meetings" element={user ? <Meetings /> : <Navigate to="/login" />} />
          <Route path="/meetings/:id" element={user ? <MeetingDetail /> : <Navigate to="/login" />} />
          <Route path="/newMeeting" element={user ? <NewMeeting /> : <Navigate to="/login" />} />
          <Route path="/uploadFile" element={user ? <UploadFile /> : <Navigate to="/login" />} />
          <Route path="/keypoints" element={user ? <KeyPointsProcessing /> : <Navigate to="/login" />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
};

export default App;
