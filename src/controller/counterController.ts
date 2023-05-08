import { Prisma, PrismaClient } from "@prisma/client";
import dayjs from "dayjs";

const prisma = new PrismaClient

export async function createCounter(UID:number, type: string){
    try {
        const counter = await prisma.counter.create({
            data: {
                user_id: UID,
                type: type,
                count: 0,
                timestamp: new Date()
            }
        })
        return `counter was created`
    } catch (error) {
        console.error(error)
        return 'counter was not created'
    }

}

export async function deleteCounter(counterId:number){
    try {
        const counter = await prisma.counter.delete({
            where: {
                counter_id: counterId
            }
        })
        return `counter ${counter.counter_id} was deleted`
        
    } catch (error) {
        console.error(error)
        return 'counter was not deleted'
    }
}
