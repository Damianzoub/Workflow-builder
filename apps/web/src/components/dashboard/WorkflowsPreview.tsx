import Link from 'next/link'
import { mockWorkflows } from '@/mock/workflows'
import StatusBadge from '@/components/workflows/StatusBadge'

export default function WorkflowsPreview() {
  const preview = mockWorkflows.slice(0, 3)

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800">
      <div className="flex items-center justify-between border-b border-gray-700 px-5 py-3">
        <p className="text-sm font-medium text-white">Workflows</p>
        <Link href="/workflows" className="text-xs text-indigo-400 hover:text-indigo-300">
          View all →
        </Link>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700/50">
            <th className="px-5 py-2 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Name</th>
            <th className="px-5 py-2 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Modified</th>
            <th className="px-5 py-2 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Creator</th>
          </tr>
        </thead>
        <tbody>
          {preview.map((wf) => (
            <tr key={wf.id} className="border-b border-gray-700/30 last:border-0">
              <td className="px-5 py-3 text-sm font-medium text-white">{wf.name}</td>
              <td className="px-5 py-3 text-sm text-gray-400">{wf.modifiedAt}</td>
              <td className="px-5 py-3 text-sm text-indigo-400">{wf.creator}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
