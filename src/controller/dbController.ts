import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()


interface dbUser {
    Firstname: string,
    Surname: string,
    Email: string,
    Password: string,
    Zipcode: number,
    Created_at: Date
  }

export async function createUser(user: dbUser){
    const createduser = await prisma.user.create({
        data: {
            Firstname: user.Firstname,
            Surname: user.Surname,
            Email: user.Email,
            Password: user.Password,
            Zipcode: user.Zipcode,
            Created_at: user.Created_at,
        }
    })
    console.log(createduser);
    
}



