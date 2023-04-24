import Jwt from "jsonwebtoken"
import { config } from "dotenv";
import { Request,Response } from "express";
import * as db from '../controller/dbController'

config()

export const authorization = (req:any, res:any, next:any) => {
    const header = req.headers.cookie
    
    if(!header){
      return res.redirect('/login')
    }
    const token = header.split('=')[1]
    const role = JSON.stringify(header).split('=')[0].split('"')[1]
    
    try {
      if(role === 'access_token' && token && process.env.ACCESS_TOKEN_SECRET){
        Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        next()
      }
      else{
        res.sendStatus(403)
      }
      
    } catch (error) {
      console.log(error);
      res.sendStatus(403)
    }
  };


   export function parseJwt (token:any) {
      return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  }