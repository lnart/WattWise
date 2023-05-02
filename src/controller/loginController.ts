import * as db from '../controller/dbController'
import bcrypt from 'bcrypt'
import { config } from 'dotenv'
config()

export async function checkIfUserExist(email: string){
    try {
        if(await db.findUser(email)){
            return true
        }else{
            return false
        }
    
    } catch (error) {
        console.error(error)
        throw new Error('User was not found')
    }
}

export async function compareUserCredentials(email: string, password: string){
    try {
        const user = await db.findUser(email)
        const hashedPassword = user?.password    
        //@ts-ignore
        const match = bcrypt.compare(password, hashedPassword)
        if(match) return true
        return false
        
    } catch (error) {
        console.error(error)
    }
    
}

export async function logInUser(req:any, res:any){
    try {
        const user = await db.findUser(req.body.email)
        if(await checkIfUserExist(req.body.email) === false){        
            return res.redirect('/login')
        }else if(await checkIfUserExist(req.body.email) && await compareUserCredentials(req.body.email, req.body.password)){        
            return true
        }else{        
            return res.redirect('/login')
        }
        
    } catch (error) {
        console.error(error)
    }
}

