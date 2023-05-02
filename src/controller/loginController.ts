import * as db from '../controller/dbController'
import bcrypt from 'bcrypt'
import { config } from 'dotenv'
config()

export async function checkIfUserExist(email: string){
    if(await db.findUser(email)){
        return true
    }else{
        return false
    }
}

export async function compareUserCredentials(email: string, password: string){
    const user = await db.findUser(email)
    const hashedPassword = user?.password    
    //@ts-ignore
    const match = bcrypt.compare(password, hashedPassword)
    if(match) return true
    return false
    
}

export async function logInUser(req:any, res:any){
    const user = await db.findUser(req.body.email)
    if(await checkIfUserExist(req.body.email) === false){        
        return res.redirect('/login')
    }else if(await checkIfUserExist(req.body.email) && await compareUserCredentials(req.body.email, req.body.password)){        
        return true
    }else{        
        return res.redirect('/login')
    }
}

