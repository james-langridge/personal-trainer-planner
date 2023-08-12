const readline = require('readline')

const {PrismaClient} = require('@prisma/client')
const cliProgress = require('cli-progress')

const prisma = new PrismaClient()

const progressBar = new cliProgress.SingleBar(
  {},
  cliProgress.Presets.shades_classic,
)

const userIdToDelete = process.env.DEMO_USER

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
  // If this id is undefined, all records for all users will be deleted!
  // https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#delete-all-user-records
  if (!userIdToDelete) {
    throw new Error('Missing process.env.DEMO_USER')
  }

  const answer1 = await askForConfirmation(
    `\nHave you backed up the DB? (N/y): `,
  )

  if (answer1.toLowerCase() === 'yes' || answer1.toLowerCase() === 'y') {
    console.log('\nProceeding...')
  } else {
    console.log('\nAborted!')
    throw new Error('Back up the database first.')
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userIdToDelete,
    },
    select: {
      _count: {
        select: {appointments: true, workouts: true},
      },
      appointments: {
        select: {
          id: true,
        },
      },
      id: true,
      name: true,
      workouts: {
        select: {
          id: true,
        },
      },
    },
  })

  const appointmentsCount = user._count.appointments
  const workoutsCount = user._count.workouts
  const totalCount = appointmentsCount + workoutsCount

  console.log('User: ', user)

  const answer2 = await askForConfirmation(
    `\nAbout to delete all of the ${appointmentsCount} appointments and ${workoutsCount} workouts for the above user ${user.id}.
    \nThis cannot be undone. Proceed? (N/y): `,
  )

  if (answer2.toLowerCase() === 'yes' || answer2.toLowerCase() === 'y') {
    console.log('Proceeding...')

    progressBar.start(totalCount, 0)

    for (const appointment of user.appointments) {
      await prisma.appointment
        .delete({
          where: {
            id: appointment.id,
          },
        })
        .then(() => {
          progressBar.increment()
        })
    }

    for (const workout of user.workouts) {
      await prisma.workout
        .delete({
          where: {
            id: workout.id,
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
