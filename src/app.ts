import {mqttClient} from "./controller/mqttController";
import express from "express";
import { config } from "dotenv";
import indexRoutes from './routes/indexRoutes'
import loginRoutes from './routes/loginRoutes'
import deletionRoutes from './routes/deletionRoutes'
import * as weather from './controller/weatherApiController'
import * as db from './controller/dbController'
import * as count from './controller/countController'
import * as execute from './controller/executeController'
import * as date from './helpers/dateTimeHelpers'
import cookieParser from "cookie-parser";
import WeekOfYear from 'dayjs/plugin/weekOfYear'
import isoWeek from 'dayjs/plugin/isoWeek'
import dayjs from './controller/customLocale'
import timezone from "dayjs/plugin/timezone";
import utc from 'dayjs/plugin/utc'
import { getNextDay } from "../src/controller/customLocale";
import * as reader from './controller/readController'
import { Prisma, PrismaClient } from "@prisma/client";


dayjs.extend(utc)
dayjs.extend(WeekOfYear)
dayjs.extend(isoWeek)
dayjs.extend(timezone)
 
config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.set('views', 'src/views')
app.set('view engine', 'ejs')
app.use('/public', express.static('public'))
app.use(indexRoutes)
app.use(loginRoutes)
app.use(deletionRoutes)
mqttClient
app.use(cookieParser())
const prisma = new PrismaClient()

execute.executeEveryNewHour()
setInterval(execute.executeEveryNewHour, 1000 * 60 * 60) 

execute.executeSaveWeeklyCountsDaily()
setInterval(execute.executeSaveWeeklyCountsDaily, 1000)

execute.executeSaveMonthlyCountsDaily()
setInterval(execute.executeSaveMonthlyCountsDaily, 1000)

 
app.listen(process.env.PORT, () => {
    console.log(`STARTED SERVER ON PORT ${process.env.PORT}`); 
})

