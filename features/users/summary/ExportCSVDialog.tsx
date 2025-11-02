'use client'

import {useMutation} from '@tanstack/react-query'
import {Download} from 'lucide-react'
import {useState} from 'react'

import {exportUsersToCSV} from '@/app/actions/csv-export'
import {Button} from '@/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/dialog'
import {Input} from '@/components/input'
import {Label} from '@/components/label'
import {useToast} from '@/components/use-toast'
import {
  calculateUKTaxYear,
  formatDateRangeForDisplay,
  generateCSVFilename,
} from '@/lib/csv-export'

/**
 * Formats Date to YYYY-MM-DD for HTML date input
 */
function formatDateForInput(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Parses YYYY-MM-DD string to UTC Date
 */
function parseInputDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

/**
 * Dialog component for exporting monthly revenue totals to CSV.
 * Defaults to current UK tax year (April 6 to April 5).
 */
export function ExportCSVDialog() {
  const {toast} = useToast()

  // Initialize with current UK tax year
  const currentTaxYear = calculateUKTaxYear(new Date())
  const [startDate, setStartDate] = useState(
    formatDateForInput(currentTaxYear.start),
  )
  const [endDate, setEndDate] = useState(formatDateForInput(currentTaxYear.end))
  const [isOpen, setIsOpen] = useState(false)

  const exportMutation = useMutation({
    mutationFn: exportUsersToCSV,
    onSuccess: data => {
      const {csv, monthCount} = data
      const startDateObj = parseInputDate(startDate)
      const endDateObj = parseInputDate(endDate)
      const filename = generateCSVFilename(startDateObj, endDateObj)

      // Trigger download
      const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'})
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)

      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: 'Export successful',
        description: `Exported ${monthCount} ${monthCount === 1 ? 'month' : 'months'} of revenue to ${filename}`,
      })

      setIsOpen(false)
    },
    onError: error => {
      toast({
        variant: 'destructive',
        title: 'Export failed',
        description: error.message,
      })
    },
  })

  function handleExport() {
    const startDateObj = parseInputDate(startDate)
    const endDateObj = parseInputDate(endDate)

    // Validation
    if (startDateObj >= endDateObj) {
      toast({
        variant: 'destructive',
        title: 'Invalid date range',
        description: 'End date must be after start date',
      })
      return
    }

    exportMutation.mutate({
      startDate: startDateObj,
      endDate: endDateObj,
    })
  }

  function handleUseCurrentTaxYear() {
    const taxYear = calculateUKTaxYear(new Date())
    setStartDate(formatDateForInput(taxYear.start))
    setEndDate(formatDateForInput(taxYear.end))
  }

  const displayRange = formatDateRangeForDisplay(
    parseInputDate(startDate),
    parseInputDate(endDate),
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Monthly Revenue</DialogTitle>
          <DialogDescription>
            Export monthly revenue totals to CSV for tax purposes.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="start-date">Start Date</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="end-date">End Date</Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>
          <div className="rounded-lg border bg-muted/50 p-3 text-sm">
            <div className="font-medium">Selected Period</div>
            <div className="text-muted-foreground">{displayRange}</div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleUseCurrentTaxYear}
            type="button"
          >
            Use Current UK Tax Year
          </Button>
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={handleExport}
            disabled={exportMutation.isPending}
          >
            {exportMutation.isPending ? 'Exporting...' : 'Export CSV'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
