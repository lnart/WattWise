import { Router } from "express";
import express from "express";
import * as db from '../controller/dbController'
import * as wt from '../controller/webTokenController'
import * as reader from '../controller/readController'

const router = Router()

router.use('/public', express.static('public'))

router.get('/',wt.authorization, async(req, res) => {
    console.log(req.headers);
    
    try {
        const token:string = (req.headers.cookie!.split('=')[1]);
        const email:string = (wt.parseJwt(token)['email'])
        const user = await db.findUser(email)
        const UID:number = user!.user_id
        const gasCounts = await reader.readConsumptionCounts(UID, 'gas')
        const electricityCounts = await reader.readConsumptionCounts(UID, 'electricity')
        const waterCounts = await reader.readConsumptionCounts(UID, 'water')
        
        res.render('test', {
            email:email,
            dayYGas : gasCounts.yAxisDay,
            weekYGas: gasCounts.yAxisWeek,
            monthYGas: gasCounts.yAxisMonth,
            yearYGas: gasCounts.yAxisYear,
            yearY: [1, 2, 3, 4, 5, 6, ,7 ,8, 9, 1, 2, 3],
            yAxisWeek: 12
        })
        
    } catch (error) {
        console.log(error)
    }
})


export default router