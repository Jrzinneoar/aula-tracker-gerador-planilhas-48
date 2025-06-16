
export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  teacher: string;
  createdAt: Date;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  subjectId: string;
  date: Date;
  present: boolean;
  notes?: string;
}

export interface ClassSession {
  id: string;
  subjectId: string;
  date: Date;
  topic: string;
  attendanceRecords: AttendanceRecord[];
  createdAt: Date;
}
