import { PrismaClient } from "@prisma/client"
import dayjs, { utc } from 'dayjs'
import { count, table } from "node:console"
import { getNextDay } from "./customLocale"

const prisma = new PrismaClient()


export async function readAllDailyConsumptionTables() {
    try {
        const allDailyCounts = await prisma.dailyConsumption.findMany()
        return allDailyCounts
        
    } catch (error) {
        console.error(error)
        throw new Error('daily counts were not found')
    }
}

export async function readAllCountsOfToday(allDailyCounts:any[]){
    try {
        const dailyCountsOfCurrentWeek = []
        for(let i = 0; i < allDailyCounts.length; i++){    
            if(allDailyCounts[i].consumption_date.toISOString() === dayjs().utc().startOf('day').toISOString()){
                dailyCountsOfCurrentWeek.push(allDailyCounts[i])
            }
        }
        return dailyCountsOfCurrentWeek
    } catch (error) {
        console.error(error)
        throw new Error('counts of the week were not found')
    }
}

export async function getYAxisDay(UID:number, type:string) {
    try {
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
        
    } catch (error) {
        console.error(error)
        throw new Error('todays Y AXIS data were not found')
    }
}


export async function getYaxisWeek(UID:number, type: string){
    try {
        const counter = await prisma.counter.findUnique({
            where: {
                user_id_type: {
                    user_id: UID,
                    type: type
                }
            }
        })
        if(counter){
            const counterId:number = counter.counter_id
            const currentWeek = getNextDay(dayjs().startOf('week').utc().toDate()).toISOString()
            const tableOfTheWeek = await prisma.weeklyConsumption.findFirst({
                where: {
                    counter_id: counterId,
                    consumption_week_start:currentWeek
                }
            })
            return tableOfTheWeek?.consumption_week_counts
            
        }
        
    } catch (error) {
        console.error(error)
        throw new Error('This weeks Y AXIS data were not found')
    }
}

export async function getYaxisMonth(UID:number, type:string){
    try {
        const counter = await prisma.counter.findUnique({
            where: {
                user_id_type: {
                    user_id: UID,
                    type: type
                }
            }
        })
        if(counter){
            const counterId:number = counter.counter_id
            const currentMonth:Date = dayjs().utc().startOf('month').toDate()
            const tableOfTheMonth = await prisma.monthlyConsumption.findFirst({
                where: {
                    counter_id: counterId,
                    consumption_month: currentMonth
                }
            })
            return tableOfTheMonth?.consumption_month_counts
            
        }
        
    } catch (error) {
        console.error(error)
        throw new Error('this Months Y AXIS data was not found')
    }
}


export async function getyAxisYear(UID:number, type:string){
    try {
        const counter = await prisma.counter.findUnique({
            where: {
                user_id_type: {
                    user_id:UID,
                    type:type
                }
            }
        })
        if(counter){
            const counterId:number = counter.counter_id
            const currentYear:number = dayjs().get('year')
            const tableOfTheYear = await prisma.yearlyConsumption.findFirst({
                where: {
                    counter_id: counterId,
                    consumption_year: currentYear
                }
            })
            return tableOfTheYear?.consumption_year_counts
        }
        
    } catch (error) {
        console.error(error)
        throw new Error('this years Y AXIS data was not found')
    }
}

export async function readConsumptionCounts(UID:number, type:string){
    try {
        const yAxisDay = await getYAxisDay(UID, type)
        const yAxisWeek = await getYaxisWeek(UID, type)
        const yAxisMonth = await getYaxisMonth(UID, type)
        const yAxisYear = await getyAxisYear(UID, type)
        const consumptionCounts = {
            yAxisDay:yAxisDay,
            yAxisWeek:yAxisWeek,
            yAxisMonth:yAxisMonth,
            yAxisYear:yAxisYear
        }
        return consumptionCounts
        
    } catch (error) {
        console.error(error)
        throw new Error('failed to read consumption counts')
    }
}