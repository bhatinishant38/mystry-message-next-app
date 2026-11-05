'use client'

import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/components/ui/toast'
import axios, { AxiosError } from 'axios'
import { Link2, Loader2, MessageCircle, RefreshCcw, Sparkles } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import type { Message } from '@/models/User'
import type { ApiResponse } from '@/types/ApiResponse'

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(true)
  const [acceptMessages, setAcceptMessages] = useState(false)
  const [profileUrl, setProfileUrl] = useState('')
  const { data: session, status } = useSession()

  const handleDeleteMessage = useCallback((messageId: string) => {
    setMessages((currentMessages) =>
      currentMessages.filter((message) => String(message._id) !== messageId),
    )
  }, [])

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages')
      setAcceptMessages(response.data.isAcceptingMessage ?? false)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.add({
        title: 'Error',
        description:
          axiosError.response?.data.message || 'Failed to fetch message settings',
      })
    } finally {
      setIsSwitchLoading(false)
    }
  }, [])

  const fetchMessages = useCallback(async (refresh = false) => {
    setIsLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages')
      setMessages(response.data.messages ?? [])
      if (refresh) {
        toast.add({
          title: 'Refreshed Messages',
          description: 'Showing latest messages',
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.add({
        title: 'Error',
        description:
          axiosError.response?.data.message || 'Failed to fetch messages',
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!session?.user) return

    fetchMessages()
    fetchAcceptMessage()
    if (session.user.username) {
      setProfileUrl(
        `${window.location.origin}/u/${session.user.username}`,
      )
    }
  }, [session, fetchAcceptMessage, fetchMessages])

  const handleSwitchChange = async (checked: boolean) => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: checked,
      })
      setAcceptMessages(response.data.isAcceptingMessage ?? checked)
      toast.add({
        title: response.data.message || 'Settings updated',
        description: checked
          ? 'You are now accepting messages'
          : 'You are no longer accepting messages',
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.add({
        title: 'Error',
        description:
          axiosError.response?.data.message || 'Failed to update message settings',
      })
    } finally {
      setIsSwitchLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl)
      toast.add({
        title: 'URL copied',
        description: 'Profile URL has been copied to clipboard',
      })
    } catch {
      toast.add({
        title: 'Error',
        description: 'Failed to copy profile URL',
      })
    }
  }

  if (status === 'loading') {
    return (
      <div className='flex min-h-[60vh] items-center justify-center'>
        <Loader2 className='h-7 w-7 animate-spin text-primary' />
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className='mx-auto my-16 max-w-xl rounded-2xl border bg-card p-8 text-center shadow-sm'>
        <h1 className='text-2xl font-semibold'>Sign in to view your dashboard</h1>
        <p className='mt-2 text-muted-foreground'>Your messages will be waiting here.</p>
      </div>
    )
  }

  return (
    <div className='mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8'>
      <header className='mb-8'>
        <div className='mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary'>
          <Sparkles className='size-4' />
          Your message space
        </div>
        <h1 className='text-3xl font-bold tracking-tight sm:text-4xl'>Dashboard</h1>
        <p className='mt-2 text-muted-foreground'>
          Share your link, manage your inbox, and choose when you want to hear from people.
        </p>
      </header>

      <div className='grid gap-4 md:grid-cols-2'>
        <Card className='border-border/70 shadow-sm'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Link2 className='size-5 text-primary' />
              Your unique link
            </CardTitle>
            <CardDescription>Share this link to receive anonymous messages.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col gap-3 sm:flex-row'>
          <input
            type='text'
            value={profileUrl}
            readOnly
            aria-label='Your unique profile link'
                className='min-w-0 flex-1 rounded-lg border bg-muted/40 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring'
          />
              <Button onClick={copyToClipboard} disabled={!profileUrl} className='gap-2'>
                <Link2 className='size-4' />
                Copy link
          </Button>
        </div>
          </CardContent>
        </Card>

        <Card className='border-border/70 shadow-sm'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <MessageCircle className='size-5 text-primary' />
              Message settings
            </CardTitle>
            <CardDescription>Choose whether people can send you messages.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex items-center justify-between gap-4 rounded-xl border bg-muted/30 p-4'>
              <div>
                <p className='font-medium'>Accept messages</p>
                <p className='mt-1 text-sm text-muted-foreground'>
                  {isSwitchLoading
                    ? 'Loading your settings…'
                    : acceptMessages
                      ? 'Your link is open to new messages.'
                      : 'New messages are currently paused.'}
                </p>
              </div>
        <Switch
          size='default'
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
          aria-label='Accept messages'
        />
            </div>
          </CardContent>
        </Card>
      </div>

      <section className='mt-10'>
        <div className='mb-5 flex flex-wrap items-end justify-between gap-4'>
          <div>
            <h2 className='text-2xl font-semibold tracking-tight'>Your inbox</h2>
            <p className='mt-1 text-sm text-muted-foreground'>
              {messages.length === 1 ? '1 message' : `${messages.length} messages`}
            </p>
          </div>
          <Button
            variant='outline'
            onClick={() => fetchMessages(true)}
            disabled={isLoading}
            className='gap-2'
          >
            <RefreshCcw className={`size-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {messages.length > 0 ? (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {messages.map((message) => (
              <MessageCard
                key={String(message._id)}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))}
          </div>
        ) : (
            <Card className='border-dashed bg-muted/20 py-8 text-center shadow-none sm:col-span-2 lg:col-span-3'>
              <CardContent className='flex flex-col items-center'>
                <div className='mb-4 rounded-full bg-primary/10 p-3 text-primary'>
                  <MessageCircle className='size-6' />
                </div>
                <h3 className='font-semibold'>Your inbox is quiet</h3>
                <p className='mt-1 max-w-sm text-sm text-muted-foreground'>
                  Share your unique link with friends to start receiving anonymous messages.
                </p>
              </CardContent>
            </Card>
        )}
      </section>
    </div>
  )
}

export default Dashboard
