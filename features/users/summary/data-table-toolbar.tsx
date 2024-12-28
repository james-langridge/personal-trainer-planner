'use client'

import {USER_TYPE} from '@prisma/client'
import {Cross2Icon, ReloadIcon} from '@radix-ui/react-icons'
import {Row, Table} from '@tanstack/react-table'
import React, {useContext, useState} from 'react'

import {InvoiceData} from '@/@types/apiRequestTypes'
import {UserWithWorkouts} from '@/@types/apiResponseTypes'
import {DateContext} from '@/app/(restricted)/users/[year]/[month]/DateProvider'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/alert-dialog'
import {Button} from '@/components/button'
import {DataTableFacetedFilter} from '@/components/data-table-faceted-filter'
import {DataTableViewOptions} from '@/components/data-table-view-options'
import {Input} from '@/components/input'
import {useToast} from '@/components/use-toast'
import {useSendInvoiceMutation} from '@/redux/services/api'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

const types = [
  {
    value: 'individual',
    label: 'Individual',
  },
  {
    value: 'bootcamp',
    label: 'Bootcamp',
  },
]

export function DataTableToolbar<TData>({table}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const selectedRows = table.getFilteredSelectedRowModel()
    .rows as unknown as Row<UserWithWorkouts>[]
  const [sendInvoice, {isLoading}] = useSendInvoiceMutation()
  const [open, setOpen] = useState(false)
  const {toast} = useToast()
  const date = useContext(DateContext)

  function invoiceAll() {
    for (const row of selectedRows) {
      if (
        row.original.type !== USER_TYPE.INDIVIDUAL ||
        row.original.invoices.length
      ) {
        continue
      }

      const invoiceData: InvoiceData = {
        appointments: row.getValue('attended'),
        date,
        email: row.original.billingEmail || row.original.email,
        id: row.original.id,
        name: row.getValue('name'),
        total: row.getValue('total'),
      }

      const formattedTotal = new Intl.NumberFormat('en-UK', {
        style: 'currency',
        currency: 'GBP',
      }).format(invoiceData.total / 100)

      sendInvoice(invoiceData)
        .unwrap()
        .then(() => {
          toast({
            description: `Invoice sent to ${invoiceData.email} for ${formattedTotal}.`,
          })
        })
        .catch(error => {
          toast({
            variant: 'destructive',
            title: `Error invoicing ${invoiceData.email}...`,
            description: error.message,
          })
        })
        .finally(() => setOpen(false))
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter names..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={event =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn('type') && (
          <DataTableFacetedFilter
            column={table.getColumn('type')}
            title="Type"
            options={types}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="space-x-2">
        {!!selectedRows.length && (
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Invoice selected</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will email invoices to the
                  selected individuals (non-bootcampers) who have not yet been
                  invoiced this month.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>

                {isLoading ? (
                  <Button disabled>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </Button>
                ) : (
                  <Button onClick={invoiceAll}>Continue</Button>
                )}
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
