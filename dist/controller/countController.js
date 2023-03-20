"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveLiveCount = void 0;
const client_1 = require("@prisma/client");
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
//# sourceMappingURL=countController.js.map