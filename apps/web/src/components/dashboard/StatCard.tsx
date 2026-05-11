import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  variant?: 'default' | 'indigo' | 'green' | 'amber'
}

const valueColours = {
  default: 'text-white',
  indigo:  'text-indigo-400',
  green:   'text-emerald-400',
  amber:   'text-amber-400',
}

export default function StatCard({ label, value, variant = 'default' }: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800 px-5 py-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className={cn('mt-1 text-2xl font-bold', valueColours[variant])}>{value}</p>
    </div>
  )
}
