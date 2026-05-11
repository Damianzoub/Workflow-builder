import NewWorkflowButton from '@/components/workflows/NewWorkflowButton'
import WorkflowsTable from '@/components/workflows/WorkflowsTable'

export default function WorkflowsPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Workflows</h1>
          <p className="mt-1 text-sm text-gray-400">All your agent workflows</p>
        </div>
        <NewWorkflowButton />
      </div>
      <WorkflowsTable />
    </div>
  )
}
