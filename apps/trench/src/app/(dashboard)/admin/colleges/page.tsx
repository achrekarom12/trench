"use client";

import { useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import CollegeCard from "@/components/college/CollegeCard";
import { College } from "@/types/user";

// Mock data - in real app, this would come from API
const mockColleges: College[] = [
  {
    id: "1",
    name: "MIT College of Engineering",
    address: "123 Tech Street, Cambridge, MA",
    phone: "+1 (555) 123-4567",
    email: "info@mit.edu",
    website: "https://mit.edu",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2", 
    name: "Stanford University",
    address: "450 Serra Mall, Stanford, CA",
    phone: "+1 (650) 723-2300",
    email: "admissions@stanford.edu",
    website: "https://stanford.edu",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function CollegesPage() {
  const [colleges] = useState<College[]>(mockColleges);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredColleges = colleges.filter(college =>
    college.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditCollege = (college: College) => {
    console.log("Edit college:", college);
    // Implement edit functionality
  };

  const handleDeleteCollege = (collegeId: string) => {
    console.log("Delete college:", collegeId);
    // Implement delete functionality
  };

  const handleAddCollege = () => {
    console.log("Add new college");
    // Implement add functionality
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Colleges</h1>
          <p className="text-slate-600">Manage colleges and their departments</p>
        </div>
        <button
          onClick={handleAddCollege}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add College</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search colleges..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
          <Filter className="w-4 h-4" />
          <span>Filter</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Total Colleges</h3>
          <p className="text-2xl font-bold text-slate-900">{colleges.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Total Departments</h3>
          <p className="text-2xl font-bold text-slate-900">-</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Total Users</h3>
          <p className="text-2xl font-bold text-slate-900">-</p>
        </div>
      </div>

      {/* Colleges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredColleges.map((college) => (
          <CollegeCard
            key={college.id}
            college={college}
            onEdit={handleEditCollege}
            onDelete={handleDeleteCollege}
          />
        ))}
      </div>

      {filteredColleges.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No colleges found</h3>
          <p className="text-slate-500 mb-4">
            {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first college"}
          </p>
          {!searchTerm && (
            <button
              onClick={handleAddCollege}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add College
            </button>
          )}
        </div>
      )}
    </div>
  );
}
