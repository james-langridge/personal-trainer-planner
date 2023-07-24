import {PrismaClient} from '@prisma/client'
import pMap from 'p-map'

const prisma = new PrismaClient()

async function main() {
  const appointmentWorkouts = await prisma.workout.findMany({
    where: {
      type: 'APPOINTMENT',
    },
  })

  await pMap(
    appointmentWorkouts,
    async workout => {
      await prisma.appointment.create({
        data: {
          createdAt: workout.createdAt,
          date: workout.date,
          deleted: workout.deleted,
          description: workout.description,
          name: workout.name,
          ownerId: workout.ownerId,
          status:
            workout.status === 'NOT_STARTED' ? 'NOT_ATTENDED' : 'ATTENDED',
          updatedAt: workout.updatedAt,
          videoUrl: workout.videoUrl,
        },
      })
    },
    {concurrency: 5},
  )
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
