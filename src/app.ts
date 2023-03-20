import {mqttClient} from "./controller/mqttController";
import express from "express";
import { config } from "dotenv";
import indexRoutes from './routes/indexRoutes'
import loginRoutes from './routes/loginRoutes'
config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.set('views', 'src/views')
app.set('view engine', 'ejs')
app.use('public', express.static('./public'))
app.use(indexRoutes)
app.use(loginRoutes)
mqttClient

app.listen(process.env.PORT, () => {
    console.log(`STARTED SERVER ON PORT ${process.env.PORT}`);
})

