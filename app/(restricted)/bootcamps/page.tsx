import {columns} from '@/features/bootcamps/summary/Columns'
import {DataTable} from '@/features/bootcamps/summary/DataTable'
import {getBootcamps} from '@/app/actions/bootcamps'

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
