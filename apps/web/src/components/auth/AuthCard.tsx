import Link from 'next/link'

interface AuthCardProps {
  title: string
  children: React.ReactNode
  footer?: { text: string; linkText: string; href: string }
}

export default function AuthCard({ title, children, footer }: AuthCardProps) {
  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="mb-6 flex flex-col items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
          WF
        </div>
        <span className="text-base font-semibold text-white">Workflow AI</span>
      </div>

      {/* Card */}
      <div className="rounded-xl border border-gray-700 bg-gray-800 p-6 shadow-xl">
        <h1 className="mb-5 text-center text-xl font-semibold text-white">{title}</h1>
        {children}
      </div>

      {/* Footer link */}
      {footer && (
        <p className="mt-4 text-center text-sm text-gray-500">
          {footer.text}{' '}
          <Link href={footer.href} className="text-indigo-400 hover:text-indigo-300 hover:underline">
            {footer.linkText}
          </Link>
        </p>
      )}
    </div>
  )
}
