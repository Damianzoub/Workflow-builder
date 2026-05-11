import { cn } from '@/lib/utils'
import type { WorkflowStatus } from '@/types'

const variants: Record<WorkflowStatus, string> = {
  active: 'bg-emerald-500/15 text-emerald-400 ring-emerald-500/20',
  draft:  'bg-gray-500/15 text-gray-400 ring-gray-500/20',
  error:  'bg-red-500/15 text-red-400 ring-red-500/20',
}

const labels: Record<WorkflowStatus, string> = {
  active: 'Active',
  draft:  'Draft',
  error:  'Error',
}

export default function StatusBadge({ status }: { status: WorkflowStatus }) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
      variants[status]
    )}>
      {labels[status]}
    </span>
  )
}
