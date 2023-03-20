import { Router } from "express";
import { Express, request, response } from "express";
import { createUser, findUser } from "../controller/dbController";
import { Prisma, PrismaClient } from "@prisma/client";
import * as login from '../controller/loginController'
import * as db from '../controller/dbController'
import * as count from '../controller/countController'
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
        res.render('login', {message: ''})
    }else{
        res.render('register', {
            message: 'Email Adress is already in use'
        })
    }
    
})

router.get('/login', (req, res) => {
    res.render('login', {message : false})
})

router.post('/login', async(req, res) => {
    if(await login.checkIfUserExist(req.body.email) === false){
        res.render('login', {message : 'Email Doesnt Exist'})

    }else if(await login.checkIfUserExist(req.body.email) && await login.compareUserCredentials(req.body.email, req.body.password)){
        res.render('test', {
            email: req.body.email,
            liveCount: await count.readLiveCount(req.body.email)
        })
    }else{
        res.render('login', {message: 'Wrong Password'})
    }
    
})

export default router