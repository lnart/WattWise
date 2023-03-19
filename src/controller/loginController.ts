import * as db from '../controller/dbController'
import bcrypt from 'bcrypt'

export async function checkIfUserExist(email: string){
    if(await db.findUser(email)){
        return true
    }else{
        return false
    }
}
