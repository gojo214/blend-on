import { auth } from '@clerk/nextjs/server'

type GamePageProps = {
  params: Promise<{ id: string }>
}

export default async function GamePage({ params }: GamePageProps) {
  await auth.protect({ unauthenticatedUrl: "/sign-in" })

  const { id } = await params

  return <p>{id}</p>
}