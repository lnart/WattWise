import { PrismaClient } from "@prisma/client"
import * as db from "./dbController"

const prisma = new PrismaClient()


export async function saveLiveCount(count: any, topic: string){
    const UID = topic.split('/')[1]
    const type = topic.split('/')[0]
    await prisma.consumption.create({
        data: {
            User_ID: parseFloat(UID),
            count: parseFloat(count),
            counter_type: type,
            Date: new Date(),
            Day: new Date().getDate(),
            Month: new Date().getMonth()+1 ,
            Year: new Date().getFullYear()
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
    const UID = user?.User_ID
    const liveCount = await prisma.consumption.findFirst({
        where: {User_ID: UID},
        take: -1
    })
    return liveCount
}


export async function readYesterdayCount(email: string){ //covered
    const user = await db.findUser(email)
    const UID = user?.User_ID
    let liveCount = await readLiveCount(email)
    //@ts-ignore
    const day = liveCount.Day
    const yesterdayCount = await prisma.consumption.findFirst({
        where: {
            User_ID: UID,
            Day: day
        }
    })
    return yesterdayCount
}


export async function createTopic(email: string, type: string, array: any){
    const user = await db.findUser(email)
    const userid = user?.User_ID
    const topic = `${type}/${userid}/live`
    await prisma.topics.create({
        data: {
            name: topic
        }
    })
}

export async function getAllCountsFromCurrentMonth(counter_type: string){
    const date : Date = new Date()
    const month : number = date.getMonth() + 1
    const year : number = date.getFullYear() 
    const allCounts = await prisma.consumption.findMany({
        where: {
            Month: month,
            Year: year,
            counter_type: counter_type
        }
    })    
    return allCounts
} 


export async function getAverageCounts(array: any) {
    let counts:any = []
    const dividor:number = array.length
    for(let i = 0; i<array.length; i++){
        counts.push(array[i].count)
    }
    console.log(counts);
    
    const sum = await sumArray(counts)
    console.log(sum);
    
    return sum / dividor
}

export async function sumArray(array: any[]){
    return array.reduce((total: any, current: any) => {
        return total + current;
    }, 0);
}

export async function calcKwhInEuro(count: number){
    return Math.round(count*0.3445)
}