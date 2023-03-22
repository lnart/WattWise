import { Router } from "express";
import express from "express";
const router = Router()

router.use('/public', express.static('public'))

router.get('/', (req, res) => {
    res.render('test', {
        liveCount: false,
        email: false,

    })
})


export default router