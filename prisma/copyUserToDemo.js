const readline = require('readline')

const {PrismaClient} = require('@prisma/client')
const cliProgress = require('cli-progress')

const prisma = new PrismaClient()

const progressBar = new cliProgress.SingleBar(
  {},
  cliProgress.Presets.shades_classic,
)

const userIdToCopy = process.env.REAL_USER
const demoUserId = process.env.DEMO_USER

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function askForConfirmation(question) {
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close()
      resolve(answer)
    })
  })
}

async function main() {
  if (!userIdToCopy || !demoUserId) {
    throw new Error('Missing environment variables!')
  }

  const userToCopy = await prisma.user.findUnique({
    where: {
      id: userIdToCopy,
    },
    select: {
      _count: {
        select: {appointments: true, workouts: true},
      },
      appointments: true,
      id: true,
      workouts: true,
    },
  })

  const appointmentsCount = userToCopy._count.appointments
  const workoutsCount = userToCopy._count.workouts
  const totalCount = appointmentsCount + workoutsCount

  console.log('User: ', userToCopy)

  const answer = await askForConfirmation(
    `\nAbout to copy the above ${appointmentsCount} appointments and ${workoutsCount} workouts from user ${userToCopy.id} to ${demoUserId}.
    \nThis cannot be undone. Proceed? (N/y): `,
  )

  if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
    console.log('Proceeding...')

    progressBar.start(totalCount, 0)

    for (const appointment of userToCopy.appointments) {
      await prisma.appointment
        .create({
          data: {
            date: appointment.date,
            deleted: appointment.deleted,
            description: appointment.description,
            fee: appointment.fee,
            name: appointment.name,
            ownerId: demoUserId,
            status: appointment.status,
            videoUrl: appointment.videoUrl,
          },
        })
        .then(() => {
          progressBar.increment()
        })
    }

    for (const workout of userToCopy.workouts) {
      await prisma.workout
        .create({
          data: {
            date: workout.date,
            deleted: workout.deleted,
            description: workout.description,
            name: workout.name,
            ownerId: demoUserId,
            status: workout.status,
            videoUrl: workout.videoUrl,
          },
        })
        .then(() => {
          progressBar.increment()
        })
    }

    progressBar.stop()
  } else {
    console.log('Aborted!')
  }
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
