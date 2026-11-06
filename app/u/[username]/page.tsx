import { Suspense } from 'react'
import MessageForm from './MessageForm'

export default function MessagePage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  return (
    <Suspense fallback={<MessagePageFallback />}>
      {params.then(({ username }) => (
        <MessageForm username={username} />
      ))}
    </Suspense>
  )
}

function MessagePageFallback() {
  return (
    <main className='flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-12'>
      <div className='w-full max-w-2xl animate-pulse space-y-6'>
        <div className='mx-auto size-14 rounded-2xl bg-muted' />
        <div className='mx-auto h-8 w-48 rounded-lg bg-muted' />
        <div className='mx-auto h-4 w-72 max-w-full rounded bg-muted' />
        <div className='h-72 rounded-3xl border bg-card' />
      </div>
    </main>
  )
}
