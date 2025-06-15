export interface User {
    id: number
    name: string
    email: string
    role: string
    isActive: boolean
    createdAt: Date
  }
  
  export interface LoginRequest {
    email: string
    password: string
  }
  
  export interface SignupRequest {
    name: string
    email: string
    password: string
    confirmPassword: string
  }
  
  export interface AuthResponse {
    token: string
    user: User
    expiresIn: number
  }
  