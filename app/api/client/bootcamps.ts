'use server'

import {db} from '@/lib/db'

export type AllbootcampsParams = {
  dateFilter: {
    gte: Date
    lt: Date
  }
}

export type AllBootcampsData =
  | {
      id: string
      name: string
      date: Date
    }[]
  | null

export async function getAllBootcamps({
  dateFilter,
}: AllbootcampsParams): Promise<AllBootcampsData> {
  return db.bootcamp.findMany({
    select: {
      date: true,
      id: true,
      name: true,
    },
    where: {
      deleted: false,
      date: dateFilter,
    },
  })
}
