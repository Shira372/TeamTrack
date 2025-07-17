// תואם ל-UserDTO ב-C#
export interface User {
  id: number
  userName: string
  email: string
  company?: string | null
  role: string 
}

export interface Meeting {
  id: number
  meetingName: string
  createdByUserId?: number | null
  createdByUserFullName?: string | null
  summaryLink?: string | null
  transcriptionLink?: string | null
  createdAt: string 
  updatedAt?: string | null
  participants?: User[] | null 
}
