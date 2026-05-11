import AuthCard from '@/components/auth/AuthCard'
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm'

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Reset password"
      footer={{ text: 'Remember your password?', linkText: 'Sign in', href: '/login' }}
    >
      <ForgotPasswordForm />
    </AuthCard>
  )
}
