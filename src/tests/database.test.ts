import { expect, it, test, vi } from "vitest";
import * as db from '../controller/dbController'
import { describe } from "node:test";


    test('successfully finds user', async()=>{
        const result = await db.findUser('lola@pafel')
        
        const expected = {
               "Created_at": new Date('2023-03-20T12:50:02.018Z'),
               "Email": "lola@pafel",
               "Firstname": "max",
               "Password": "$2b$10$VunNYHhwMJkFeVQDn7ZR6O8R4GFhgyNCoICuOxQ/MXxXf.pPvNbSy",
               "Role": "user",
               "Surname": "mustermann",
               "User_ID": 1,
               "Zipcode": 10963,
             }
        expect(result).toEqual(expected)
    })
