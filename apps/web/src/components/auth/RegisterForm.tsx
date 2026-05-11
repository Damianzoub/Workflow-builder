'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { registerSchema, type RegisterInput } from '@/lib/validations'
import { useAuthStore } from '@/stores/auth-store'
import type { MockUser } from '@/types'

export default function RegisterForm() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [loading, setLoading] = useState(false)

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  async function onSubmit(data: RegisterInput) {
    setLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 800))
      const initials = data.name
        .split(' ')
        .filter(Boolean)
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
      const newUser: MockUser = {
        id: 'u-mock',
        name: data.name,
        email: data.email,
        avatarInitials: initials,
      }
      login(newUser)
      router.replace('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Full name</FormLabel>
              <FormControl>
                <Input placeholder="Damianos Zoumpos" className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-500 focus-visible:ring-indigo-500" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-500 focus-visible:ring-indigo-500" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-500 focus-visible:ring-indigo-500" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Confirm password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-500 focus-visible:ring-indigo-500" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white">
          {loading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
    </Form>
  )
}
