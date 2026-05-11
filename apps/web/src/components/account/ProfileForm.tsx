'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth-store'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
})

type ProfileInput = z.infer<typeof profileSchema>

export default function ProfileForm() {
  const { user, login } = useAuthStore()

  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? '' },
  })

  function onSubmit(data: ProfileInput) {
    if (!user) return
    const initials = data.name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
    login({ ...user, name: data.name, avatarInitials: initials })
    toast.success('Profile updated')
  }

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800 p-6">
      <h2 className="mb-5 text-sm font-semibold text-white">Profile</h2>

      {/* Avatar */}
      <div className="mb-5 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600/30 text-base font-semibold text-indigo-300">
          {user?.avatarInitials}
        </div>
        <div>
          <p className="text-sm font-medium text-white">{user?.name}</p>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Full name</FormLabel>
                <FormControl>
                  <Input className="bg-gray-900 border-gray-600 text-white focus-visible:ring-indigo-500" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">Email</label>
            <Input
              value={user?.email ?? ''}
              disabled
              className="bg-gray-900/50 border-gray-700 text-gray-500 cursor-not-allowed"
            />
          </div>
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white">
            Save changes
          </Button>
        </form>
      </Form>
    </div>
  )
}
