export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Total Courses</h3>
          <p className="text-2xl font-bold text-slate-900">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Assignments Due</h3>
          <p className="text-2xl font-bold text-slate-900">3</p>
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
                <p className="text-sm font-medium text-slate-900">History Essay</p>
                <p className="text-xs text-slate-500">Due in 2 days</p>
              </div>
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Urgent</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900">Physics Lab Report</p>
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
