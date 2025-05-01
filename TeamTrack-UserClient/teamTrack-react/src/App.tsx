// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Button, Box, Typography, Container } from '@mui/material'; // Material UI
// import './App.css'; // אם יש לך עיצוב מותאם אישית

// const App = () => {
//   return (
//     <Container 
//       maxWidth="sm" 
//       style={{ 
//         display: 'flex', 
//         flexDirection: 'column', 
//         justifyContent: 'center', 
//         alignItems: 'center', 
//         height: '100vh', // ממקם את כל התוכן במרכז
//         padding: '20px'
//       }}
//     >
//       {/* כותרת ראשית */}
//       <Typography variant="h3" color="primary" gutterBottom>
//         Welcome to the Team Meeting Management App
//       </Typography>

//       {/* תיאור קצר */}
//       <Typography variant="h6" color="textSecondary" paragraph>
//         Manage your team's meetings, track summaries, and stay organized.
//       </Typography>

//       {/* קישורים עם כפתורים מעוצבים */}
//       <Box display="flex" flexDirection="column" gap="20px">
//         <Link to="/login" style={{ textDecoration: 'none' }}>
//           {/* כפתור התחברות */}
//           <Button 
//             variant="contained" 
//             color="primary" 
//             size="large" 
//             style={{ width: '250px', padding: '15px', fontSize: '16px' }}
//           >
//             Login
//           </Button>
//         </Link>

//         <Link to="/signUp" style={{ textDecoration: 'none' }}>
//           {/* כפתור הרשמה */}
//           <Button 
//             variant="contained" 
//             color="secondary" 
//             size="large" 
//             style={{ width: '250px', padding: '15px', fontSize: '16px' }}
//           >
//             Sign Up
//           </Button>
//         </Link>

//         <Link to="/home" style={{ textDecoration: 'none' }}>
//           {/* כפתור לבית */}
//           <Button 
//             variant="contained" 
//             color="primary" 
//             size="large" 
//             style={{ width: '250px', padding: '15px', fontSize: '16px' }}
//           >
//             Home
//           </Button>
//         </Link>

//         <Link to="/meetings" style={{ textDecoration: 'none' }}>
//           {/* כפתור לצפייה בפגישות */}
//           <Button 
//             variant="contained" 
//             color="primary" 
//             size="large" 
//             style={{ width: '250px', padding: '15px', fontSize: '16px' }}
//           >
//             View Meetings
//           </Button>
//         </Link>

//         <Link to="/newMeeting" style={{ textDecoration: 'none' }}>
//           {/* כפתור להוספת פגישה חדשה */}
//           <Button 
//             variant="contained" 
//             color="primary" 
//             size="large" 
//             style={{ width: '250px', padding: '15px', fontSize: '16px' }}
//           >
//             New Meeting
//           </Button>
//         </Link>
//       </Box>
//     </Container>
//   );
// };

// export default App;
// import Home from './components/Home';

// const App = () => {
//   return (
//     <div>
//       <Home></Home>
//     </div>
//   );
// };

// export default App
import { useState, useRef } from 'react';
import { Calendar, Clock, Users, FileText, CheckSquare, Upload, Download } from 'lucide-react';

// הקומפוננטה של ה-Footer שתהיה משותפת לכל העמודים
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-6 mt-auto">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-bold">סיכום פגישות צוות</h3>
            <p className="text-gray-300">האפליקציה המושלמת לניהול פגישות</p>
          </div>
          
          <div className="flex space-x-6 rtl:space-x-reverse">
            <a href="#" className="text-gray-300 hover:text-white">צור קשר</a>
            <a href="#" className="text-gray-300 hover:text-white">אודות</a>
            <a href="#" className="text-gray-300 hover:text-white">פרטיות</a>
            <a href="#" className="text-gray-300 hover:text-white">תנאי שימוש</a>
          </div>
        </div>
        <div className="mt-4 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} אפליקציית סיכום פגישות. כל הזכויות שמורות.
        </div>
      </div>
    </footer>
  );
};

// קומפוננטת התפריט
const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="font-bold text-xl">סיכום פגישות</div>
        <div className="flex space-x-4 rtl:space-x-reverse">
          <a href="#" className="hover:text-blue-200">דף הבית</a>
          <a href="#" className="hover:text-blue-200">פגישות</a>
          <a href="#" className="hover:text-blue-200">משימות</a>
          <a href="#" className="hover:text-blue-200">הגדרות</a>
        </div>
      </div>
    </nav>
  );
};

