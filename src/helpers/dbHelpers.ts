import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export async function findCounter(UID:string, type: string) {
    const counter = await prisma.counter.findFirst({
        where: { user_id: +UID, type: type },
      });
      return counter
}
