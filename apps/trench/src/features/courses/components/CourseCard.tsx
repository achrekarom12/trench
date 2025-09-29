interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    instructor: string;
    progress: number;
    totalLessons: number;
    completedLessons: number;
  };
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">{course.title}</h3>
          <p className="text-sm text-slate-600">by {course.instructor}</p>
        </div>
        <span className="text-sm text-slate-500">{course.progress}%</span>
      </div>
      
      <p className="text-sm text-slate-600 mb-4">{course.description}</p>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Progress</span>
          <span className="text-slate-900">{course.completedLessons}/{course.totalLessons} lessons</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${course.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
