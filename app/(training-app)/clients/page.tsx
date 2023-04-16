import Container from '@/components/Container'
import {db} from '@/lib/db'
import ClientsTable from '@/components/ClientsTable'
import {SerialisedUser, serialiseUsers, trimUsers} from '@/lib/users'

const getUsers = async (): Promise<SerialisedUser[]> => {
  const users = await db.user.findMany({
    where: {
      admin: false,
    },
    include: {
      sessions: true,
    },
  })

  const trimmedUsers = trimUsers(users)

  return serialiseUsers(trimmedUsers)
}

export default async function Clients() {
  const users = await getUsers()

  return (
    <Container>
      <h1 className="prose text-6xl font-bold leading-normal">Clients</h1>
      <ClientsTable initialUsers={users} />
    </Container>
  )
}
