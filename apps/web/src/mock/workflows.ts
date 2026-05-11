import type { Workflow } from '@/types'

export const mockWorkflows: Workflow[] = [
  { id: 'w1', name: 'Booking Agent',    createdAt: '2026-05-10', modifiedAt: '2026-05-11', creator: 'd.zoumpos04@gmail.com', status: 'active' },
  { id: 'w2', name: 'Email Classifier', createdAt: '2026-05-09', modifiedAt: '2026-05-10', creator: 'd.zoumpos04@gmail.com', status: 'active' },
  { id: 'w3', name: 'Support Bot',      createdAt: '2026-05-08', modifiedAt: '2026-05-09', creator: 'd.zoumpos04@gmail.com', status: 'error'  },
  { id: 'w4', name: 'Lead Qualifier',   createdAt: '2026-05-07', modifiedAt: '2026-05-08', creator: 'd.zoumpos04@gmail.com', status: 'draft'  },
  { id: 'w5', name: 'Invoice Parser',   createdAt: '2026-05-06', modifiedAt: '2026-05-07', creator: 'd.zoumpos04@gmail.com', status: 'active' },
  { id: 'w6', name: 'Onboarding Flow',  createdAt: '2026-05-05', modifiedAt: '2026-05-06', creator: 'd.zoumpos04@gmail.com', status: 'draft'  },
]
