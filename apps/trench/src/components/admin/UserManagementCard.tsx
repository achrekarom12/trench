"use client";

import { Student, Faculty, Admin as AdminUser } from "@/types/user";
import { GraduationCap, UserCheck, Users, Building2 } from "lucide-react";

interface UserManagementCardProps {
  user: Student | Faculty | AdminUser;
  onEdit?: (user: Student | Faculty | AdminUser) => void;
  onDelete?: (userId: string) => void;
  showDepartment?: boolean;
}

export default function UserManagementCard({ 
  user, 
  onEdit, 
  onDelete, 
  showDepartment = true 
}: UserManagementCardProps) {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "student":
        return <GraduationCap className="w-5 h-5 text-orange-600" />;
      case "faculty":
        return <Users className="w-5 h-5 text-purple-600" />;
      case "admin":
        return <UserCheck className="w-5 h-5 text-blue-600" />;
      default:
        return <Users className="w-5 h-5 text-slate-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "student":
        return "bg-orange-100 text-orange-600";
      case "faculty":
        return "bg-purple-100 text-purple-600";
      case "admin":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getDepartmentInfo = () => {
    if (user.role === "student" && "department" in user && user.department) {
      return user.department.name;
    }
    if (user.role === "faculty" && "department" in user && user.department) {
      return user.department.name;
    }
    if (user.role === "admin" && "department" in user && user.department) {
      return user.department.name;
    }
    return "No Department";
  };

  const getAdditionalInfo = () => {
    if (user.role === "student" && "year" in user) {
      return `Year ${user.year}`;
    }
    if (user.role === "faculty" && "designation" in user) {
      return user.designation || "Faculty";
    }
    if (user.role === "admin") {
      return "Department Admin";
    }
    return "";
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getRoleColor(user.role)}`}>
            {getRoleIcon(user.role)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 truncate">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-xs text-slate-500">{user.email}</p>
            {showDepartment && (
              <div className="flex items-center space-x-1 mt-1">
                <Building2 className="w-3 h-3 text-slate-400" />
                <span className="text-xs text-slate-500">{getDepartmentInfo()}</span>
              </div>
            )}
            {getAdditionalInfo() && (
              <p className="text-xs text-slate-600 mt-1">{getAdditionalInfo()}</p>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(user)}
              className="text-slate-400 hover:text-blue-600 transition-colors"
              title="Edit User"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(user.id)}
              className="text-slate-400 hover:text-red-600 transition-colors"
              title="Delete User"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
