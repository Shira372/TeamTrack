export interface User {
  id: number;
  userName: string;
  passwordHash?: string;  // רק לשליחה ב-POST/PUT, לא לקבלה מהשרת
  email: string;
  company?: string;
  role?: string;
}

export interface LoginRequest {
  userName: string;
  passwordHash: string;
}

export interface SignupRequest {
  userName: string;
  passwordHash: string;
  email: string;
  company?: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn?: number;
}

