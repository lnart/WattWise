import { Router } from "express";
import express from "express";
import * as db from '../controller/dbController'
import * as count from '../controller/countController'
import * as mqtt from '../controller/clientController'
import * as wt from '../controller/webTokenController'
import dayjs from "dayjs";
import * as reader from '../controller/readController'

const router = Router()

router.use('/public',wt.authorization, express.static('public'))

router.get('/account', async(req, res) => {    
    try {
        const token:string = (req.headers.cookie!.split('=')[1]);
        const email:string = (wt.parseJwt(token)['email'])
        const user = await db.findUser(email)
        res.render('delete')
    } catch (error) {
        
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

export default router