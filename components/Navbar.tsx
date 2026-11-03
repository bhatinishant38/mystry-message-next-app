'use client'
import React from 'react'
import Link from 'next/link'
import { useSession ,signOut} from 'next-auth/react'
import { User } from 'next-auth'
import { ArrowRight, LogOut, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Navbar = () => {

  const {data:session} = useSession()

  const user : User = session?.user as User

  return (
     <nav className='sticky top-0 z-50 border-b border-border/70 bg-background/85 shadow-sm backdrop-blur-xl'>
        <div className='mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8'>
            <a className='group inline-flex items-center gap-3 self-center sm:self-auto' href="/">
                <span className='flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105'>
                    <MessageCircle className='size-5' aria-hidden='true' />
                </span>
                <span className='text-lg font-bold tracking-tight text-foreground sm:text-xl'>Mystry Message</span>
            </a>
            {
                session ? (
                    <div className='flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4'>
                        <span className='flex min-w-0 flex-col items-center rounded-xl bg-muted/70 px-4 py-2 text-sm sm:items-start'>
                            <span className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>Welcome back</span>
                            <span className='max-w-full truncate font-semibold text-foreground'>{user?.username || user?.email}</span>
                        </span>
                        <Button variant='outline' className='h-10 w-full gap-2 rounded-xl px-4 sm:w-auto' onClick={()=> signOut()}>
                            <LogOut aria-hidden='true' />
                            Logout
                        </Button>
                    </div>
                ):(
                    <Link
                        className='inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto'
                        href="/sign-in"
                    >
                        Login
                        <ArrowRight className='size-4' aria-hidden='true' />
                    </Link>
                )
            }
        </div>
     </nav>
  )
}

export default Navbar