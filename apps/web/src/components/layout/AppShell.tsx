import Sidebar from './Sidebar'

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  )
}
