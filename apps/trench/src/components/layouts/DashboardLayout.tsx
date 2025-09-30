"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface DashboardLayoutProps {
  children: ReactNode;
  userType: "student" | "faculty" | "admin";
}

export default function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const [userName, setUserName] = useState("User");
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (user) {
      setUserName(user.name || "User");
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-slate-200">
            <h1 className="text-xl font-bold text-slate-900">Trench</h1>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <div className="space-y-2">
              <a
                href="/dashboard"
                className="flex items-center px-3 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100"
              >
                Dashboard
              </a>
              {userType === "student" && (
                <>
                  <a
                    href="/projects"
                    className="flex items-center px-3 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100"
                  >
                    Projects
                  </a>
                </>
              )}
              {userType === "faculty" && (
                <>
                  <a
                    href="/students"
                    className="flex items-center px-3 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100"
                  >
                    Students
                  </a>
                  <a
                    href="/projects"
                    className="flex items-center px-3 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100"
                  >
                    Projects
                  </a>
                </>
              )}
              {userType === "admin" && (
                <>
                  <a
                    href="/dashboard"
                    className="flex items-center px-3 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100"
                  >
                    Dashboard
                  </a>
                </>
              )}
            </div>
          </nav>
          
          {/* User Profile */}
          <div className="px-4 py-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{userName}</p>
                  <p className="text-xs text-slate-500 capitalize">{userType}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
                title="Logout"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="pl-64">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
