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

// Generate a random date within the next 30 days
const getRandomFutureDate = () => {
  const futureDate = new Date()
  futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30))
  return futureDate
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
          date: getRandomFutureDate(),
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
          date: getRandomFutureDate(),
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
        date: getRandomFutureDate(),
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

  console.log('✅ Seeding completed successfully!')
  console.log(
    `Created ${users.length} users, including admin user: ${adminUser.email}`,
  )
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
