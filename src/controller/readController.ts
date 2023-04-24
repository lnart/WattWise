import { PrismaClient } from "@prisma/client"
import dayjs, { utc } from 'dayjs'
import { count, table } from "node:console"
import { getNextDay } from "./customLocale"

const prisma = new PrismaClient()


export async function readWeeklyCounts(){
    const currentWeek = dayjs().utc().isoWeek()
    const allDailyCounts = await prisma.dailyConsumption.findMany()
    const dailyCountsOfCurrentWeek = []
    for(let i = 0; i < allDailyCounts.length; i++){    
        if(allDailyCounts[i].consumption_date.toISOString() === dayjs().utc().startOf('day').toISOString()){
            dailyCountsOfCurrentWeek.push(allDailyCounts[i])
        }
    }
    return dailyCountsOfCurrentWeek
}

