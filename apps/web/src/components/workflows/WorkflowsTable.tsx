'use client'

import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { sortWorkflows, type SortKey, type SortDir } from '@/lib/sort-workflows'
import { mockWorkflows } from '@/mock/workflows'

export default function WorkflowsTable() {
  const [sortKey, setSortKey] = useState<SortKey>('modifiedAt')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sorted = sortWorkflows(mockWorkflows, sortKey, sortDir)

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronUp className="h-3 w-3 opacity-20" />
    return sortDir === 'asc'
      ? <ChevronUp className="h-3 w-3 text-indigo-400" />
      : <ChevronDown className="h-3 w-3 text-indigo-400" />
  }

  const thClass = 'px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500'
  const sortableThClass = `${thClass} cursor-pointer hover:text-gray-300 select-none`

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800 overflow-hidden">
      <table className="w-full">
        <thead className="border-b border-gray-700">
          <tr>
            <th className={sortableThClass} onClick={() => handleSort('name')}>
              <span className="flex items-center gap-1">Name <SortIcon col="name" /></span>
            </th>
            <th className={sortableThClass} onClick={() => handleSort('createdAt')}>
              <span className="flex items-center gap-1">Created <SortIcon col="createdAt" /></span>
            </th>
            <th className={sortableThClass} onClick={() => handleSort('modifiedAt')}>
              <span className="flex items-center gap-1">Last Modified <SortIcon col="modifiedAt" /></span>
            </th>
            <th className={thClass}>Creator</th>
            <th className={thClass}>Status</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((wf) => (
            <tr key={wf.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
              <td className="px-4 py-3 text-sm font-medium text-white">{wf.name}</td>
              <td className="px-4 py-3 text-sm text-gray-400">{wf.createdAt}</td>
              <td className="px-4 py-3 text-sm text-gray-400">{wf.modifiedAt}</td>
              <td className="px-4 py-3 text-sm text-indigo-400">{wf.creator}</td>
              <td className="px-4 py-3"><StatusBadge status={wf.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
