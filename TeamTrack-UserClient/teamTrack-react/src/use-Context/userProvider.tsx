import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from 'react';
import { User } from '../moduls/user';

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser) as User;
        if (process.env.NODE_ENV !== 'production') {
          console.log('[UserProvider] Loaded user from localStorage:', parsedUser);
        }
        setUserState(parsedUser);
      }
    } catch (error) {
      console.error('[UserProvider] Failed to parse user from localStorage', error);
      localStorage.removeItem('user');
    }
  }, []);

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('user');
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('tt_token');
    setUserState(null);
    if (process.env.NODE_ENV !== 'production') {
      console.log('[UserProvider] User logged out');
    }
  };

  const value = useMemo(() => ({ user, setUser, logout }), [user]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserProvider;
