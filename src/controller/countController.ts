import { PrismaClient } from "@prisma/client"
import * as db from "./dbController"
import dayjs from 'dayjs'
import { Request,Response } from "express";

const prisma = new PrismaClient()


export async function saveLiveCount(count: any, topic: string){
    const UID = topic.split('/')[1]
    const type = topic.split('/')[0]    
    await prisma.dailyConsumption.create({
        data: {
            consumption_date: new Date(),
            consumption_counts: count,
            counter_id: parseFloat(UID)
        }
    })
}


export async function calcLiveCount(email: string){ //covered
    const currentCount = await readLiveCount(email)
    const yesterdaysCount = await readYesterdayCount(email)
    //@ts-ignore
    return currentCount?.count - yesterdaysCount?.count
}


export async function readLiveCount(email: string){ //covered
    const user = await db.findUser(email)
    const UID = user?.user_id
    const liveCount = await prisma.dailyConsumption.findFirst({
        where: {counter_id: UID},
        take: -1
    })
    return liveCount
}


export async function getAllCountsFromCurrentMonth(counter_type: string, email:string){
    const user = await db.findUser(email)
    const UID = user?.User_ID
    const date : Date = new Date()
    const month : number = date.getMonth() + 1
    const year : number = date.getFullYear() 
    const allCounts = await prisma.consumption.findMany({
        where: {
            User_ID:UID,
            Month: month,
            Year: year,
            counter_type: counter_type
        }
    })    
    return allCounts
}


export async function extractCountsOfToday(array: Array<{User_ID: number, Date: Date, count: number, counter_type: string, Day: number, Month: number, Year: number, WeekOfYear: number, ID: number}>) {
    const todaysCounts: number[] = [];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const today = new Date().getDate();
    for (let i = 0; i < array.length; i++) {
        if (array[i]['Year'] === currentYear && array[i]['Month'] === currentMonth && array[i]['Day'] === today) {
            todaysCounts.push(array[i]['count']);
        }
    }
    return todaysCounts;
}

interface DataItem {
    User_ID: number;
    Date: string;
    count: number;
    counter_type: string;
    Day: number;
    Month: number;
    Year: number;
    WeekOfYear: number;
    ID: number;
  }
  
  interface SortedData {
    [key: number]: number;
  }
  
  export function parseAndSortData(data: DataItem[]): SortedData {

    const currentDate = new Date();
  
    const currentDay = currentDate.getUTCDate();
    const currentMonth = currentDate.getUTCMonth() + 1;
    const currentYear = currentDate.getUTCFullYear();
  
    const sortedData: SortedData = {};
  
    data.forEach(item => {
      const hour = new Date(item.Date).getUTCHours();
  
      if (
        item.Day === currentDay &&
        item.Month === currentMonth &&
        item.Year === currentYear
      ) {
        if (!sortedData[hour]) {
          sortedData[hour] = 0;
        }
  
        sortedData[hour] += item.count;
      }
    });
  
    return sortedData;
  }

  
  
  

export async function getAverageCounts(array: any) {
    let counts:any = []
    const dividor:number = array.length
    for(let i = 0; i<array.length; i++){
        counts.push(array[i].count)
    };
    const sum = await sumArray(counts)
    
    return Math.round(sum / dividor)
}

export async function sumArray(array: any[]){
    return array.reduce((total: any, current: any) => {
        return total + current;
    }, 0);
}

export async function calcKwhInEuro(count: number){
    return Math.round(count*0.3445)
}

export async function getCountsOfWeek(email:string, counter_type:string){
    const user = await db.findUser(email)
    const UID = user?.User_ID
    const week = dayjs().week()
    
    const countsOfWeek = await prisma.consumption.findMany({
        where:{
            User_ID: UID,
            WeekOfYear: week,
            counter_type:counter_type
        }
    })
    return countsOfWeek
}

export async function arrayCountsOfWeek(email: string, counter_type:string) {
    const counts = await getCountsOfWeek(email, counter_type);
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  
    const countsByDay = counts.reduce((result, count) => {
      const dayOfWeek = count.Date.getDay();
      const dayKey = days[dayOfWeek];
      //@ts-ignore
      result[dayKey].push(count.count);
      return result;
    }, {
      sunday: [],
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: []
    });
    return countsByDay;
  }

  export async function sumOfWeeklyData(data: { [x: string]: never[]; }) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const differences = [];
  
  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    const counts = data[day];
    let sum = 0;
    
    if (counts.length === 0) {
      differences.push(0);
    } else {
      for (let j = 0; j < counts.length - 1; j++) {
        sum += counts[j + 1] - counts[j];
      }
      differences.push(sum);
    }
  }
  const lastSunday = differences.shift()
  const nextSundaysCount = await getNextSunday('lola@pafel', 'gas')
  differences.push(nextSundaysCount)
  return differences;

  }

export async function getNextSunday(email:string, counter_type:string){
    const user = await db.findUser(email)
    const UID = user?.User_ID
    const nextSunday = await prisma.consumption.findFirst({
        where:{
            User_ID:UID,
            counter_type:counter_type,
            WeekOfYear: dayjs().week()+1
        },
        take: 1
    })
    if(nextSunday){
        const nextSundaysFirstCount = await prisma.consumption.findMany({
            where: {
                User_ID: UID,
                counter_type: 'gas',
                Day: nextSunday.Day
            },
            take: 1
        })
        const nextSundaysLastCount = await prisma.consumption.findMany({
            where: {
                User_ID: UID,
                counter_type: 'gas',
                Day: nextSunday.Day
            },
            take: -1
        })
        //@ts-ignore
        return nextSundaysLastCount[0].count - nextSundaysFirstCount[0].count
    }else{
        return 0
    }
}

export function getArrayOfDaysInMonth(){
    const upperLimit = dayjs().daysInMonth()
    const days = []
    for(let i = 1; i<upperLimit+1; i++){
        days.push(i)
    }
    return days
}

export async function arrayCountsOfMonth(email: string, counter_type:string) {
    const counts = await getCountsOfMonth(email, counter_type);
    const days = getArrayOfDaysInMonth();
  
    const countsByDay = counts.reduce((result, count) => {
      const dayOfWeek = count.Date.getDay();
      const dayKey = days[dayOfWeek];
      //@ts-ignore
      result[dayKey].push(count.count);
      return result;
    }, {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
      8: [],
      9: [],
      10: [],
      11: [],
      12: [],
      13: [],
      14: [],
      15: [],
      16: [],
      17: [],
      18: [],
      19: [],
      20: [],
      21: [],
      22: [],
      23: [],
      24: [],
      25: [],
      26: [],
      27: [],
      28: [],
      29: [],
      30: []

    });
    return countsByDay;
  }

  export async function getCountsOfMonth(email:string, counter_type:string){
    const user = await db.findUser(email)
    const UID = user?.User_ID
    const week = dayjs().week()
    
    const countsOfWeek = await prisma.consumption.findMany({
        where:{
            User_ID: UID,
            Month: new Date().getMonth()+1,
            counter_type:counter_type
        }
    })
    return countsOfWeek
}