"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateValue = void 0;
const mqtt_1 = require("mqtt");
const dotenv_1 = require("dotenv");
const uuid_1 = require("uuid");
(0, dotenv_1.config)();
const clientId = (0, uuid_1.v4)();
const TOPICS = ['test/hack', 'gas/1/live'];
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
    }
    catch (error) {
        console.error(error);
    }
});
function generateValue() {
    let value = 3100;
    setInterval(() => {
        const increment = Math.floor(Math.random() * 30) + 1;
        value += increment;
        console.log(`Current value: ${value}`);
        client.publish('gas/1/live', value.toString());
    }, 2 * 60 * 100);
    return () => value;
}
exports.generateValue = generateValue;
//# sourceMappingURL=clientController.js.map