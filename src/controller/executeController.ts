import * as count from '../controller/countController'
import * as read from '../controller/readController'
import * as date from '../helpers/dateTimeHelpers'
import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'

const prisma = new PrismaClient

export function now(){
    return dayjs().utc()
}

export function executeEveryNewHour(){
    try {
        const time = now()
        const millisUntilNextHour = dayjs(time).endOf('hour').diff(time)
        setTimeout(count.saveDailyCounts, millisUntilNextHour)
    } catch (error) {
        console.error(error)
        return 'daily counts were not saved'
    }
}

export async function executeSaveWeeklyCountsDaily(){
    try {
        const now  = dayjs().utc()
        const tablesOfToday = await read.readAllDailyConsumptionTables()
        if(now.isSame(now.endOf('day'))){
            
            const allCountsOfToday = await read.readAllCountsOfToday(tablesOfToday)
            count.saveWeeklyCounts(allCountsOfToday)
        }
        
    } catch (error) {
        console.error(error)
        throw new Error('weekly counts were not saved')
    }
}

export async function executeSaveMonthlyCountsDaily(){
    try {
        const now  = dayjs().utc()        
        if(now.isSame(now.endOf('day'))){
            const todaysCounts = await getTodaysTables()
            count.saveMonthlyCounts(todaysCounts)
        }

    } catch (error) {
        console.error(error)
        throw new Error('monthly counts were not saved')
    }
}

export async function getTodaysTables(){
    try {
        const todaysCounts = await prisma.dailyConsumption.findMany({
            where:{
                consumption_date: date.getStartOfDayAsString()
            }})
            return todaysCounts
        
    } catch (error) {
        console.error(error)
        throw new Error('todays tables were not found')
    }
}

