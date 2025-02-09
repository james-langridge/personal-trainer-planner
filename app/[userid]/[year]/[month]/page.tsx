import {Grid, Header} from '@/features/calendar/desktop'
import {generateCalendarMonth} from '@/lib/calendar'

type Params = Promise<{userid: string; year: string; month: string}>

export default async function Page({params}: {params: Params}) {
  const {userid, year: yearStr, month: monthStr} = await params
  const year = Number(yearStr)
  const month = Number(monthStr)
  const monthData = generateCalendarMonth(month, year)

  return (
    <>
      <Header year={year} month={month} userId={userid} />
      <Grid monthData={monthData} year={year} month={month} userId={userid} />
    </>
  )
}
