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
exports.createTopic = exports.readYesterdayCount = exports.readLiveCount = exports.calcLiveCount = exports.saveLiveCount = void 0;
const client_1 = require("@prisma/client");
const db = __importStar(require("./dbController"));
const prisma = new client_1.PrismaClient();
async function saveLiveCount(count, topic) {
    const UID = topic.split('/')[1];
    const type = topic.split('/')[0];
    await prisma.consumption.create({
        data: {
            User_ID: parseFloat(UID),
            count: parseFloat(count),
            counter_type: type,
            Date: new Date(),
            Day: new Date().getDate(),
            Month: new Date().getMonth() + 1,
            Year: new Date().getFullYear()
        }
    });
}
exports.saveLiveCount = saveLiveCount;
async function calcLiveCount(email) {
    const user = await db.findUser(email);
    const UID = user === null || user === void 0 ? void 0 : user.User_ID;
    let liveCount = await prisma.consumption.findFirst({
        where: { User_ID: UID },
        take: -1
    });
    let yesterdayCount = await prisma.consumption.findFirst({
        where: {
            User_ID: UID,
            Day: liveCount === null || liveCount === void 0 ? void 0 : liveCount.Day,
        }
    });
    let countLive = liveCount === null || liveCount === void 0 ? void 0 : liveCount.count;
    let countYesterday = yesterdayCount === null || yesterdayCount === void 0 ? void 0 : yesterdayCount.count;
    return liveCount - yesterdayCount;
}
exports.calcLiveCount = calcLiveCount;
async function readLiveCount(email) {
    const user = await db.findUser(email);
    const UID = user === null || user === void 0 ? void 0 : user.User_ID;
    const liveCount = await prisma.consumption.findFirst({
        where: { User_ID: UID },
        take: -1
    });
    return liveCount;
}
exports.readLiveCount = readLiveCount;
async function readYesterdayCount(email) {
    const user = await db.findUser(email);
    const UID = user === null || user === void 0 ? void 0 : user.User_ID;
    let liveCount = await readLiveCount(email);
    const day = liveCount.Day;
    const yesterdayCount = await prisma.consumption.findFirst({
        where: {
            User_ID: UID,
            Day: day
        }
    });
    return yesterdayCount;
}
exports.readYesterdayCount = readYesterdayCount;
async function createTopic(email, type, array) {
    const user = await db.findUser(email);
    const userid = user === null || user === void 0 ? void 0 : user.User_ID;
    const topic = `${type}/${userid}/live`;
    await prisma.topics.create({
        data: {
            name: topic
        }
    });
}
exports.createTopic = createTopic;
//# sourceMappingURL=countController.js.map