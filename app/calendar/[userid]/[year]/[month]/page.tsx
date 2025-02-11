import {Grid, Header} from '@/features/calendar/desktop'

type Params = Promise<{userid: string; year: string; month: string}>

export default async function Page({params}: {params: Params}) {
  const {userid, year: yearStr, month: monthStr} = await params
  const year = Number(yearStr)
  const jsMonth = Number(monthStr) - 1

  return (
    <div className="flex h-[90vh]">
      <div className="hidden w-full flex-col px-5 sm:flex sm:items-center">
        <Header year={year} jsMonth={jsMonth} userId={userid} />
        <Grid year={year} jsMonth={jsMonth} userId={userid} />
      </div>
    </div>
  )
}
