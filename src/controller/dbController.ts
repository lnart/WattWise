import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

interface dbUser {
    username: string,
    Email: string,
    Password: string,
    Zipcode: number,
  }

export async function createUser(user: dbUser){
    try {
        const createdUser = await prisma.user.create({
            data: {
                username: user.username,
                email: user.Email,
                password: user.Password,
                zipcode: user.Zipcode,
            }
        })
        return 'user was created'
    } catch (error) {
        console.error(error)
        return 'user was not created'
    }
}

export async function findUser(email: string){
    try {
        const foundUser = await prisma.user.findFirst({
            where: {
                email: email
            }
        })
        if(!foundUser){
            return 'user doesnt exist'
        }
        return foundUser
    } catch (error) {
        console.error(error)
        return 'incorrect argument'
    }
}

export async function deleteUser(UID:number) {
    try {
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
        
    } catch (error) {
        console.error(error)
        throw new Error('user was not deleted')
    }
}

export async function deleteTestUser(email:string){
    try {
        await prisma.user.deleteMany({
            where: {
                email: email
            }
        }) 
    } catch (error) {
        console.error(error)
        throw new Error('test user was not deleted')
    }
}


