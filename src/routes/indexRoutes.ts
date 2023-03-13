import { Router } from "express";
import { Express, request, response } from "express";

let router = Router()

router.get('/', (req, res) => {
    res.render('test')
})

export default router