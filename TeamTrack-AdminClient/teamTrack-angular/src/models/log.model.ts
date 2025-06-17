// models/log.model.ts
export interface Log {
    id: number;
    level: string;
    message: string;
    timestamp: string; // או Date לפי הצורך
  }
  