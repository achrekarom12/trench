export interface College {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Department {
  id: string;
  name: string;
  collegeId: string;
  college?: College;
  createdAt: Date;
  updatedAt: Date;
}

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
  rollNumber: string;
  departmentId: string;
  department?: Department;
  year: number;
  division?: string;
  academicYear?: string;
  prn?: string;
}

export interface Faculty extends User {
  role: "faculty";
  employeeId: string;
  departmentId: string;
  department?: Department;
  designation?: string;
  specialization?: string;
}

export interface Admin extends User {
  role: "admin";
  departmentId: string;
  department?: Department;
  permissions: string[];
}
