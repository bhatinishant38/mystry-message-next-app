import Link from 'next/link'
import {
  ArrowRight,
  Heart,
  Link2,
  LockKeyhole,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import messages from './data/messages.json'

const Home = () => {
  return (
    <main className='relative isolate min-h-[calc(100vh-5rem)] overflow-hidden bg-background'>
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-x-0 top-0 -z-10 h-[38rem] bg-[radial-gradient(ellipse_at_top,_color-mix(in_oklch,var(--primary)_12%,transparent),_transparent_68%)]'
      />
      <div
        aria-hidden='true'
        className='pointer-events-none absolute -right-32 top-28 -z-10 size-80 rounded-full bg-primary/5 blur-3xl'
      />

      <div className='mx-auto w-full max-w-7xl px-5 pb-16 pt-12 sm:px-8 sm:pt-20 lg:px-10 lg:pb-24'>
        <section className='grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16'>
          <div className='max-w-2xl'>
            <div className='mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3.5 py-2 text-sm font-medium text-primary'>
              <Sparkles className='size-4' aria-hidden='true' />
              A little mystery. A lot of connection.
            </div>
            <h1 className='text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl'>
              Say it
              <span className='text-primary'> anonymously.</span>
              <br />
              Mean it
              <span className='text-muted-foreground'> sincerely.</span>
            </h1>
            <p className='mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg'>
              Create your personal link, share it with friends, and discover
              what they really want to say — without putting them on the spot.
            </p>

            <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
              <Link
                href='/sign-up'
                className='inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/15 transition hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
              >
                Create your free link
                <ArrowRight className='size-4' aria-hidden='true' />
              </Link>
              <Link
                href='/sign-in'
                className='inline-flex h-12 items-center justify-center rounded-xl border bg-background/80 px-6 text-sm font-semibold transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
              >
                I already have an account
              </Link>
            </div>

            <div className='mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground'>
              <span className='inline-flex items-center gap-2'>
                <ShieldCheck className='size-4 text-primary' aria-hidden='true' />
                Your identity stays private
              </span>
              <span className='inline-flex items-center gap-2'>
                <Heart className='size-4 text-primary' aria-hidden='true' />
                Made for honest conversations
              </span>
            </div>
          </div>

          <div className='relative mx-auto w-full max-w-lg'>
            <div
              aria-hidden='true'
              className='absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-primary/15 via-primary/5 to-transparent blur-2xl'
            />
            <Card className='relative overflow-hidden rounded-3xl border-border/70 bg-card/95 shadow-2xl shadow-primary/10'>
              <CardHeader className='border-b bg-muted/30 px-6 py-5 sm:px-7'>
                <div className='flex items-center justify-between gap-4'>
                  <div className='flex items-center gap-3'>
                    <span className='flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground'>
                      <MessageCircle className='size-5' aria-hidden='true' />
                    </span>
                    <div>
                      <CardTitle className='text-base'>Your inbox</CardTitle>
                      <CardDescription className='mt-1'>
                        A little note, just for you
                      </CardDescription>
                    </div>
                  </div>
                  <span className='inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400'>
                    <span className='size-1.5 rounded-full bg-emerald-500' />
                    Anonymous
                  </span>
                </div>
              </CardHeader>

              <CardContent className='p-6 sm:p-7'>
                <div className='mb-4 flex items-center justify-between'>
                  <p className='text-sm font-semibold'>Messages from your people</p>
                  <span className='text-xs text-muted-foreground'>Swipe to explore</span>
                </div>
                <Carousel
                  opts={{ loop: true }}
                  className='mx-10'
                  aria-label='Example anonymous messages'
                >
                  <CarouselContent>
                    {messages.map((message, index) => (
                      <CarouselItem key={`${message.title}-${index}`}>
                        <div className='rounded-2xl border bg-background p-5 shadow-sm sm:p-6'>
                          <div className='mb-5 flex items-center gap-3'>
                            <span className='flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary'>
                              <LockKeyhole className='size-4' aria-hidden='true' />
                            </span>
                            <div>
                              <p className='text-sm font-semibold'>Someone who cares</p>
                              <p className='text-xs text-muted-foreground'>
                                {message.received.replace('dayago', 'day ago')}
                              </p>
                            </div>
                          </div>
                          <p className='min-h-24 text-lg leading-relaxed tracking-tight sm:text-xl'>
                            “{message.content}”
                          </p>
                          <div className='mt-5 flex items-center gap-2 border-t pt-4 text-xs text-muted-foreground'>
                            <ShieldCheck className='size-4 text-primary' aria-hidden='true' />
                            Sender identity is hidden
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious
                    className='-left-10 size-8'
                    aria-label='Previous example message'
                  />
                  <CarouselNext
                    className='-right-10 size-8'
                    aria-label='Next example message'
                  />
                </Carousel>
                <div className='mt-6 rounded-xl bg-primary/5 px-4 py-3 text-center text-sm text-muted-foreground'>
                  Your own link is just a few clicks away.
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className='mt-20 grid gap-4 border-t pt-8 sm:grid-cols-3 sm:gap-6 lg:mt-24'>
          <div className='flex gap-4 rounded-2xl p-4'>
            <span className='flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary'>
              <Link2 className='size-5' aria-hidden='true' />
            </span>
            <div>
              <h2 className='font-semibold'>Make your link</h2>
              <p className='mt-1 text-sm leading-6 text-muted-foreground'>
                Sign up and get a personal page to share.
              </p>
            </div>
          </div>
          <div className='flex gap-4 rounded-2xl p-4'>
            <span className='flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary'>
              <MessageCircle className='size-5' aria-hidden='true' />
            </span>
            <div>
              <h2 className='font-semibold'>Hear what they think</h2>
              <p className='mt-1 text-sm leading-6 text-muted-foreground'>
                Friends can send you thoughtful notes anonymously.
              </p>
            </div>
          </div>
          <div className='flex gap-4 rounded-2xl p-4'>
            <span className='flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary'>
              <LockKeyhole className='size-5' aria-hidden='true' />
            </span>
            <div>
              <h2 className='font-semibold'>Keep it private</h2>
              <p className='mt-1 text-sm leading-6 text-muted-foreground'>
                Read and manage every message in your dashboard.
              </p>
            </div>
          </div>
        </section>
      </div>

      <footer className='border-t bg-muted/20 px-5 py-6 text-center text-sm text-muted-foreground'>
        © {new Date().getFullYear()} Mystery Message. Made for meaningful conversations.
      </footer>
    </main>
  )
}

export default Home
