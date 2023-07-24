const {PrismaClient} = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  await prisma.workout.deleteMany({
    where: {
      type: 'APPOINTMENT',
    },
  })
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
