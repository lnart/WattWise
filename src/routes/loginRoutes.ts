import { Router } from "express";
import { Express, request, response } from "express";
import { createUser, findUser } from "../controller/dbController";
import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()
let router = Router()

router.get('/register', (req, res)=>{
    res.render('register', {
        message: false
    })
})

router.post('/register', async (req, res) => {
    if(await findUser(req.body.email) === null){
        let salt = await bcrypt.genSalt()
        let newUser = await createUser({
            Firstname: req.body.firstname,
            Surname: req.body.surname,
            Email: req.body.email,
            Zipcode: parseFloat(req.body.zipcode),
            Password: await bcrypt.hash(req.body.password, salt),
            Created_at: new Date()
        })
        res.send('login')
    }else{
        res.render('register', {
            message: 'Email Adress is already in use'
        })
    }
    
})

export default router