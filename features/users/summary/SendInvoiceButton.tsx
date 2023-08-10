import {ReloadIcon} from '@radix-ui/react-icons'
import {useState} from 'react'

import {InvoiceData} from '@/@types/apiRequestTypes'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/alert-dialog'
import {Button} from '@/components/button'
import {useToast} from '@/components/use-toast'
import {useSendInvoiceMutation} from '@/redux/services/api'

export function SendInvoiceButton({
  appointments,
  email,
  total,
  user,
}: {
  appointments: number
  email: string
  total: string
  user: string
}) {
  const [sendInvoice, {isLoading}] = useSendInvoiceMutation()
  const [open, setOpen] = useState(false)
  const {toast} = useToast()

  const invoiceData: InvoiceData = {
    appointments: appointments.toString(),
    email,
    total,
    user,
  }

  async function onClick() {
    sendInvoice(invoiceData)
      .unwrap()
      .then(() => {
        toast({
          description: 'The invoice has been sent.',
        })
      })
      .catch(error => {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: error.message,
        })
      })
      .finally(() => setOpen(false))
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Invoice</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will email an invoice to{' '}
            <span className="capitalize">{user}</span> at {email} for {total}.
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
            <Button onClick={onClick}>Continue</Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
