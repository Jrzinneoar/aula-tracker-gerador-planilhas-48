
export interface Student {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  created_at: string;
}

export interface Subject {
  id: string;
  name: string;
  description?: string;
  teacher: string;
  created_at: string;
}

export interface ClassSession {
  id: string;
  subject_id: string;
  date: string;
  topic: string;
  notes?: string;
  created_at: string;
}

export interface AttendanceRecord {
  id: string;
  class_session_id: string;
  student_id: string;
  notes?: string;
  created_at: string;
}

export interface Absence {
  id: string;
  student_id: string;
  subject_id: string;
  absence_date: string;
  reason?: string;
  justified: boolean;
  created_at: string;
}
