'use client'

import {APPOINTMENT_STATUS, USER_TYPE} from '@prisma/client'
import {CheckIcon} from '@radix-ui/react-icons'
import {ColumnDef} from '@tanstack/react-table'
import {ArrowUpDown, MoreHorizontal} from 'lucide-react'
import Link from 'next/link'

import {UserWithWorkouts} from '@/@types/apiResponseTypes'
import {Button} from '@/components/button'
import {Checkbox} from "@/components/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu'

import {SendInvoiceButton} from './SendInvoiceButton'


export const columns: ColumnDef<UserWithWorkouts>[] = [
  {
    id: "select",
    header: ({ table }) => (
        <Checkbox
            checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
        />
    ),
    cell: ({ row }) => (
        <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
        />
    ),
    enableSorting: false,
    enableHiding: false,
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
    accessorFn: row => row.type.toLowerCase(),
    accessorKey: 'type',
    header: ({column}) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorFn: row => row.appointments.length,
    accessorKey: 'booked',
    header: ({column}) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Booked
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorFn: row =>
      row.appointments.filter(
        appointment => appointment.status === APPOINTMENT_STATUS.ATTENDED,
      ).length,
    accessorKey: 'attended',
    header: ({column}) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Attended
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'credits',
    header: ({column}) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Credits
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'fee',
    header: ({column}) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Fee
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({row}) => {
      const formatted = new Intl.NumberFormat('en-UK', {
        style: 'currency',
        currency: 'GBP',
      }).format(row.original.fee / 100)

      return <div>{formatted}</div>
    },
  },
  {
    accessorFn: row => {
      return row.appointments.reduce((acc, appointment) => {
        if (appointment.status === APPOINTMENT_STATUS.ATTENDED) {
          return acc + appointment.fee
        }

        return acc
      }, 0)
    },
    accessorKey: 'total',
    header: ({column}) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Total
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({row}) => {
      const total = row.original.appointments.reduce((acc, appointment) => {
        if (appointment.status === APPOINTMENT_STATUS.ATTENDED) {
          return acc + appointment.fee / 100
        }

        return acc
      }, 0)

      return new Intl.NumberFormat('en-UK', {
        style: 'currency',
        currency: 'GBP',
      }).format(total)
    },
  },
  {
    accessorKey: 'invoice',
    header: ({column}) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Invoice
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({row}) => {
      if (row.original.invoices.length) {
        return (
          <div className="flex items-center">
            <CheckIcon />
            Done
          </div>
        )
      }

      if (row.original.type === USER_TYPE.INDIVIDUAL) {
        return (
          <SendInvoiceButton
            appointments={row.getValue('attended')}
            email={row.original.email}
            id={row.original.id}
            name={row.original.name}
            total={row.getValue('total')}
          />
        )
      }
    },
  },
  {
    id: 'actions',
    cell: ({row}) => {
      const user = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/users/${user.id}`}>
              <DropdownMenuItem className="cursor-pointer">
                View client
              </DropdownMenuItem>
            </Link>
            <Link href={`/users/${user.id}/edit`}>
              <DropdownMenuItem className="cursor-pointer">
                Edit client
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
