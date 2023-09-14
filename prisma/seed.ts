import {APPOINTMENT_STATUS, WORKOUT_STATUS} from '@prisma/client'

import {db} from '@/lib/db'

const getRandomWorkoutStatus = () => {
  const statuses = [WORKOUT_STATUS.COMPLETED, WORKOUT_STATUS.NOT_STARTED]
  return statuses[Math.floor(Math.random() * statuses.length)]
}

const getRandomAppointmentStatus = () => {
  const statuses = [
    APPOINTMENT_STATUS.ATTENDED,
    APPOINTMENT_STATUS.NOT_ATTENDED,
  ]
  return statuses[Math.floor(Math.random() * statuses.length)]
}

async function main() {
  const user = await db.user.upsert({
    // FIXME: Change this to an email of your own so you can log in as this user
    where: {email: 'user@email.com'},
    update: {},
    create: {
      // FIXME: Change this to the same email as above
      email: 'user@email.com',
      name: 'User',
      role: 'admin',
    },
  })

  await db.workout.createMany({
    data: new Array(10).fill(1).map((_, i) => {
      const date = new Date()
      date.setDate(i + 1)

      return {
        date,
        description: `Everything that describes Workout ${i}`,
        name: `Workout ${i}`,
        ownerId: user.id,
        status: getRandomWorkoutStatus(),
      }
    }),
  })

  await db.appointment.createMany({
    data: new Array(10).fill(1).map((_, i) => {
      const date = new Date()
      date.setDate(i + 1)

      return {
        date,
        description: `Everything that describes Appointment ${i}`,
        name: `Appointment ${i}`,
        ownerId: user.id,
        status: getRandomAppointmentStatus(),
      }
    }),
  })

  for (let i = 0; i < 10; i++) {
    const date = new Date()
    date.setDate(i + 1)

    await db.bootcamp.create({
      data: {
        name: `Bootcamp ${i}`,
        attendees: {
          connect: [{id: user.id}],
        },
        description: `Everything that describes Bootcamp ${i}`,
        date,
      },
    })
  }

  console.log({user})
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