// קומפוננטת דף הבית
const Home = () => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [meetings, setMeetings] = useState([
    {
      id: 1,
      title: "פגישת צוות פיתוח",
      date: "2025-05-01",
      time: "10:00",
      participants: ["יוסי כהן", "רונית לוי", "דני אבידן"],
      summary: "דיון בפיתוח התכונות החדשות של האפליקציה",
      summaryFile: "summary_meeting_1.pdf"
    },
    {
      id: 2,
      title: "פגישת סטטוס שבועית",
      date: "2025-05-03",
      time: "13:30",
      participants: ["מיכל גולן", "אורי שמיר", "יעל אדלר"],
      summary: "עדכון התקדמות הפרויקטים השונים",
      summaryFile: "summary_meeting_2.pdf"
    }
  ]);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar />
      
      <main className="container mx-auto p-4 flex-grow">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">ברוכים הבאים לאפליקציית סיכום פגישות הצוות</h1>
          <p className="mb-4 text-gray-600">נהל את כל פגישות הצוות שלך במקום אחד, צור סיכומים ומשימות, ועקוב אחרי ההתקדמות.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg shadow flex items-center">
              <Calendar className="text-blue-500 mr-3" />
              <div>
                <h3 className="font-bold">תזמון פגישות</h3>
                <p className="text-sm text-gray-600">צור ונהל את לוח הפגישות שלך</p>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg shadow flex items-center">
              <Upload className="text-green-500 mr-3" />
              <div>
                <h3 className="font-bold">העלאת קבצים</h3>
                <p className="text-sm text-gray-600">העלה קבצים לסיכום אוטומטי</p>
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg shadow flex items-center">
              <FileText className="text-yellow-500 mr-3" />
              <div>
                <h3 className="font-bold">סיכומי פגישות</h3>
                <p className="text-sm text-gray-600">צפה בסיכומים שנוצרו אוטומטית</p>
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg shadow flex items-center">
              <Download className="text-purple-500 mr-3" />
              <div>
                <h3 className="font-bold">הורדת סיכומים</h3>
                <p className="text-sm text-gray-600">הורד את הסיכומים ושתף אותם</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">פגישות קרובות</h2>
            <div className="flex space-x-3 rtl:space-x-reverse">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center">
                <Upload className="w-4 h-4 ml-2" />
                העלאת קובץ חדש
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
                <Calendar className="w-4 h-4 ml-2" />
                פגישה חדשה
              </button>
            </div>
          </div>
          
          {/* רכיב לעלאת קבצים */}
          <div className="mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
            <input
              type="file"
              id="fileUpload"
              className="hidden"
            />
            <label htmlFor="fileUpload" className="cursor-pointer">
              <div className="flex flex-col items-center">
                <Upload className="text-blue-500 w-12 h-12 mb-2" />
                <p className="font-medium text-gray-700">גרור קבצים לכאן או לחץ כדי להעלות</p>
                <p className="text-sm text-gray-500 mt-1">קבצי DOC, DOCX, PDF, TXT (עד 10MB)</p>
              </div>
            </label>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-gray-600">נושא</th>
                  <th className="p-3 text-gray-600">תאריך</th>
                  <th className="p-3 text-gray-600">שעה</th>
                  <th className="p-3 text-gray-600">משתתפים</th>
                  <th className="p-3 text-gray-600">סיכום</th>
                  <th className="p-3 text-gray-600">קובץ מסוכם</th>
                  <th className="p-3 text-gray-600">העלאת קובץ</th>
                </tr>
              </thead>
              <tbody>
                {meetings.map(meeting => (
                  <tr key={meeting.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{meeting.title}</td>
                    <td className="p-3">{meeting.date}</td>
                    <td className="p-3">{meeting.time}</td>
                    <td className="p-3">{meeting.participants.join(", ")}</td>
                    <td className="p-3 truncate max-w-xs">{meeting.summary}</td>
                    <td className="p-3">
                      {meeting.summaryFile ? (
                        <a href={`/files/${meeting.summaryFile}`} className="text-blue-600 hover:text-blue-800 flex items-center">
                          <FileText className="w-4 h-4 mr-1" />
                          צפייה בסיכום
                        </a>
                      ) : (
                        <span className="text-gray-400">אין סיכום</span>
                      )}
                    </td>
                    <td className="p-3">
                      <button className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm flex items-center">
                        <span className="mr-1">העלאת קובץ</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

// קומפוננטה ראשית של האפליקציה
const App = () => {
  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Home />
    </div>
  );
};

export default App;