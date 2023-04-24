"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sumArray = exports.saveMonthlyCounts = exports.readDailyOverview = exports.executeSaveWeeklyCounts = exports.saveWeeklyCounts = exports.readWeeklyCounts = exports.executeSaveDailyCountsHourly = exports.saveDailyCounts = exports.saveLiveCount = void 0;
const client_1 = require("@prisma/client");
const dayjs_1 = __importDefault(require("dayjs"));
const prisma = new client_1.PrismaClient();
async function saveLiveCount(count, topic) {
    const UID = topic.split('/')[1];
    const type = topic.split('/')[0];
    const counter = await prisma.counter.findFirst({ where: { user_id: +UID, type: type } });
    if (!counter) {
        await prisma.counter.create({
            data: {
                user_id: parseFloat(UID),
                timestamp: (0, dayjs_1.default)().startOf('day').toDate(),
                count: parseFloat(count),
                type: type
            }
        });
    }
    else {
        const counterId = counter.counter_id;
        await prisma.counter.update({
            where: {
                counter_id: counterId
            },
            data: {
                count: parseFloat(count),
                timestamp: (0, dayjs_1.default)().startOf('day').toDate()
            }
        });
    }
}
exports.saveLiveCount = saveLiveCount;
async function saveDailyCounts() {
    const allCounters = await prisma.counter.findMany();
    for (let i = 0; i < allCounters.length; i++) {
        const counter_id = allCounters[i].counter_id;
        const count = allCounters[i].count;
        const dailyCounts = await prisma.dailyConsumption.findFirst({ where: { counter_id, consumption_date: (0, dayjs_1.default)().startOf('day').toDate() } });
        if (!dailyCounts) {
            await prisma.dailyConsumption.create({ data: {
                    counter_id: counter_id,
                    consumption_date: (0, dayjs_1.default)().startOf('day').toDate(),
                    consumption_counts: [count]
                } });
        }
        else {
            const consumptionCounts = dailyCounts.consumption_counts;
            consumptionCounts.push(count);
            await prisma.dailyConsumption.update({
                where: { consumption_id: dailyCounts.consumption_id },
                data: { consumption_counts: consumptionCounts }
            });
        }
    }
}
exports.saveDailyCounts = saveDailyCounts;
async function executeSaveDailyCountsHourly() {
    const interval = 60 * 60 * 1000;
    saveDailyCounts();
    setTimeout(executeSaveDailyCountsHourly, interval);
}
exports.executeSaveDailyCountsHourly = executeSaveDailyCountsHourly;
async function readWeeklyCounts() {
    const currentWeek = (0, dayjs_1.default)().utc().isoWeek();
    const allDailyCounts = await prisma.dailyConsumption.findMany();
    const dailyCountsOfCurrentWeek = [];
    for (let i = 0; i < allDailyCounts.length; i++) {
        if ((0, dayjs_1.default)(allDailyCounts[i].consumption_date).utc().isoWeek() === currentWeek) {
            dailyCountsOfCurrentWeek.push(allDailyCounts[i]);
        }
        return dailyCountsOfCurrentWeek;
    }
}
exports.readWeeklyCounts = readWeeklyCounts;
async function saveWeeklyCounts(array) {
    for (let i = 0; i < array.length; i++) {
        const counter_id = array[i].counter_id;
        const lastItem = array[i].consumption_counts.length - 1;
        const countOfTheDay = array[i].consumption_counts[lastItem] - array[i].consumption_counts[0];
        const weeklyConsumptionTable = await prisma.weeklyConsumption.findFirst({ where: { counter_id: counter_id } });
        if (!weeklyConsumptionTable) {
            await prisma.weeklyConsumption.create({
                data: {
                    counter_id: counter_id,
                    consumption_week_start: (0, dayjs_1.default)().startOf('day').toDate(),
                    consumption_week_counts: [countOfTheDay]
                }
            });
        }
        else {
            const weeklyCounts = weeklyConsumptionTable.consumption_week_counts;
            const consumption_id = weeklyConsumptionTable.consumption_id;
            weeklyCounts.push(countOfTheDay);
            await prisma.weeklyConsumption.update({ where: { consumption_id: consumption_id }, data: { consumption_week_counts: weeklyCounts } });
        }
    }
}
exports.saveWeeklyCounts = saveWeeklyCounts;
async function executeSaveWeeklyCounts() {
    const interval = 24 * 3600 * 1000;
    saveWeeklyCounts(readWeeklyCounts());
    setTimeout(executeSaveWeeklyCounts, interval);
}
exports.executeSaveWeeklyCounts = executeSaveWeeklyCounts;
async function readDailyOverview(UID, counterType, date) {
    const counter = await prisma.counter.findFirst({
        where: {
            user_id: UID,
            type: counterType
        }
    });
    const counter_id = counter === null || counter === void 0 ? void 0 : counter.counter_id;
    const reads = await prisma.dailyConsumption.findFirst({
        where: {
            counter_id: counter_id,
        }
    });
    const counts = reads === null || reads === void 0 ? void 0 : reads.consumption_counts;
    return counts;
}
exports.readDailyOverview = readDailyOverview;
async function saveMonthlyCounts() {
    const allWeeklyCounts = await prisma.weeklyConsumption.findMany();
    for (let i = 0; i < allWeeklyCounts.length; i++) {
        const counter_id = allWeeklyCounts[i].counter_id;
        const sumOfWeeklyCounts = sumArray(allWeeklyCounts[i].consumption_week_counts);
        const monthlyConsumption = await prisma.monthlyConsumption.findFirst({ where: { counter_id: counter_id } });
        if (monthlyConsumption) {
            const consumption_id = monthlyConsumption.consumption_id;
            const monthlyConsumptionArray = monthlyConsumption.consumption_month_counts;
            monthlyConsumptionArray.push(sumOfWeeklyCounts);
            await prisma.monthlyConsumption.update({ where: { consumption_id: consumption_id }, data: { consumption_month_counts: monthlyConsumptionArray } });
        }
        else {
            await prisma.monthlyConsumption.create({ data: { counter_id: counter_id, consumption_month: (0, dayjs_1.default)().endOf('month').toDate(), consumption_month_counts: sumOfWeeklyCounts } });
        }
    }
}
exports.saveMonthlyCounts = saveMonthlyCounts;
function sumArray(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum;
}
exports.sumArray = sumArray;
//# sourceMappingURL=countController.js.map