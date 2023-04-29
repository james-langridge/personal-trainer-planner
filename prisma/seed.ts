import {db} from '@/lib/db'
import {WORKOUT_STATUS} from '@prisma/client'

const getRandomWorkoutStatus = () => {
  const statuses = [WORKOUT_STATUS.COMPLETED, WORKOUT_STATUS.NOT_STARTED]
  return statuses[Math.floor(Math.random() * statuses.length)]
}

async function main() {
  const user = await db.user.upsert({
    where: {email: 'user@email.com'},
    update: {},
    create: {
      email: 'user@email.com',
      name: 'User',
      password: 'foo',
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
      name: 'Admin',
      password: 'bar',
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
