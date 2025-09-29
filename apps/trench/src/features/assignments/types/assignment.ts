export interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  dueDate: Date;
  status: "not_started" | "in_progress" | "submitted" | "graded";
  points: number;
  maxPoints: number;
  grade?: number;
  submittedAt?: Date;
  gradedAt?: Date;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  content: string;
  attachments: string[];
  submittedAt: Date;
  grade?: number;
  feedback?: string;
}
