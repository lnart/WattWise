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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCountsOfMonth = exports.arrayCountsOfMonth = exports.getArrayOfDaysInMonth = exports.getNextSunday = exports.sumOfWeeklyData = exports.arrayCountsOfWeek = exports.getCountsOfWeek = exports.calcKwhInEuro = exports.sumArray = exports.getAverageCounts = exports.parseAndSortData = exports.extractCountsOfToday = exports.getAllCountsFromCurrentMonth = exports.createTopic = exports.readYesterdayCount = exports.readLiveCount = exports.calcLiveCount = exports.saveLiveCount = void 0;
const client_1 = require("@prisma/client");
const db = __importStar(require("./dbController"));
const dayjs_1 = __importDefault(require("dayjs"));
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
            Year: new Date().getFullYear(),
            WeekOfYear: (0, dayjs_1.default)().week()
        }
    });
}
exports.saveLiveCount = saveLiveCount;
async function calcLiveCount(email) {
    const currentCount = await readLiveCount(email);
    const yesterdaysCount = await readYesterdayCount(email);
    //@ts-ignore
    return (currentCount === null || currentCount === void 0 ? void 0 : currentCount.count) - (yesterdaysCount === null || yesterdaysCount === void 0 ? void 0 : yesterdaysCount.count);
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
    //@ts-ignore
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
async function getAllCountsFromCurrentMonth(counter_type, email) {
    const user = await db.findUser(email);
    const UID = user === null || user === void 0 ? void 0 : user.User_ID;
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const allCounts = await prisma.consumption.findMany({
        where: {
            User_ID: UID,
            Month: month,
            Year: year,
            counter_type: counter_type
        }
    });
    return allCounts;
}
exports.getAllCountsFromCurrentMonth = getAllCountsFromCurrentMonth;
async function extractCountsOfToday(array) {
    const todaysCounts = [];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const today = new Date().getDate();
    for (let i = 0; i < array.length; i++) {
        if (array[i]['Year'] === currentYear && array[i]['Month'] === currentMonth && array[i]['Day'] === today) {
            todaysCounts.push(array[i]['count']);
        }
    }
    return todaysCounts;
}
exports.extractCountsOfToday = extractCountsOfToday;
function parseAndSortData(data) {
    const currentDate = new Date();
    const currentDay = currentDate.getUTCDate();
    const currentMonth = currentDate.getUTCMonth() + 1;
    const currentYear = currentDate.getUTCFullYear();
    const sortedData = {};
    data.forEach(item => {
        const hour = new Date(item.Date).getUTCHours();
        if (item.Day === currentDay &&
            item.Month === currentMonth &&
            item.Year === currentYear) {
            if (!sortedData[hour]) {
                sortedData[hour] = 0;
            }
            sortedData[hour] += item.count;
        }
    });
    return sortedData;
}
exports.parseAndSortData = parseAndSortData;
async function getAverageCounts(array) {
    let counts = [];
    const dividor = array.length;
    for (let i = 0; i < array.length; i++) {
        counts.push(array[i].count);
    }
    ;
    const sum = await sumArray(counts);
    return Math.round(sum / dividor);
}
exports.getAverageCounts = getAverageCounts;
async function sumArray(array) {
    return array.reduce((total, current) => {
        return total + current;
    }, 0);
}
exports.sumArray = sumArray;
async function calcKwhInEuro(count) {
    return Math.round(count * 0.3445);
}
exports.calcKwhInEuro = calcKwhInEuro;
async function getCountsOfWeek(email, counter_type) {
    const user = await db.findUser(email);
    const UID = user === null || user === void 0 ? void 0 : user.User_ID;
    const week = (0, dayjs_1.default)().week();
    const countsOfWeek = await prisma.consumption.findMany({
        where: {
            User_ID: UID,
            WeekOfYear: week,
            counter_type: counter_type
        }
    });
    return countsOfWeek;
}
exports.getCountsOfWeek = getCountsOfWeek;
async function arrayCountsOfWeek(email, counter_type) {
    const counts = await getCountsOfWeek(email, counter_type);
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const countsByDay = counts.reduce((result, count) => {
        const dayOfWeek = count.Date.getDay();
        const dayKey = days[dayOfWeek];
        //@ts-ignore
        result[dayKey].push(count.count);
        return result;
    }, {
        sunday: [],
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: []
    });
    return countsByDay;
}
exports.arrayCountsOfWeek = arrayCountsOfWeek;
async function sumOfWeeklyData(data) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const differences = [];
    for (let i = 0; i < days.length; i++) {
        const day = days[i];
        const counts = data[day];
        let sum = 0;
        if (counts.length === 0) {
            differences.push(0);
        }
        else {
            for (let j = 0; j < counts.length - 1; j++) {
                sum += counts[j + 1] - counts[j];
            }
            differences.push(sum);
        }
    }
    const lastSunday = differences.shift();
    const nextSundaysCount = await getNextSunday('lola@pafel', 'gas');
    differences.push(nextSundaysCount);
    return differences;
}
exports.sumOfWeeklyData = sumOfWeeklyData;
async function getNextSunday(email, counter_type) {
    const user = await db.findUser(email);
    const UID = user === null || user === void 0 ? void 0 : user.User_ID;
    const nextSunday = await prisma.consumption.findFirst({
        where: {
            User_ID: UID,
            counter_type: counter_type,
            WeekOfYear: (0, dayjs_1.default)().week() + 1
        },
        take: 1
    });
    if (nextSunday) {
        const nextSundaysFirstCount = await prisma.consumption.findMany({
            where: {
                User_ID: UID,
                counter_type: 'gas',
                Day: nextSunday.Day
            },
            take: 1
        });
        const nextSundaysLastCount = await prisma.consumption.findMany({
            where: {
                User_ID: UID,
                counter_type: 'gas',
                Day: nextSunday.Day
            },
            take: -1
        });
        //@ts-ignore
        return nextSundaysLastCount[0].count - nextSundaysFirstCount[0].count;
    }
    else {
        return 0;
    }
}
exports.getNextSunday = getNextSunday;
function getArrayOfDaysInMonth() {
    const upperLimit = (0, dayjs_1.default)().daysInMonth();
    const days = [];
    for (let i = 1; i < upperLimit + 1; i++) {
        days.push(i);
    }
    return days;
}
exports.getArrayOfDaysInMonth = getArrayOfDaysInMonth;
async function arrayCountsOfMonth(email, counter_type) {
    const counts = await getCountsOfMonth(email, counter_type);
    const days = getArrayOfDaysInMonth();
    const countsByDay = counts.reduce((result, count) => {
        const dayOfWeek = count.Date.getDay();
        const dayKey = days[dayOfWeek];
        //@ts-ignore
        result[dayKey].push(count.count);
        return result;
    }, {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
        9: [],
        10: [],
        11: [],
        12: [],
        13: [],
        14: [],
        15: [],
        16: [],
        17: [],
        18: [],
        19: [],
        20: [],
        21: [],
        22: [],
        23: [],
        24: [],
        25: [],
        26: [],
        27: [],
        28: [],
        29: [],
        30: []
    });
    return countsByDay;
}
exports.arrayCountsOfMonth = arrayCountsOfMonth;
async function getCountsOfMonth(email, counter_type) {
    const user = await db.findUser(email);
    const UID = user === null || user === void 0 ? void 0 : user.User_ID;
    const week = (0, dayjs_1.default)().week();
    const countsOfWeek = await prisma.consumption.findMany({
        where: {
            User_ID: UID,
            Month: new Date().getMonth() + 1,
            counter_type: counter_type
        }
    });
    return countsOfWeek;
}
exports.getCountsOfMonth = getCountsOfMonth;
//# sourceMappingURL=countController.js.map