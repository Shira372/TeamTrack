import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home';
import UserProvider from './use-Context/userProvider';

const routes = createBrowserRouter([
  {
    path: '/', // דף הבית הראשי
    element: <App />, // ה-App יציג את דף הבית
    children: [
      {
        path: '/', 
        element: <Navigate to="/home" />, // הפניה אוטומטית ל-home
      },
    ],
  },
  {
    path: '/home', // דף הבית
    element: <Home />, // קישור לדף הבית
  },
  {
    path: '/login',  // ניווט לדף התחברות
    element: <Login />,
  },
  {
    path: '/signUp',  // ניווט לדף הרשמה
    element: <SignUp />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <UserProvider>
    <RouterProvider router={routes} />
  </UserProvider>
);
