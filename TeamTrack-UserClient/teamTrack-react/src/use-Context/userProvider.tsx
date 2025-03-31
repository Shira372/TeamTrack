import React, { createContext,useContext,useState,ReactElement } from 'react';
import { User } from '../moduls/user';

// מבנה הקונטקסט שיכלול את כל הנתונים
type UserContextType = {
    user: User | null;
    setUser: (user: User) => void;
    logout: () => void; 
};

// יצירת הקונטקסט
export const UserContext = createContext<UserContextType | undefined>(undefined);

// קומפוננטת הקונטקסט
const UserProvider = ({ children }: { children: ReactElement }) => {
    const [user, setUser] = useState<User | null>({
        Id: 0,
        UserName: "",
        Password: "",
        Company: "",
        Email: "",
    });

    const logout = () => {
        setUser(null); // מנקה את המידע על המשתמש
    };

    return (
        <UserContext.Provider value={{ user, setUser,logout}}>
            {children}
        </UserContext.Provider>
    );
};
// פונקציה בטוחה לשימוש בקונטקסט
export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}

export default UserProvider;


