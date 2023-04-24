import { Router } from "express";
import { Express, request, response } from "express";
import { createUser, findUser } from "../controller/dbController";
import { Prisma, PrismaClient } from "@prisma/client";
import * as login from '../controller/loginController'
import * as db from '../controller/dbController'
import * as count from '../controller/countController'
import bcrypt from 'bcrypt'
import Jwt from "jsonwebtoken";
import { config } from 'dotenv'
config()
import * as wt from '../controller/webTokenController'
import cookieParser, { signedCookie } from "cookie-parser";
const prisma = new PrismaClient()
let router = Router()

router.use(cookieParser());

  
router.get("/login", (req, res) => {    
    res.render('login')
  });
  

  router.get("/logout", (req, res) => {    
    return res
      .clearCookie('email')
      .clearCookie("access_token")
      .status(200)
      .redirect('/login')
  });
  

router.post('/register', async (req, res) => {
    if(await findUser(req.body.email) === null){
        let salt = await bcrypt.genSalt()
        let newUser = await createUser({
            username: req.body.firstname,
            Email: req.body.email,
            Zipcode: parseFloat(req.body.zipcode),
            Password: await bcrypt.hash(req.body.password, salt),
        })
        res.json({message: 'Successfully created User'})
    }else{
        res.json({
            message: 'Email Adress is already in use'
        })
    }
})

router.get('/register', (req,res) =>{
    res.render('register', {
        message: false
    })
})

router.post('/login', async(req, res) => {
    const user = await findUser(req.body.email)
    // const role = user?.Role
    
    try{
        
        if(await login.logInUser(req, res) && process.env.ACCESS_TOKEN_SECRET){
            const token = Jwt.sign({email: req.body.email}, process.env.ACCESS_TOKEN_SECRET)
            res
                .cookie('access_token', token)
                .redirect('/')
        }
    }catch(error){
        console.log(error);
        res.sendStatus(403)
        
    }
})

router.get('/user', wt.authorization, async(req, res) => {
    console.log(req.cookies);
    
    res.json({cookies: req.cookies})
})



export default router