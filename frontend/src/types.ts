// src/types.ts
export interface ClassRequest {
    _id: string;
    studentId: {
      _id: string;
      name: string;
      email: string;
    };
    subject: string;
    requestedDate: Date;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
  }
  
  export interface ScheduledClass {
    _id: string;
    studentId: {
      _id: string;
      name: string;
      grade: string;
    };
    teacherId: {
      _id: string;
      name: string;
    };
    subject: string;
    date: Date;
    time: string;
    status: 'scheduled' | 'completed' | 'rescheduled';
    meetingLink?: string;
  }
  
  export interface StudentDetails {
    _id: string;
    name: string;
    email: string;
    grade: string;
    schoolBoard: string;
    dateOfBirth: Date;
    subjects: Array<{
      subject: string;
      teacherId: string;
    }>;
  }

  export interface ClassRequestPayload {
    studentId: string;
    subject: string;
    requestedDate: string; // ISO format
  }
  
  export interface ClassRequestResponse {
    _id: string;
    studentId: string;
    subject: string;
    requestedDate: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
  }