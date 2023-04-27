import { Prisma, PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import * as date from '../helpers/dateTimeHelpers'

const prisma = new PrismaClient

async function createFakeData() {
    const user = await prisma.user.create({
        data: {
            email: 'max@mustermann',
            password: 'p',
            username: 'max',
            zipcode: 10963
        }
    })

    const counter = await prisma.counter.create({
        data: {
            type: 'gas',
            user_id: user.user_id,
            timestamp: date.getStartOfDayAsString(),
            count: 1333
        }
    })

    await prisma.dailyConsumption.create({
        data: {
            counter_id: counter.counter_id,
            consumption_date: date.getStartOfDayAsString(),
            consumption_counts: [133, 244, 77, 99, 201]
        }
    })

    await prisma.weeklyConsumption.create({
        data: {
            counter_id: counter.counter_id,
            consumption_week_start: dayjs().startOf('week').toDate(),
            consumption_week_counts: [732, 550, 333, 450]
        }
    })

    await prisma.monthlyConsumption.create({
        data: {
            consumption_month: dayjs().startOf('month').toDate(),
            counter_id: counter.counter_id,
            consumption_month_counts: [333, 255, 322, 321, 234, 263, 391, 250, 301, 360, 399, 201, 277, 299, 355, 303, 333, 255, 322, 321, 234, 263, 391, 250, 301, 360, 399, 201, 277, 299, 355, 303]
        }
    })

    await prisma.yearlyConsumption.create({
        data: {
            consumption_year: +dayjs().startOf('year'),
            counter_id: counter.counter_id,
            consumption_year_counts: [3444, 2754, 2287, 1766]
        }
    })
}