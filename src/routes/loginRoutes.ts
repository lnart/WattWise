import { Router } from "express";
import { createUser, findUser } from "../controller/dbController";
import * as login from '../controller/loginController'
import bcrypt from 'bcrypt'
import Jwt from "jsonwebtoken";
import { config } from 'dotenv'
config()
import * as wt from '../controller/webTokenController'
import cookieParser from "cookie-parser";

let router = Router()

router.use(cookieParser());

  
router.get("/login", (req, res) => {
    try {
        res.render('login')
    } catch (error) {
        console.error(error)
    }    
  });
  

  router.get("/logout", (req, res) => {
      try {
        return res
          .clearCookie('email')
          .clearCookie("access_token")
          .status(200)
          .redirect('/login')
    } catch (error) {
        console.error(error)
    }    
  });
  

router.post('/register', async (req, res) => {
    try {
        if(await findUser(req.body.email) === null){
            let salt = await bcrypt.genSalt()
            let newUser = await createUser({
                username: req.body.firstname,
                Email: req.body.email,
                Zipcode: parseFloat(req.body.zipcode),
                Password: await bcrypt.hash(req.body.password, salt),
            })
            res.redirect('/login')
        }else{
            res.redirect('/login')
        }
        
    } catch (error) {
        console.error(error)
    }
})

router.get('/register', (req,res) =>{
    try {
        res.render('register', {
            message: false
        })
        
    } catch (error) {
        console.error(error)
    }
})

router.post('/login', async(req, res) => {
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
    res.json({cookies: req.cookies})
})



export default router