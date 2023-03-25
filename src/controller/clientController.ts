import { connect } from "mqtt";
import { config } from "dotenv";
import { v4 as uuid} from 'uuid';
import * as count from '../controller/countController'

config()
const clientId = uuid()
const TOPICS = ['test/hack', 'gas/1/live']
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
        }catch(error){
            console.error(error)
        }
    })


export function generateValue() {
    let value = 3100;
    setInterval(() => {
      const increment = Math.floor(Math.random() * 30) + 1;
      value += increment;
      console.log(`Current value: ${value}`);
      client.publish('gas/1/live', value.toString())
    }, 2 * 60 * 100);
    
    return () => value;
  }

  
