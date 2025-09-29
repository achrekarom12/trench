"use client";

import { useState, useEffect } from "react";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
}

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setCourses([
          {
            id: "1",
            title: "Advanced Mathematics",
            description: "Comprehensive course covering calculus, algebra, and statistics",
            instructor: "Dr. Sarah Johnson",
            progress: 75,
            totalLessons: 24,
            completedLessons: 18
          },
          {
            id: "2", 
            title: "Computer Science Fundamentals",
            description: "Introduction to programming, algorithms, and data structures",
            instructor: "Prof. Michael Chen",
            progress: 45,
            totalLessons: 32,
            completedLessons: 14
          }
        ]);
      } catch (err) {
        setError("Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return { courses, loading, error };
}
