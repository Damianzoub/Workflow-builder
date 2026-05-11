import ProfileForm from '@/components/account/ProfileForm'
import SecuritySection from '@/components/account/SecuritySection'

export default function AccountPage() {
  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Account</h1>
        <p className="mt-1 text-sm text-gray-400">Manage your profile and security settings</p>
      </div>
      <ProfileForm />
      <SecuritySection />
    </div>
  )
}
