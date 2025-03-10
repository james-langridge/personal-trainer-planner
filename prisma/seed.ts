import {APPOINTMENT_STATUS, WORKOUT_STATUS, USER_TYPE} from '@prisma/client'
import {faker} from '@faker-js/faker'
import {hash} from 'bcryptjs'

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

const generateRandomName = () =>
  faker.word.words({count: Math.floor(Math.random() * 2) + 2})

// Generate a random date within the next month
const getRandomDateNextMonth = () => {
  const now = new Date()
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  const lastDayOfNextMonth = new Date(
    nextMonth.getFullYear(),
    nextMonth.getMonth() + 1,
    0,
  ).getDate()

  const randomDate = new Date(nextMonth)
  randomDate.setDate(1 + Math.floor(Math.random() * lastDayOfNextMonth))
  return randomDate
}

// Generate a random date within the past 30 days
const getRandomPastDate = () => {
  const pastDate = new Date()
  pastDate.setDate(pastDate.getDate() - Math.floor(Math.random() * 30))
  return pastDate
}

// Generate a random fee between 500 and 5000
const getRandomFee = () => Math.floor(Math.random() * 4501) + 500

// Generate a random number of credits between 0 and 10
const getRandomCredits = () => Math.floor(Math.random() * 11)

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clean up existing data (optional, comment out if you want to keep existing data)
  console.log('🧹 Cleaning up existing data...')
  await db.invoice.deleteMany({})
  await db.appointment.deleteMany({})
  await db.workout.deleteMany({})

  // First get all bootcamps
  const existingBootcamps = await db.bootcamp.findMany()

  // Then disconnect attendees from each bootcamp individually
  console.log('🔄 Disconnecting attendees from bootcamps...')
  for (const bootcamp of existingBootcamps) {
    await db.bootcamp.update({
      where: {id: bootcamp.id},
      data: {
        attendees: {
          set: [],
        },
      },
    })
  }

  await db.bootcamp.deleteMany({})
  await db.account.deleteMany({})
  await db.session.deleteMany({})
  await db.verificationToken.deleteMany({})
  await db.user.deleteMany({})

  // Only add dummy users if not CI
  if (process.env.CI !== 'true') {
    // Create admin user (you can change this email to your own)
    console.log('👤 Creating admin user...')
    const adminUser = await db.user.create({
      data: {
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
        password: await hash('test123', 12),
        billingEmail: 'admin-billing@example.com',
        credits: 10,
        fee: 1500,
        type: USER_TYPE.INDIVIDUAL,
        emailVerified: new Date(),
      },
    })

    console.log('👥 Creating regular users...')
    const numUsers = 20
    const users = [adminUser]

    for (let i = 0; i < numUsers; i++) {
      const firstName = faker.person.firstName()
      const lastName = faker.person.lastName()
      const userType = i < 10 ? USER_TYPE.BOOTCAMP : USER_TYPE.INDIVIDUAL

      const user = await db.user.create({
        data: {
          email: faker.internet.email({firstName, lastName}),
          name: `${firstName} ${lastName}`,
          role: 'user',
          password: await hash('test123', 12),
          billingEmail: faker.helpers.maybe(
            () => faker.internet.email({firstName, lastName}),
            {probability: 0.7},
          ),
          credits: getRandomCredits(),
          fee: getRandomFee(),
          type: userType,
          emailVerified: faker.helpers.maybe(() => faker.date.past(), {
            probability: 0.8,
          }),
          image: faker.helpers.maybe(() => faker.image.avatar(), {
            probability: 0.6,
          }),
        },
      })
      users.push(user)
    }

    console.log('🏋️ Creating workouts...')
    for (const user of users) {
      const numWorkouts = Math.floor(Math.random() * 6) + 5 // 5-10 workouts per user

      for (let i = 0; i < numWorkouts; i++) {
        await db.workout.create({
          data: {
            name: generateRandomName(),
            description: faker.lorem.paragraph(),
            date: getRandomDateNextMonth(),
            status: getRandomWorkoutStatus(),
            ownerId: user.id,
            videoUrl: faker.helpers.maybe(
              () => `https://example.com/videos/${faker.string.uuid()}`,
              {probability: 0.3},
            ),
            deleted: faker.helpers.maybe(() => true, {probability: 0.1}),
          },
        })
      }
    }

    console.log('📅 Creating appointments...')
    for (const user of users) {
      const numAppointments = Math.floor(Math.random() * 9) + 2 // 2-10 appointments per user

      for (let i = 0; i < numAppointments; i++) {
        await db.appointment.create({
          data: {
            name: generateRandomName(),
            description: faker.lorem.paragraph(),
            date: getRandomDateNextMonth(),
            status: getRandomAppointmentStatus(),
            ownerId: user.id,
            fee: getRandomFee(),
            videoUrl: faker.helpers.maybe(
              () => `https://example.com/videos/${faker.string.uuid()}`,
              {probability: 0.3},
            ),
            deleted: faker.helpers.maybe(() => true, {probability: 0.1}),
          },
        })
      }
    }

    console.log('🏕️ Creating bootcamps...')
    const numBootcamps = 8
    const bootcampUsers = users.filter(user => user.type === USER_TYPE.BOOTCAMP)

    for (let i = 0; i < numBootcamps; i++) {
      // Select between 3 and 10 bootcamp users to attend this bootcamp
      const numAttendees = Math.min(
        Math.floor(Math.random() * 8) + 3,
        bootcampUsers.length,
      )
      const attendees = faker.helpers.arrayElements(bootcampUsers, numAttendees)

      await db.bootcamp.create({
        data: {
          name: generateRandomName(),
          description: faker.lorem.paragraph(),
          date: getRandomDateNextMonth(),
          attendees: {
            connect: attendees.map(user => ({id: user.id})),
          },
          videoUrl: faker.helpers.maybe(
            () => `https://example.com/videos/${faker.string.uuid()}`,
            {probability: 0.3},
          ),
          deleted: faker.helpers.maybe(() => true, {probability: 0.1}),
        },
      })
    }

    console.log('💰 Creating invoices...')
    for (const user of users) {
      const numInvoices = Math.floor(Math.random() * 4) + 1 // 1-4 invoices per user

      for (let i = 0; i < numInvoices; i++) {
        const appointmentsCount = Math.floor(Math.random() * 5) + 1
        const total = appointmentsCount * user.fee

        await db.invoice.create({
          data: {
            appointments: appointmentsCount,
            total: total,
            date: getRandomPastDate(),
            ownerId: user.id,
            deleted: faker.helpers.maybe(() => true, {probability: 0.1}),
          },
        })
      }
    }

    console.log('🔐 Creating NextAuth sessions...')
    for (const user of users) {
      if (Math.random() > 0.5) {
        // 50% of users have an active session
        await db.session.create({
          data: {
            userId: user.id,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            sessionToken: faker.string.uuid(),
          },
        })
      }
    }

    console.log('🔑 Creating verification tokens...')
    for (let i = 0; i < 5; i++) {
      const email = faker.internet.email()
      await db.verificationToken.create({
        data: {
          identifier: email,
          token: faker.string.uuid(),
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        },
      })
    }

    console.log(
      `Created ${users.length} users, including admin user: ${adminUser.email}`,
    )
  }

  if (process.env.CI === 'true') {
    // =========================================
    // Create user for CI tests
    // =========================================
    console.log('🧪 Creating user for CI tests...')

    const testUser = await db.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        password: await hash('test123', 12),
        billingEmail: 'test-billing@example.com',
        credits: 1,
        fee: 1000,
        type: USER_TYPE.BOOTCAMP,
        emailVerified: new Date(),
      },
    })

    await db.session.create({
      data: {
        userId: testUser.id,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        sessionToken: faker.string.uuid(),
      },
    })

    const getRelativeDate = (dayOffset: number) => {
      const date = new Date()
      date.setDate(date.getDate() + dayOffset)
      return date
    }

    console.log('📆 Creating workouts for test user...')
    const testWorkouts = [
      // Yesterday
      {
        name: 'Morning Routine',
        dayOffset: -1,
        status: WORKOUT_STATUS.COMPLETED,
      },
      {
        name: 'Evening Stretch',
        dayOffset: -1,
        status: WORKOUT_STATUS.COMPLETED,
      },
      // Today
      {
        name: 'Strength Training',
        dayOffset: 0,
        status: WORKOUT_STATUS.COMPLETED,
      },
      {
        name: 'Cardio Session',
        dayOffset: 0,
        status: WORKOUT_STATUS.NOT_STARTED,
      },
      // Tomorrow
      {name: 'Recovery Day', dayOffset: 1, status: WORKOUT_STATUS.NOT_STARTED},
      {
        name: 'Full Body Workout',
        dayOffset: 1,
        status: WORKOUT_STATUS.NOT_STARTED,
      },
    ]

    for (const workout of testWorkouts) {
      await db.workout.create({
        data: {
          name: workout.name,
          description: `Test workout: ${workout.name}`,
          date: getRelativeDate(workout.dayOffset),
          status: workout.status,
          ownerId: testUser.id,
          videoUrl:
            workout.dayOffset % 2 === 0
              ? 'https://example.com/test-video.mp4'
              : null,
        },
      })
    }

    console.log('📆 Creating appointments for test user...')
    const testAppointments = [
      // Yesterday
      {
        name: 'Initial Consultation',
        dayOffset: -1,
        status: APPOINTMENT_STATUS.ATTENDED,
        fee: 1500,
      },
      // Today
      {
        name: 'Progress Check',
        dayOffset: 0,
        status: APPOINTMENT_STATUS.ATTENDED,
        fee: 1000,
      },
      {
        name: 'Fitness Assessment',
        dayOffset: 0,
        status: APPOINTMENT_STATUS.NOT_ATTENDED,
        fee: 2000,
      },
      // Tomorrow
      {
        name: 'Nutrition Planning',
        dayOffset: 1,
        status: APPOINTMENT_STATUS.NOT_ATTENDED,
        fee: 1200,
      },
      {
        name: 'Monthly Review',
        dayOffset: 1,
        status: APPOINTMENT_STATUS.NOT_ATTENDED,
        fee: 1500,
      },
    ]

    for (const appointment of testAppointments) {
      await db.appointment.create({
        data: {
          name: appointment.name,
          description: `Test appointment: ${appointment.name}`,
          date: getRelativeDate(appointment.dayOffset),
          status: appointment.status,
          ownerId: testUser.id,
          fee: appointment.fee,
          videoUrl:
            appointment.dayOffset % 2 === 0
              ? 'https://example.com/test-video.mp4'
              : null,
        },
      })
    }

    console.log('📆 Creating bootcamps for test user...')
    const testBootcamps = [
      {name: 'Beginner Bootcamp', dayOffset: -1}, // Yesterday
      {name: 'Advanced Training', dayOffset: 0}, // Today
      {name: 'Specialized Workshop', dayOffset: 1}, // Tomorrow
    ]

    for (const bootcamp of testBootcamps) {
      await db.bootcamp.create({
        data: {
          name: bootcamp.name,
          description: `Test bootcamp: ${bootcamp.name}`,
          date: getRelativeDate(bootcamp.dayOffset),
          videoUrl:
            bootcamp.dayOffset % 2 === 0
              ? 'https://example.com/test-video.mp4'
              : null,
        },
      })
    }

    console.log('📆 Creating invoice for test user...')
    await db.invoice.create({
      data: {
        appointments: 3,
        total: 4500,
        date: getRelativeDate(-1), // Yesterday
        ownerId: testUser.id,
      },
    })
  }

  console.log('✅ Seeding completed successfully!')
}

main()
  .then(async () => {
    await db.$disconnect()
  })
  .catch(async e => {
    console.error('❌ Error during seeding:', e)
    await db.$disconnect()
    process.exit(1)
  })
