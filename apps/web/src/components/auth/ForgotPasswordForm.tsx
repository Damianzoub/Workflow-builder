'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validations'

export default function ForgotPasswordForm() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  async function onSubmit(_data: ForgotPasswordInput) {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    setSent(true)
  }

  if (sent) {
    return (
      <div className="rounded-lg bg-indigo-600/10 border border-indigo-600/30 px-4 py-5 text-center">
        <p className="text-sm font-medium text-indigo-300">Check your inbox</p>
        <p className="mt-1 text-xs text-gray-400">
          We sent a password reset link to <strong className="text-gray-300">{form.getValues('email')}</strong>.
        </p>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-sm text-gray-400">
          Enter your email and we&apos;ll send you a reset link.
        </p>
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
        <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white">
          {loading ? 'Sending…' : 'Send reset link'}
        </Button>
      </form>
    </Form>
  )
}
