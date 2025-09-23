import DashboardOverview from './DashboardOverview';

export default function DashboardContent() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your store today.</p>
      </div>
      <DashboardOverview />
    </div>
  );
}