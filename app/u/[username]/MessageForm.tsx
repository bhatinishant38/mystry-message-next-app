'use client'

import { useState } from 'react'
import axios from 'axios'
import {
  ArrowUpRight,
  Check,
  Loader2,
  LockKeyhole,
  MessageCircle,
  Send,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from '@/components/ui/toast'

const MAX_MESSAGE_LENGTH = 300
const MIN_MESSAGE_LENGTH = 10

export default function MessageForm({ username }: { username: string }) {
  const [content, setContent] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isSending, setIsSending] = useState(false)
  const [isSuggesting, setIsSuggesting] = useState(false)
  const [hasSent, setHasSent] = useState(false)

  const handleSuggestMessages = async () => {
    setIsSuggesting(true)
    setSuggestions([])

    try {
      const response = await axios.post<{
        success: boolean
        suggestions: string[]
      }>('/api/suggest-messages', {}, { timeout: 65_000 })
      const generatedSuggestions = response.data.suggestions

      if (!response.data.success || generatedSuggestions.length !== 3) {
        throw new Error('The suggestion service returned an unexpected response.')
      }

      setSuggestions(generatedSuggestions)
    } catch (error) {
      const description = axios.isAxiosError(error)
        ? error.response?.data?.message ||
          'Please try again in a moment. Check that the Gemini API key is configured.'
        : error instanceof Error
          ? error.message
          : 'Please try again in a moment.'
      toast.add({
        title: 'Could not generate suggestions',
        description,
        type: 'error',
      })
    } finally {
      setIsSuggesting(false)
    }
  }

  const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedContent = content.trim()

    if (trimmedContent.length < MIN_MESSAGE_LENGTH) {
      toast.add({
        title: 'Message is too short',
        description: `Write at least ${MIN_MESSAGE_LENGTH} characters before sending.`,
      })
      return
    }

    setIsSending(true)
    try {
      const response = await axios.post('/api/send-message', {
        username,
        content: trimmedContent,
      })
      setHasSent(true)
      setContent('')
      setSuggestions([])
      toast.add({ title: response.data.message || 'Your message was sent' })
    } catch (error) {
      const description = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Please try again in a moment.'
        : 'Please try again in a moment.'
      toast.add({ title: 'Could not send your message', description })
    } finally {
      setIsSending(false)
    }
  }

  const selectSuggestion = (suggestion: string) => {
    setContent(suggestion.slice(0, MAX_MESSAGE_LENGTH))
    document.getElementById('message-content')?.focus()
  }

  return (
    <main className='relative isolate min-h-[calc(100vh-5rem)] overflow-hidden bg-background px-4 py-12 sm:px-6 sm:py-16'>
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(ellipse_at_top,_color-mix(in_oklch,var(--primary)_10%,transparent),_transparent_70%)]'
      />

      <div className='mx-auto w-full max-w-2xl'>
        <header className='mb-8 text-center'>
          <span className='mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/15'>
            <MessageCircle className='size-6' aria-hidden='true' />
          </span>
          <div className='mb-3 inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground'>
            <LockKeyhole className='size-3.5 text-primary' aria-hidden='true' />
            Anonymous message to
          </div>
          <h1 className='text-3xl font-bold tracking-tight sm:text-4xl'>
            @{username}
          </h1>
          <p className='mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground sm:text-base'>
            Say what you really think. Your identity will stay private.
          </p>
        </header>

        {hasSent ? (
          <Card className='overflow-hidden rounded-3xl border-border/70 shadow-xl shadow-primary/5'>
            <CardContent className='flex flex-col items-center px-6 py-12 text-center sm:px-10'>
              <span className='mb-5 flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'>
                <Check className='size-7' aria-hidden='true' />
              </span>
              <h2 className='text-2xl font-semibold'>Message sent!</h2>
              <p className='mt-2 max-w-sm text-sm leading-6 text-muted-foreground'>
                Your anonymous message is on its way to @{username}.
              </p>
              <Button
                className='mt-7 gap-2'
                variant='outline'
                onClick={() => setHasSent(false)}
              >
                <MessageCircle className='size-4' aria-hidden='true' />
                Send another message
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className='overflow-hidden rounded-3xl border-border/70 shadow-xl shadow-primary/5'>
            <CardContent className='p-5 sm:p-8'>
              <form onSubmit={handleSendMessage}>
                <label
                  htmlFor='message-content'
                  className='mb-3 block text-sm font-semibold'
                >
                  Your message
                </label>
                <textarea
                  id='message-content'
                  value={content}
                  onChange={(event) =>
                    setContent(event.target.value.slice(0, MAX_MESSAGE_LENGTH))
                  }
                  placeholder='Write something kind, curious, or completely random…'
                  maxLength={MAX_MESSAGE_LENGTH}
                  minLength={MIN_MESSAGE_LENGTH}
                  required
                  rows={6}
                  disabled={isSending}
                  className='w-full resize-y rounded-2xl border bg-background px-4 py-4 text-sm leading-6 shadow-sm outline-none transition placeholder:text-muted-foreground/70 focus-visible:border-primary/50 focus-visible:ring-4 focus-visible:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60'
                />
                <div className='mt-2 flex items-center justify-between gap-3'>
                  <p className='text-xs text-muted-foreground'>
                    Keep it kind. Your name won&apos;t be attached.
                  </p>
                  <span
                    className={`shrink-0 text-xs tabular-nums ${
                      content.length > MAX_MESSAGE_LENGTH - 30
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {content.length}/{MAX_MESSAGE_LENGTH}
                  </span>
                </div>

                <div className='mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between'>
                  <Button
                    type='button'
                    variant='outline'
                    className='gap-2'
                    onClick={handleSuggestMessages}
                    disabled={isSuggesting || isSending}
                  >
                    {isSuggesting ? (
                      <Loader2 className='size-4 animate-spin' aria-hidden='true' />
                    ) : (
                      <Sparkles className='size-4' aria-hidden='true' />
                    )}
                    {isSuggesting ? 'Thinking of ideas…' : 'Suggest messages'}
                  </Button>
                  <Button
                    type='submit'
                    className='gap-2'
                    disabled={
                      isSending ||
                      content.trim().length < MIN_MESSAGE_LENGTH
                    }
                  >
                    {isSending ? (
                      <Loader2 className='size-4 animate-spin' aria-hidden='true' />
                    ) : (
                      <Send className='size-4' aria-hidden='true' />
                    )}
                    {isSending ? 'Sending…' : 'Send anonymously'}
                  </Button>
                </div>
              </form>

              {suggestions.length > 0 && (
                <section aria-live='polite' className='mt-8 border-t pt-6'>
                  <div className='mb-4 flex items-start gap-3'>
                    <span className='mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary'>
                      <Sparkles className='size-4' aria-hidden='true' />
                    </span>
                    <div>
                      <h2 className='text-sm font-semibold'>Need inspiration?</h2>
                      <p className='mt-1 text-xs text-muted-foreground'>
                        Choose a prompt to put it in your message.
                      </p>
                    </div>
                  </div>
                  <div className='grid gap-2'>
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={`${index}-${suggestion}`}
                        type='button'
                        onClick={() => selectSuggestion(suggestion)}
                        className='group flex w-full items-start justify-between gap-4 rounded-xl border bg-muted/20 p-3.5 text-left text-sm leading-5 transition hover:border-primary/30 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                      >
                        <span className='text-muted-foreground transition-colors group-hover:text-foreground'>
                          {suggestion}
                        </span>
                        <ArrowUpRight
                          className='mt-0.5 size-4 shrink-0 text-muted-foreground'
                          aria-hidden='true'
                        />
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </CardContent>
          </Card>
        )}

        <p className='mt-6 text-center text-xs text-muted-foreground'>
          <LockKeyhole className='mr-1 inline size-3.5 align-[-2px]' aria-hidden='true' />
          No sign-in required. Your message is sent anonymously.
        </p>
      </div>
    </main>
  )
}
