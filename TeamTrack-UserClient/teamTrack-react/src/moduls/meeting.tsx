export type Meeting = {
  id: number;
  meetingName: string;
  createdByUserId: number;
  createdByUserFullName?: string; 
  transcriptionLink?: string;    
  summaryLink?: string;
  createdAt: Date;
  updatedAt?: Date;
};
