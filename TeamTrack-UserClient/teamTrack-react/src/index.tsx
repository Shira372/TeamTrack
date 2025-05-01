import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import UploadFile from './components/UploadFile';
import Home from './components/Home';
import Meetings from './components/Meetings'; // הוספת קומפוננטה Meetings
import MeetingDetailPage from './components/MeetingDetail'; // הוספת קומפוננטה MeetingDetailPage
import NewMeeting from './components/NewMeeting'; // הוספת קומפוננטה NewMeeting
import UserProvider from './use-Context/userProvider';

// הגדרת הנתיבים
const routes = createBrowserRouter([
  {
    path: '/', // דף הבית הראשי
    element: <Navigate to="/home" />, // הפניה אוטומטית ל-home
  },
  {
    path: '/home', // דף הבית
    element: <Home />,
  },
  {
    path: '/login', // ניווט לדף התחברות
    element: <Login />,
  },
  {
    path: '/signUp', // ניווט לדף הרשמה
    element: <SignUp />,
  },
  {
    path: '/uploadFile', // ניווט לדף העלאת קובץ
    element: <UploadFile />,
  },
  {
    path: '/meetings', // ניווט לדף Meetings
    element: <Meetings />,
  },
  {
    path: '/meetingDetail/:id', // ניווט לדף MeetingDetailPage
    element: <MeetingDetailPage />,
  },
  {
    path: '/newMeeting', // ניווט לדף NewMeeting
    element: <NewMeeting />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <UserProvider>
    <RouterProvider router={routes} />
  </UserProvider>
);
