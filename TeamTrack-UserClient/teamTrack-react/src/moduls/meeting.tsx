export type Meeting = {
  id: number | string;
  meetingName: string;
  createdAt: string;
  updatedAt?: string;
  createdByUserId?: number;
  createdByUserFullName?: string;
  transcriptionLink?: string;
  summaryLink?: string;
};
