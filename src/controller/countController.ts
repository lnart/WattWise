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

export async function readLiveCount(email: string){
    const user = await db.findUser(email)
    const UID = user?.User_ID
    
    let liveCount = await prisma.consumption.findFirst({
        where: {User_ID: UID},
        take: -1
    })

    let yesterdayCount = await prisma.consumption.findFirst({
        where: {
            User_ID: UID,
            Day: parseFloat(liveCount?.Day) -1,
        }
    })

    return  parseFloat(liveCount?.count) - parseFloat(yesterdayCount?.count)
}


