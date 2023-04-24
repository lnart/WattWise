import { Prisma, PrismaClient } from "@prisma/client";
import { countReset } from "console";
import dayjs from "dayjs";

const prisma = new PrismaClient

export async function createCounter(UID:number, type: string){
    await prisma.counter.create({
        data: {
            user_id: UID,
            type: type,
            count: 0,
            timestamp: dayjs().utc().toDate()
        }
    })
}

export async function deleteCounter(counterId:number){
    await prisma.counter.delete({
        where: {
            counter_id: counterId
        }
    })
}
