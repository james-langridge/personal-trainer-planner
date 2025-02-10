import {columns} from '@/features/bootcamps/summary/Columns'
import {DataTable} from '@/features/bootcamps/summary/DataTable'
import {auth} from '@/auth'
import {Bootcamp} from '@/@types/apiResponseTypes'
import {db} from '@/lib/db'
import {redirect} from 'next/navigation'

export default async function Bootcamps() {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    redirect('/')
  }
  const bootcamps = await getBootcamps()

  if (!bootcamps) {
    return null
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={bootcamps} />
    </div>
  )
}

async function getBootcamps() {
  const bootcamps: Bootcamp[] = await db.bootcamp.findMany({
    select: {
      _count: {
        select: {attendees: true},
      },
      attendees: {
        select: {
          email: true,
          id: true,
          name: true,
          role: true,
          type: true,
        },
      },
      date: true,
      description: true,
      id: true,
      name: true,
      videoUrl: true,
    },
    where: {
      deleted: false,
    },
  })

  return bootcamps
}
