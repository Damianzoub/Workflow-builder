'use client'

import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function NewWorkflowButton() {
  return (
    <Button
      onClick={() => toast.info('Workflow editor coming in Phase 2')}
      className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2"
    >
      <Plus className="h-4 w-4" />
      New Workflow
    </Button>
  )
}
