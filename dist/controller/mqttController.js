"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mqttClient = void 0;
const mqtt_1 = require("mqtt");
const dotenv_1 = require("dotenv");
const uuid_1 = require("uuid");
const count = __importStar(require("../controller/countController"));
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
        count.saveLiveCount(payload, TOPIC);
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