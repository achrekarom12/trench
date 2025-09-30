"use client";

import { Department } from "@/types/user";
import { Users, GraduationCap, UserCheck } from "lucide-react";

interface DepartmentCardProps {
  department: Department;
  onEdit?: (department: Department) => void;
  onDelete?: (departmentId: string) => void;
  showCollege?: boolean;
}

export default function DepartmentCard({ 
  department, 
  onEdit, 
  onDelete, 
  showCollege = false 
}: DepartmentCardProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{department.name}</h3>
            {showCollege && department.college && (
              <p className="text-sm text-slate-500">{department.college.name}</p>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(department)}
              className="text-slate-400 hover:text-blue-600 transition-colors"
              title="Edit Department"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(department.id)}
              className="text-slate-400 hover:text-red-600 transition-colors"
              title="Delete Department"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mx-auto mb-2">
            <UserCheck className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xs text-slate-500">Admin</p>
          <p className="text-sm font-semibold text-slate-900">1</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg mx-auto mb-2">
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-xs text-slate-500">Faculty</p>
          <p className="text-sm font-semibold text-slate-900">0</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-lg mx-auto mb-2">
            <GraduationCap className="w-4 h-4 text-orange-600" />
          </div>
          <p className="text-xs text-slate-500">Students</p>
          <p className="text-sm font-semibold text-slate-900">0</p>
        </div>
      </div>
    </div>
  );
}
