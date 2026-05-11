import AuthCard from '@/components/auth/AuthCard'
import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <AuthCard
      title="Sign in"
      footer={{ text: "Don't have an account?", linkText: 'Register', href: '/register' }}
    >
      <LoginForm />
    </AuthCard>
  )
}
