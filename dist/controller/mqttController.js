"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mqttClient = void 0;
const mqtt_1 = require("mqtt");
const dotenv_1 = require("dotenv");
const uuid_1 = require("uuid");
(0, dotenv_1.config)();
const clientId = (0, uuid_1.v4)();
const TOPICS = ['test/hack'];
console.log('connecting to MQTT Broker');
const client = (0, mqtt_1.connect)('mqtts://edd3ce52ef5747ab963e27f2669a069c.s2.eu.hivemq.cloud:8883', {
    clientId,
    clean: true,
    connectTimeout: 7200,
    username: 'lennart',
    password: 'partying',
    reconnectPeriod: 10000,
});
client.on('connect', async () => {
    try {
        console.log('MQTT BROKER CONNECTED');
        client.subscribe(TOPICS, () => {
            console.log(`SUBSCRIPTED TO TOPICS: ${TOPICS}`);
        });
    }
    catch (error) {
        console.error(error);
    }
});
client.on('message', async (TOPIC, payload) => {
    try {
        console.log(`RECEIVED ${payload} FROM ${TOPIC}`);
    }
    catch (error) {
        console.error(error);
    }
});
client.on('error', (error) => {
    console.error(error);
});
exports.mqttClient = client;
//# sourceMappingURL=mqttController.js.map