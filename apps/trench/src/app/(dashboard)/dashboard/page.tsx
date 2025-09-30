"use client";

import { useState, useEffect } from "react";
import { Building2, Users, GraduationCap, BookOpen, TrendingUp } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useAuth } from "@/hooks/useAuth";

// This will be fetched from the database based on user's department

export default function DashboardPage() {
  const [userType, setUserType] = useState<"STUDENT" | "FACULTY" | "ADMIN">("STUDENT");
  const { stats, loading, error } = useDashboardStats();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserType(userData.role || "student");
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  // Admin Dashboard - My Department
  if (userType === "ADMIN") {
    // Show loading or error state if not authenticated or not admin
    if (!isAuthenticated || !user || user.role !== 'ADMIN') {
      return (
        <div>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">My Department</h1>
            <p className="text-slate-600">Overview of your department's performance and statistics</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <p className="text-slate-600">Please log in as an admin to view dashboard statistics.</p>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">My Department</h1>
          <p className="text-slate-600">Overview of your department's performance and statistics</p>
        </div>

        {/* Department Info Card - Will be populated with real data */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Department of Artificial Intelligence and Data Science</h2>
              <p className="text-slate-600">Vidyavardhini's College of Engineering and Technology (Hardcoded)</p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">Error loading dashboard statistics: {error}</p>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">Faculty</h3>
                <p className="text-2xl font-bold text-slate-900">
                  {loading ? "..." : error ? "Error" : stats?.facultyCount || 0}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">Students</h3>
                <p className="text-2xl font-bold text-slate-900">
                  {loading ? "..." : error ? "Error" : stats?.studentCount || 0}
                </p>
              </div>
              <GraduationCap className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Faculty Dashboard - My Classes
  if (userType === "FACULTY") {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Faculty Dashboard</h1>
        
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">Error loading dashboard statistics: {error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">Active Classes</h3>
                <p className="text-2xl font-bold text-slate-900">
                  {loading ? "..." : error ? "Error" : "4"}
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">Total Students</h3>
                <p className="text-2xl font-bold text-slate-900">
                  {loading ? "..." : error ? "Error" : stats?.studentCount || 0}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">Assignments Due</h3>
                <p className="text-2xl font-bold text-slate-900">
                  {loading ? "..." : error ? "Error" : "8"}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">Projects Active</h3>
                <p className="text-2xl font-bold text-slate-900">
                  {loading ? "..." : error ? "Error" : "12"}
                </p>
              </div>
              <GraduationCap className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-sm text-slate-600">Graded 15 assignments</p>
                <span className="text-xs text-slate-400">2 hours ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm text-slate-600">Created new project</p>
                <span className="text-xs text-slate-400">1 day ago</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Upcoming Deadlines</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">Data Structures Project</p>
                  <p className="text-xs text-slate-500">Due in 3 days</p>
                </div>
                <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded">Due Soon</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">Algorithm Quiz</p>
                  <p className="text-xs text-slate-500">Due in 1 week</p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Scheduled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Student Dashboard
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Active Projects</h3>
          <p className="text-2xl font-bold text-slate-900">3</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Assignments Due</h3>
          <p className="text-2xl font-bold text-slate-900">2</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Average Grade</h3>
          <p className="text-2xl font-bold text-slate-900">87%</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Hours Studied</h3>
          <p className="text-2xl font-bold text-slate-900">24</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-sm text-slate-600">Submitted Math Assignment</p>
              <span className="text-xs text-slate-400">2 hours ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm text-slate-600">Completed Science Quiz</p>
              <span className="text-xs text-slate-400">1 day ago</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Upcoming Deadlines</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900">Data Structures Project</p>
                <p className="text-xs text-slate-500">Due in 2 days</p>
              </div>
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Urgent</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900">Algorithm Assignment</p>
                <p className="text-xs text-slate-500">Due in 5 days</p>
              </div>
              <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded">Due Soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
