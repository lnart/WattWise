import express from "express";
import { config } from "dotenv";
import client from "./controller/mqttController";

config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.set('views', 'src/views')
app.set('view engine', 'ejs')
app.use('src/public', express.static('public'))

app.listen(process.env.PORT, () => {
    console.log(`STARTED SERVER ON PORT ${process.env.PORT}`);
})
