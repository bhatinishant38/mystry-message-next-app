import MessageForm from './MessageForm'

export default async function MessagePage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params

  return <MessageForm username={username} />
}
