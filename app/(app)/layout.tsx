import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Dashboard | Mystery Message',
  description: 'Manage your messages and profile link.',
}


export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return <main className='flex-1'>{children}</main>
}