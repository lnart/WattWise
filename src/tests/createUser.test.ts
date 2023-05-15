import {afterEach, beforeEach,expect, vi, test, describe} from 'vitest'
import { createUser } from '../controller/dbController'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


describe('createUser function works properly', async() => {
    
    test('creates user with correct credentials', async() => {
        await prisma.user.deleteMany({where: {email:'marie@mustermann'}})
        const dbUser = {
            username: 'marie',
            Email: 'marie@mustermann',
            Password: 'p',
            Zipcode: 10963
        }
        const result = await createUser(dbUser)
        const expected = 'user was created'
        expect(result).toEqual(expected)
    })

    test('doesnt create user with duplicate credentials', async() => {
        const dbUser = {
            username: 'marie',
            Email: 'marie@mustermann',
            Password: 'p',
            Zipcode: 10963
        }
        const result = await createUser(dbUser)
        const expected = 'user was not created'
        expect(result).toEqual(expected)
    })
})