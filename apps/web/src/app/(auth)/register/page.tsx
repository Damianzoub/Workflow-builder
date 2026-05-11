import AuthCard from '@/components/auth/AuthCard'
import RegisterForm from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create an account"
      footer={{ text: 'Already have an account?', linkText: 'Sign in', href: '/login' }}
    >
      <RegisterForm />
    </AuthCard>
  )
}
