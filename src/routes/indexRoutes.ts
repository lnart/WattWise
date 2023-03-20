import e, { Router } from "express";
import { Express, request, response } from "express";
import * as db from '../controller/dbController'
import * as count from '../controller/countController'
let router = Router()

router.get('/', (req, res) => {
    res.render('test', {
        liveCount: false,
        email: false,

    })
})


export default router