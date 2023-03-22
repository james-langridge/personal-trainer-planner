import {db} from '@/lib/db'
import {SESSION_STATUS} from '@prisma/client'

const getRandomSessionStatus = () => {
  const statuses = [SESSION_STATUS.COMPLETED, SESSION_STATUS.NOT_STARTED]
  return statuses[Math.floor(Math.random() * statuses.length)]
}

async function main() {
  const user = await db.user.upsert({
    where: {email: 'user@email.com'},
    update: {},
    create: {
      email: 'user@email.com',
      firstName: 'User',
      lastName: 'Person',
      password: 'password',
      sessions: {
        create: new Array(5).fill(1).map((_, i) => ({
          name: `Session ${i}`,
          description: `Everything that describes Session ${i}`,
          date: new Date(2023, 4, i),
          status: getRandomSessionStatus(),
        })),
      },
    },
    include: {
      sessions: true,
    },
  })

  const admin = await db.user.upsert({
    where: {email: 'admin@email.com'},
    update: {},
    create: {
      email: 'admin@email.com',
      firstName: 'Admin',
      lastName: 'Person',
      password: 'password',
      admin: true,
    },
  })

  console.log({user, admin})
}
main()
  .then(async () => {
    await db.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await db.$disconnect()
    process.exit(1)
  })
