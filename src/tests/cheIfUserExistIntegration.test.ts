import { describe, test, expect} from "vitest";
import { checkIfUserExist } from "../controller/loginController";
import { createUser, deleteTestUser } from "../controller/dbController";


describe('checkIfRealUserExist', async () => {
    
    test('should return true if a real user exist', async() => {
         const dbUser = {
             username: 'testuser',
             Email: 'test@user',
             Password: 'testuser',
             Zipcode: 10963,
         }

      await createUser(dbUser)
      const result = await checkIfUserExist('test@user')
      expect(result).toBeTruthy()
      await deleteTestUser('test@user')
    })

    test('should return false if user doesnt exist', async() => {
        const result = await checkIfUserExist('test@user')
        expect(result).toBeFalsy()
    })

    test('should return error if wrong input type', async() => {
        //@ts-ignore
        await expect(checkIfUserExist(1)).rejects.toThrow('wrong input')
    })
})