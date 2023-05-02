import * as count from '../controller/countController'
import * as read from '../controller/readController'
import * as date from '../helpers/dateTimeHelpers'
import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'

// export async function executeSaveDailyCountsHourly(){
//     const interval = 1 * (3.6 * 10**6)
//     count.saveDailyCounts()
//     setTimeout(executeSaveDailyCountsHourly, interval)
// }

const prisma = new PrismaClient

export function executeEveryNewHour(){
    const now = dayjs().utc()
    const millisUntilNextHour = dayjs(now).endOf('hour').diff(now)

    setTimeout(count.saveDailyCounts, millisUntilNextHour)
}

export async function executeSaveWeeklyCountsDaily(){
    const now  = dayjs().utc()    
    const tablesOfToday = await read.readAllDailyConsumptionTables()
    console.log(tablesOfToday);
    if(now.isSame(now.endOf('day'))){
        
        const allCountsOfToday = await read.readAllCountsOfToday(tablesOfToday)
        count.saveWeeklyCounts(allCountsOfToday)
    }
}

export async function executeSaveMonthlyCountsDaily(){
    const now  = dayjs().utc()        
    if(now.isSame(now.endOf('day'))){
        const todaysCounts = await getTodaysTables()
        count.saveMonthlyCounts(todaysCounts)
    }
}

export async function getTodaysTables(){
    const todaysCounts = await prisma.dailyConsumption.findMany({
        where:{
            consumption_date: date.getStartOfDayAsString()
        }})
        return todaysCounts
}