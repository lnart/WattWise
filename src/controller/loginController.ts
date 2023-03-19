import * as db from '../controller/dbController'
import bcrypt from 'bcrypt'

export async function checkIfUserExist(email: string){
    if(await db.findUser(email)){
        return true
    }else{
        return false
    }
}

export async function compareUserCredentials(email: string, password: string){
    const user = await db.findUser(email)
    const hashedPassword = user?.Password
    //@ts-ignore
    if(bcrypt.compare(hashedPassword, password)){
        return true
    }else{
        return false
    }
    
}