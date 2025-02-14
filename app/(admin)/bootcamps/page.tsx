import {columns} from '@/features/bootcamps/summary/Columns'
import {DataTable} from '@/features/bootcamps/summary/DataTable'
import {db} from '@/lib/db'

export const dynamic = 'force-static'

export default async function Bootcamps() {
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
  return db.bootcamp.findMany({
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
}
