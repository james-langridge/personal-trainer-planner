const {PrismaClient} = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({
    select: {
      fee: true,
      appointments: {
        select: {
          id: true,
        },
      },
    },
  })

  let updatePromises = []

  for (const user of users) {
    for (const appointment of user.appointments) {
      updatePromises.push(
        prisma.appointment.update({
          where: {
            id: appointment.id,
          },
          data: {
            fee: user.fee,
          },
        }),
      )
    }
  }

  await prisma.$transaction(updatePromises)
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
