import { PrismaClient } from "@prisma/client"
import * as db from "./dbController"
import { log } from "console"

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