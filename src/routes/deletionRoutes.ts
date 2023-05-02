import { Router } from "express";
import express from "express";
import * as db from '../controller/dbController'
import * as wt from '../controller/webTokenController'
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient
const router = Router()

router.use('/public',wt.authorization, express.static('public'))

router.get('/account', async(req, res) => {    
    try {
        const token:string = (req.headers.cookie!.split('=')[1]);
        const email:string = (wt.parseJwt(token)['email'])
        const user = await db.findUser(email)
        res.render('delete', {
            email: email
        })
    } catch (error) {
        console.error(error)
    }
})


router.get('/deleteUser', async(req, res) => {
    const token:string = (req.headers.cookie!.split('=')[1]);
    const email:string = (wt.parseJwt(token)['email'])
    const user = await db.findUser(email)
    const UID:number = user!.user_id
    db.deleteUser(UID)
    return res
    .clearCookie('email')
    .clearCookie("access_token")
    .redirect('/register')

})


router.post('/accountSettings', async (req, res) => {
    const token:string = (req.headers.cookie!.split('=')[1]);
    const email:string = (wt.parseJwt(token)['email'])
    console.log(email);
    
    const user = await db.findUser(email)
    console.log(user);
    
    const UID: number = user!.user_id
    const newEmail = req.body.email
    const newPassword = req.body.password
    await prisma.user.update({
        where: {user_id:UID},
        data: {
            email: newEmail, 
            password: newPassword
        }
    })
    res 
        .redirect('/logout')
})
export default router 