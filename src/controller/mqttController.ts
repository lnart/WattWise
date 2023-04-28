import { connect } from "mqtt";
import { config } from "dotenv";
import { v4 as uuid} from 'uuid';
import * as count from '../controller/countController'
import { PrismaClient } from "@prisma/client"
import * as date from '../helpers/dateTimeHelpers'
import * as extract from '../helpers/extractHelpers'
const prisma = new PrismaClient

config()
const clientId = uuid()
const TOPICS = ['test/hack', 'electricity/2/live', 'gas/2/live', 'water/2/live', 'gas/4/live']
console.log('connecting to MQTT Broker');

const client = connect('mqtts://edd3ce52ef5747ab963e27f2669a069c.s2.eu.hivemq.cloud:8883', {
    clientId,
    clean: true,
    connectTimeout: 7200,
    username: 'lennart',
    password: 'partying',
    reconnectPeriod: 10000,
  });

    client.on('connect', async() => {
        try{
            console.log('MQTT BROKER CONNECTED');
            client.subscribe(TOPICS, () => {
                console.log(`SUBSCRIPTED TO TOPICS: ${TOPICS}`);
            })
        }catch(error){
            console.error(error)
        }
    })

client.on('message', async(TOPIC, payload)=> {
    try{
        const counterType:string = extract.extractCounterTypeFromTopic(TOPIC)
        const userId:string = extract.extractUserIdFromTopic(TOPIC)
        const startOfDay:string = date.getStartOfDayAsString()
        const recentCount:string = payload.toString()
        await count.saveLiveCount(userId, counterType, startOfDay, recentCount)
        console.log(`RECEIVED ${payload} FROM ${TOPIC}`);
        }
    catch(error){
        console.error(error)
    }
})

client.on('error', (error) => {
    console.error(error);
})

export const mqttClient = client