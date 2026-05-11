import { mockActivity } from '@/mock/activity'
import { cn } from '@/lib/utils'

export default function ActivityFeed() {
  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800 p-5">
      <p className="mb-4 text-xs font-medium uppercase tracking-wide text-gray-500">Recent activity</p>
      <ul className="space-y-3">
        {mockActivity.map((item) => (
          <li key={item.id} className="flex items-center gap-3">
            <span className={cn(
              'h-2 w-2 flex-shrink-0 rounded-full',
              item.status === 'success' ? 'bg-emerald-400' : 'bg-red-400'
            )} />
            <span className="flex-1 text-sm text-gray-300">{item.workflow}</span>
            <span className="text-xs text-gray-500">{item.time}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
