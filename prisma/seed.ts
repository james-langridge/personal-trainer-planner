import {db} from '@/lib/db'
import {WORKOUT_STATUS} from '@prisma/client'
import {hashPassword} from '@/lib/auth'

const getRandomWorkoutStatus = () => {
  const statuses = [WORKOUT_STATUS.COMPLETED, WORKOUT_STATUS.NOT_STARTED]
  return statuses[Math.floor(Math.random() * statuses.length)]
}

async function main() {
  const passwordUser = await hashPassword('password')
  const passwordAdmin = await hashPassword('password')

  const user = await db.user.upsert({
    where: {email: 'user@email.com'},
    update: {},
    create: {
      email: 'user@email.com',
      firstName: 'User',
      lastName: 'Person',
      password: passwordUser,
      workouts: {
        create: new Array(5).fill(1).map((_, i) => ({
          name: `Workout ${i}`,
          description: `Everything that describes Workout ${i}`,
          date: new Date(2023, 4, i),
          status: getRandomWorkoutStatus(),
        })),
      },
    },
    include: {
      workouts: true,
    },
  })

  const admin = await db.user.upsert({
    where: {email: 'admin@email.com'},
    update: {},
    create: {
      email: 'admin@email.com',
      firstName: 'Admin',
      lastName: 'Person',
      password: passwordAdmin,
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
