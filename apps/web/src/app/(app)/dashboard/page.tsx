import StatCard from '@/components/dashboard/StatCard'
import RunsChart from '@/components/dashboard/RunsChart'
import ActivityFeed from '@/components/dashboard/ActivityFeed'
import WorkflowsPreview from '@/components/dashboard/WorkflowsPreview'
import { mockStats } from '@/mock/stats'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-400">Overview of your workflow activity</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total Workflows" value={mockStats.totalWorkflows} />
        <StatCard label="Runs Today"       value={mockStats.runsToday}      variant="indigo" />
        <StatCard label="Success Rate"     value={`${mockStats.successRate}%`} variant="green" />
        <StatCard label="Active Now"       value={mockStats.activeNow}      variant="amber" />
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3"><RunsChart /></div>
        <div className="col-span-2"><ActivityFeed /></div>
      </div>

      {/* Workflows preview */}
      <WorkflowsPreview />
    </div>
  )
}
