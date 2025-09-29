export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "student" | "faculty" | "admin";
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Student extends User {
  role: "student";
  studentId: string;
  year: number;
  major: string;
  gpa?: number;
}

export interface Faculty extends User {
  role: "faculty";
  facultyId: string;
  department: string;
  title: string;
  office: string;
}

export interface Admin extends User {
  role: "admin";
  permissions: string[];
}
