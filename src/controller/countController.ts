import { DailyConsumption, PrismaClient } from "@prisma/client"
import dayjs, { utc } from 'dayjs'
import { getNextDay } from "./customLocale";
import * as reader from './readController'
import * as extract from '../helpers/extractHelpers'
import * as date from '../helpers/dateTimeHelpers'
const prisma = new PrismaClient()


export async function saveLiveCount(UID:string, type:string, startOfDay:string, count:string){
    const counter = await prisma.counter.findFirst({where:{user_id: +UID, type:type}})
    if(!counter){
        await prisma.counter.create({
            data: {
                user_id:parseFloat(UID),
                timestamp: startOfDay,
                count: parseFloat(count),
                type: type
            }
        })
        return 'new counter created'
    }else{
        const counterId:number = counter.counter_id
        await prisma.counter.update({
            where: {
                counter_id: counterId
            },
            data: {
                count:parseFloat(count),
                timestamp: startOfDay
            }
        })
        return `counter ${counterId} was updated`
    }
}


export async function saveDailyCounts(){
    const allCounters : any[] = await prisma.counter.findMany()
    for(let i = 0; i < allCounters.length; i++){
        const startOfDay:string = dayjs().utc().startOf('day').toISOString()
        const counter_id:number = allCounters[i].counter_id
        const count:number = allCounters[i].count
        const dailyCounts = await prisma.dailyConsumption.findFirst({where:{counter_id, consumption_date: startOfDay}})
        if(!dailyCounts){
            await prisma.dailyConsumption.create({data:{
                counter_id: counter_id,
                consumption_date: startOfDay,
                consumption_counts: [count]
            }})
        }else{
            const consumptionCounts:number[] = dailyCounts.consumption_counts
            consumptionCounts.push(count)
            await prisma.dailyConsumption.update({
                where: {consumption_id: dailyCounts.consumption_id},
                data: {consumption_counts: consumptionCounts}
            })

        }
    }
}

interface Consumption {
    length: number;
    consumption_id: number;
    counter_id: number;
    consumption_date: Date;
    consumption_counts: number[]
  }

export async function saveWeeklyCounts() {
    const arrayOfDays = await reader.readWeeklyCounts() 
    for(let i = 0; i < arrayOfDays.length; i++){
        const startOfWeek:string = getNextDay(dayjs().startOf('week').utc().toDate()).toISOString()
        const counter_id:number = arrayOfDays[i].counter_id
        const lastItem:number = arrayOfDays[i].consumption_counts.length -1
        const countOfTheDay:number = arrayOfDays[i].consumption_counts[lastItem] - arrayOfDays[i].consumption_counts[0]
        const weeklyConsumptionTable = await prisma.weeklyConsumption.findFirst({where: {counter_id: counter_id, consumption_week_start: startOfWeek}})

        if(!weeklyConsumptionTable){            
            await prisma.weeklyConsumption.create({
                data: {
                  counter_id: counter_id,
                  consumption_week_start: startOfWeek,
                  consumption_week_counts: [countOfTheDay]
                }
            })
        }else{
            const weeklyCounts:number[] = weeklyConsumptionTable.consumption_week_counts
            const consumption_id:number = weeklyConsumptionTable.consumption_id
            weeklyCounts.push(countOfTheDay)
            await prisma.weeklyConsumption.update({where:{consumption_id:consumption_id}, data: {consumption_week_counts: weeklyCounts}})
        }
    } 
    
} 

export async function saveMonthlyCounts(){
    const todaysCounts = await prisma.dailyConsumption.findMany({
        where:{
            consumption_date: dayjs().utc().startOf('day').toDate()
        }})

    for(let i = 0; i<todaysCounts.length; i++){        
        const counterId = todaysCounts[i].counter_id
        const lastItem = todaysCounts[i].consumption_counts.length -1
        const startOfCurrentMonth = dayjs().utc().startOf('month').toDate()
        const todaysConsumption = todaysCounts[i].consumption_counts[lastItem] - todaysCounts[i].consumption_counts[0]
        const currentMonthsTable = await prisma.monthlyConsumption.findFirst({where: {counter_id: counterId, consumption_month: startOfCurrentMonth}})

        if(currentMonthsTable){
            const consumptionId = currentMonthsTable.consumption_id
            const arrayOfMonthlyCounts = currentMonthsTable.consumption_month_counts
            arrayOfMonthlyCounts.push(todaysConsumption)
            await prisma.monthlyConsumption.update({
                where: {consumption_id: consumptionId},
                data: {consumption_month_counts: arrayOfMonthlyCounts}
            })
        }else{
            await prisma.monthlyConsumption.create({ 
                data: {
                    counter_id: counterId,
                    consumption_month_counts: todaysConsumption,
                    consumption_month: startOfCurrentMonth
                }
            })
        }
    }  

}

export async function saveYearlyCounts(){
    const startOfCurrentMonth:Date = dayjs().utc().startOf('month').toDate()
    const startOfYear:number = dayjs().get('year')
    const monthlyConsumption = await prisma.monthlyConsumption.findMany({
        where: {consumption_month: startOfCurrentMonth}
    })
    for(let i = 0; i < monthlyConsumption.length; i++){
        const counterId:number = monthlyConsumption[i].counter_id
        const lastItem:number = monthlyConsumption.length - 1
        const countOfTheMonth: number = monthlyConsumption[i].consumption_month_counts[lastItem] - monthlyConsumption[i].consumption_month_counts[0]
        const yearlyConsumptionTable = await prisma.yearlyConsumption.findFirst({
            where: {counter_id: counterId, consumption_year: startOfYear}
        })
        if(yearlyConsumptionTable){
            const yearlyConsumptionTableId:number = yearlyConsumptionTable.consumption_id
            const yearlyConsumptionTableCounts = yearlyConsumptionTable.consumption_year_counts
            yearlyConsumptionTableCounts.push(countOfTheMonth)
            await prisma.yearlyConsumption.update({
                where: {consumption_id: yearlyConsumptionTableId},
                data: {consumption_year_counts: yearlyConsumptionTableCounts}
            })
        }else{
            await prisma.yearlyConsumption.create({
                data: {
                    counter_id: counterId,
                    consumption_year: startOfYear,
                    consumption_year_counts: [countOfTheMonth]
                }
            })
        }
    }

}


export function sumArray(arr:any) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      sum += arr[i]; 
    } 
    return sum; 
  }
  