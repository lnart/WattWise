import { describe, test, vi , expect, afterEach, beforeEach} from "vitest";

import { checkIfUserExist } from "../controller/loginController";

import { checkServerIdentity } from "tls";

vi.mock('../controller/dbController.ts', async () => {
    function findUserMock(){}
    return {
        findUser: findUserMock
    }
})

describe('checkIfUserExist', () => {
    const findUserMock = vi.fn()
    
    beforeEach(() => {
        vi.resetAllMocks()
    })

    //the first one passes
    test('should return true if user exists', async () => {
        findUserMock.mockReturnValueOnce({email: 'test@example.com', name: 'test user', password: '0000'})
        
        const result = checkIfUserExist('jkhdkf')

        expect(result).toBeTruthy()
    })

    //the second fails because of the return value of the first mock
    test('should return null if user does not exist', async () => {
        findUserMock.mockReturnValueOnce(null)

        const result = await checkIfUserExist('lola@pafel')

        expect(result).toBeFalsy()
    })

    afterEach(async () => {
        vi.restoreAllMocks()
    })
})


// import { describe, test, vi , expect, afterEach, beforeEach} from "vitest";
// import { checkIfUserExist } from "../controller/loginController";
 

// describe('checkIfUserExist', () => {
//     afterEach(async() => {
//         vi.restoreAllMocks()
//     })
    
//     //the first one passes
//     test('should return true if user exist', async() => {
//         vi.mock('../controller/dbController.ts', async() => {
//             return {
//                 findUser: async() => {
//                    return {email:'test@example.com', name: 'test user', password: '0000'}
//                 }
//             }
//         } ) 
//         const result = checkIfUserExist('jkhdkf')
//         expect(result).toBeTruthy()
//     })
//     //the second fails because of the return value of the first mock
//     test('should return null if user does not exist', async()=> {
//         vi.mock('../controller/dbController.ts', async() => {
//             return {
//                 findUser: async() => {
//                     return null
//                 }
//             }
//         })
//         const result = await checkIfUserExist('lola@pafel')
//         expect(result).toBeFalsy()
//     })
    
// })





