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

export async function getYAxisDay(UID:number, type:string) {
    const today = dayjs().utc().startOf('day').toDate()
    const counter = await prisma.counter.findUnique({
        where: {
            user_id_type: {
                user_id: UID, 
                type: type
            }
        }
    })
    if(counter){
        const counterId:number = counter?.counter_id
        const tableOfToday = await prisma.dailyConsumption.findUnique({
            where: {
                counter_id_consumption_date: {
                    counter_id: counterId,
                    consumption_date: today 

                }
            }
        })
        const todaysCounts = tableOfToday?.consumption_counts
        return todaysCounts
    }
}


