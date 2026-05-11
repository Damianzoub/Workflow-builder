import type { ActivityItem } from '@/types'

export const mockActivity: ActivityItem[] = [
  { id: 'a1', workflow: 'Booking Agent',    status: 'success', time: '2h ago' },
  { id: 'a2', workflow: 'Support Bot',      status: 'error',   time: '4h ago' },
  { id: 'a3', workflow: 'Email Classifier', status: 'success', time: '6h ago' },
  { id: 'a4', workflow: 'Booking Agent',    status: 'success', time: '8h ago' },
]
