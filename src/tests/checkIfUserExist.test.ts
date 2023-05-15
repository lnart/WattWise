import { describe, test, vi , expect, afterEach, Mock} from "vitest";
import { checkIfUserExist } from "../controller/loginController";
import { findUser } from "../controller/dbController";
 

 vi.mock("../controller/dbController.ts", async () => {
   return {
     findUser: vi.fn()
   };
 }); 

describe('checkIfUserExist', () => {
    afterEach(async() => {
        vi.restoreAllMocks()
    })

    test('should return true if user exist', async() => {
        (findUser as Mock).mockReturnValueOnce({email: 'test@example.com', name: 'test user', password: '0000'})
        const result = await checkIfUserExist('user@doesntExist')
        expect(result).toBeTruthy()
    })

    test('should return null if user does not exist', async()=> {
        (findUser as Mock).mockReturnValueOnce(null)
        const result = await checkIfUserExist('max@mustermann')
        expect(result).toBeFalsy()
    }) 
  })
  