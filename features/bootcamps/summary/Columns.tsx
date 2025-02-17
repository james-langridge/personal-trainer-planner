'use client'

import {ColumnDef} from '@tanstack/react-table'
import {ArrowUpDown, MoreHorizontal} from 'lucide-react'
import Link from 'next/link'

import {Bootcamp} from '@/@types/apiResponseTypes'
import {Button} from '@/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu'

export const columns: ColumnDef<Bootcamp>[] = [
  {
    accessorKey: 'date',
    header: ({column}) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({row}) => {
      const bootcamp = row.original
      const dateObject = new Date(bootcamp.date)

      return dateObject.toLocaleDateString()
    },
  },
  {
    accessorKey: 'name',
    header: ({column}) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorFn: row => row._count?.attendees,
    accessorKey: 'attendees',
    header: ({column}) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Attendees
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({row}) => {
      const attendees = row.original.attendees

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">View attendees</span>
              {attendees?.length}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {attendees?.length ? (
              attendees.map(attendee => (
                <Link key={attendee.id} href={`/admin/user/${attendee.id}`}>
                  <DropdownMenuItem className="cursor-pointer">
                    <span className="capitalize">{attendee.name}</span>
                  </DropdownMenuItem>
                </Link>
              ))
            ) : (
              <div>No attendees</div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
  {
    id: 'actions',
    cell: ({row}) => {
      const bootcamp = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/bootcamp/${bootcamp.id}`}>
              <DropdownMenuItem className="cursor-pointer">
                View bootcamp
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
