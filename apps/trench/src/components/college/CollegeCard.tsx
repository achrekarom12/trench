"use client";

import { College } from "@/types/user";
import { Building2, MapPin, Phone, Mail, Globe } from "lucide-react";

interface CollegeCardProps {
  college: College;
  onEdit?: (college: College) => void;
  onDelete?: (collegeId: string) => void;
}

export default function CollegeCard({ college, onEdit, onDelete }: CollegeCardProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{college.name}</h3>
            <p className="text-sm text-slate-500">College</p>
          </div>
        </div>
        <div className="flex space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(college)}
              className="text-slate-400 hover:text-blue-600 transition-colors"
              title="Edit College"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(college.id)}
              className="text-slate-400 hover:text-red-600 transition-colors"
              title="Delete College"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {college.address && (
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <MapPin className="w-4 h-4" />
            <span>{college.address}</span>
          </div>
        )}
        {college.phone && (
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <Phone className="w-4 h-4" />
            <span>{college.phone}</span>
          </div>
        )}
        {college.email && (
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <Mail className="w-4 h-4" />
            <span>{college.email}</span>
          </div>
        )}
        {college.website && (
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <Globe className="w-4 h-4" />
            <a href={college.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
              {college.website}
            </a>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Departments</span>
          <span className="font-medium text-slate-900">0</span>
        </div>
      </div>
    </div>
  );
}
