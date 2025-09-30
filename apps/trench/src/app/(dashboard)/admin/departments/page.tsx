"use client";

import { useState, useEffect } from "react";
import { Building2, Users, GraduationCap, BookOpen, TrendingUp } from "lucide-react";

// Mock data for admin's department - in real app, this would come from API
const mockDepartment = {
  id: "1",
  name: "Computer Science",
  collegeId: "1",
  college: {
    id: "1",
    name: "MIT College of Engineering",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockStats = {
  totalFaculty: 12,
  totalStudents: 156,
  totalCourses: 8,
  activeAssignments: 24,
  averageGrade: 85.2,
  completionRate: 92.5,
};

export default function MyDepartmentPage() {
  const [department] = useState(mockDepartment);
  const [stats] = useState(mockStats);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">My Department</h1>
        <p className="text-slate-600">Overview of your department's performance and statistics</p>
      </div>

      {/* Department Info Card */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{department.name}</h2>
            <p className="text-slate-600">{department.college.name}</p>
            <p className="text-sm text-slate-500">Department ID: {department.id}</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-2">Faculty</h3>
              <p className="text-2xl font-bold text-slate-900">{stats.totalFaculty}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-2">Students</h3>
              <p className="text-2xl font-bold text-slate-900">{stats.totalStudents}</p>
            </div>
            <GraduationCap className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-2">Courses</h3>
              <p className="text-2xl font-bold text-slate-900">{stats.totalCourses}</p>
            </div>
            <BookOpen className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-2">Active Assignments</h3>
              <p className="text-2xl font-bold text-slate-900">{stats.activeAssignments}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Academic Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Average Grade</span>
              <span className="text-2xl font-bold text-slate-900">{stats.averageGrade}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Completion Rate</span>
              <span className="text-2xl font-bold text-slate-900">{stats.completionRate}%</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-slate-600">5 new assignments created this week</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-slate-600">12 students enrolled in new courses</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-slate-600">3 faculty members joined the department</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-slate-700">Manage Faculty</span>
          </button>
          <button className="flex items-center space-x-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <GraduationCap className="w-5 h-5 text-green-600" />
            <span className="text-slate-700">View Students</span>
          </button>
          <button className="flex items-center space-x-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <BookOpen className="w-5 h-5 text-purple-600" />
            <span className="text-slate-700">Manage Courses</span>
          </button>
        </div>
      </div>
    </div>
  );
}
