'use client'

import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { Separator, Switch } from '@base-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AcceptMessageSchema } from '@/Schemas/acceptMessageSchema'
import type { Message } from '@/models/User'
import type { ApiResponse } from '@/types/ApiResponse'

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  const [profileUrl, setProfileUrl] = useState('')
  const { data: session, status } = useSession()

  const { setValue, watch } = useForm<{ acceptMessages: boolean }>({
    resolver: zodResolver(AcceptMessageSchema),
    defaultValues: { acceptMessages: false },
  })

  const acceptMessages = watch('acceptMessages')

  const handleDeleteMessage = useCallback((messageId: string) => {
    setMessages((currentMessages) =>
      currentMessages.filter((message) => String(message._id) !== messageId),
    )
  }, [])

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages')
      setValue('acceptMessages', response.data.isAcceptingMessage ?? false)
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
  }, [setValue])

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
      setValue('acceptMessages', checked)
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
    return <div className='my-8 flex justify-center'><Loader2 className='h-6 w-6 animate-spin' /></div>
  }

  if (!session?.user) {
    return <div>Please login</div>
  }

  return (
    <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white'>
      <h1 className='text-4xl font-bold mb-4'>User Dashboard</h1>

      <div className='mb-4'>
        <h2 className='text-lg font-semibold mb-2'>Copy Your Unique Link</h2>
        <div className='flex items-center'>
          <input
            type='text'
            value={profileUrl}
            readOnly
            aria-label='Your unique profile link'
            className='input input-bordered w-full p-2 mr-2'
          />
          <Button onClick={copyToClipboard} disabled={!profileUrl}>
            Copy
          </Button>
        </div>
      </div>

      <div className='mb-4 flex items-center'>
        <Switch.Root
          className='relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full bg-muted transition-colors data-checked:bg-primary disabled:cursor-not-allowed disabled:opacity-50'
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
          aria-label='Accept messages'
        >
          <Switch.Thumb className='pointer-events-none size-5 translate-x-0.5 rounded-full bg-background shadow-sm transition-transform data-checked:translate-x-5' />
        </Switch.Root>
        <span className='ml-2'>
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className='mt-4'
        onClick={() => fetchMessages(true)}
        disabled={isLoading}
        aria-label='Refresh messages'
      >
        {isLoading ? (
          <Loader2 className='h-4 w-4 animate-spin' />
        ) : (
          <RefreshCcw className='h-4 w-4' />
        )}
      </Button>

      <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-6'>
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={String(message._id)}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display</p>
        )}
      </div>
    </div>
  )
}

export default Dashboard
