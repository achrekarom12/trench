"use client";

import { useState, useEffect } from "react";
import { User } from "@/types/user";
import { apiClient } from "@/lib/api";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user in localStorage
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (storedUser && token) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      const response = await apiClient.login(email, password, rememberMe);
      
      if (response.success) {
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("token", response.token);
        setUser(response.user);
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      // Call logout API if token exists
      const token = localStorage.getItem("token");
      if (token) {
        await apiClient.logout();
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Clear local storage regardless of API call result
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };
}
