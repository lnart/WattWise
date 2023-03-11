import { connect } from "mqtt";
import { config } from "dotenv";
import { v4 as uuid} from 'uuid';
import { errorMonitor } from "events";

config()
const clientId = uuid()
const TOPICS = ['test/hack']
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
        console.log(`RECEIVED ${payload} FROM ${TOPIC}`);
        }
    catch(error){
        console.error(error)
    }
})

client.on('error', (error) => {
    console.error(error);
})

export default client