'use client'

import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button'
import { Loader2, MessageCircle, ShieldCheck, Trash2 } from 'lucide-react'
import type { Message } from '@/models/User'
import { toast } from './ui/toast'
import type { ApiResponse } from '@/types/ApiResponse'
import axios from 'axios'

type MessageCardProps = {
  message: Message
  onMessageDelete: (messageId: string) => void
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const messageId = String(message._id)
  const receivedAt = new Date(message.createdAt)

  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${messageId}`,
      )
      toast.add({ title: response.data.message || 'Message deleted' })
      onMessageDelete(messageId)
    } catch (error) {
      const description = axios.isAxiosError<ApiResponse>(error)
        ? error.response?.data.message || 'Could not delete this message'
        : 'Could not delete this message'
      toast.add({ title: 'Unable to delete message', description })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <article className='group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-lg hover:shadow-primary/5 sm:p-6'>
      <div
        aria-hidden='true'
        className='absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/20 via-primary/70 to-primary/20 opacity-70 transition-opacity group-hover:opacity-100'
      />

      <div className='flex items-start justify-between gap-4'>
        <div className='flex min-w-0 items-center gap-3'>
          <span className='flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/10'>
        <MessageCircle className='size-5' aria-hidden='true' />
          </span>
          <div className='min-w-0'>
        <p className='truncate font-semibold tracking-tight'>Anonymous message</p>
        <p className='mt-1 flex items-center gap-1.5 text-xs text-muted-foreground'>
          <ShieldCheck className='size-3.5 text-primary' aria-hidden='true' />
          Identity protected
        </p>
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger
        render={
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='-mr-2 -mt-1 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
            aria-label='Delete message'
            disabled={isDeleting}
          >
            <Trash2 className='size-4' aria-hidden='true' />
          </Button>
        }
          />
          <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this message?</AlertDialogTitle>
          <AlertDialogDescription>
            This message will be permanently removed from your inbox.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Keep message</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteConfirm}
            variant='destructive'
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className='size-4 animate-spin' />}
            {isDeleting ? 'Deleting…' : 'Delete message'}
          </AlertDialogAction>
        </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className='my-5 flex-1 rounded-xl bg-muted/40 px-4 py-4 sm:px-5'>
        <p className='whitespace-pre-wrap break-words text-[15px] leading-7 text-foreground/90'>
          “{message.content}”
        </p>
      </div>

      <div className='flex items-center justify-between gap-3 border-t border-border/60 pt-4'>
        <span className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
          Received
        </span>
        <time
          dateTime={receivedAt.toISOString()}
          className='text-right text-xs text-muted-foreground'
        >
          {receivedAt.toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
          })}
        </time>
      </div>
    </article>
  )
}

export default MessageCard