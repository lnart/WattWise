import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()


interface dbUser {
    username: string,
    Email: string,
    Password: string,
    Zipcode: number,
  }

export async function createUser(user: dbUser){
    const createdUser = await prisma.user.create({
        data: {
            username: user.username,
            email: user.Email,
            password: user.Password,
            zipcode: user.Zipcode,
        }
    })
    return createdUser
}

export async function findUser(email: string){
    const foundUser = await prisma.user.findFirst({
        where: {
            email: email
        }
    })
    return foundUser
}

export async function deleteUser(UID:number) {
    const user = await prisma.user.findUnique({
        where: {
            user_id: UID
        }
    })
    const counter = await prisma.counter.findMany({
        where: {
            user_id: UID
        }
    })
    for(let i = 0; i < counter.length; i++){
        const counterId = counter[i].counter_id

        
        await prisma.dailyConsumption.deleteMany({
            where: {
                counter_id: counterId
            }
        })
        await prisma.weeklyConsumption.deleteMany({
            where: {counter_id: counterId}
        })
        
        await prisma.monthlyConsumption.deleteMany({
            where: {
                counter_id: counterId
            }
        })
        await prisma.monthlyConsumption.deleteMany({
            where: {
                counter_id: counterId
            }
        })
        await prisma.counter.delete({
            where: {counter_id: counterId}
        })

        await prisma.user.delete({
            where: {user_id: UID}
        })
    }
}

export async function deleteTestUser(email:string){
    await prisma.user.deleteMany({
        where: {
            email: email
        }
    })
}


