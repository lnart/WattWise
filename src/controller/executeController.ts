import * as count from '../controller/countController'
import * as read from '../controller/readController'
import dayjs from 'dayjs'

// export async function executeSaveDailyCountsHourly(){
//     const interval = 1 * (3.6 * 10**6)
//     count.saveDailyCounts()
//     setTimeout(executeSaveDailyCountsHourly, interval)
// }

export function executeEveryNewHour(){
    const now = dayjs().utc()
    const millisUntilNextHour = dayjs(now).endOf('hour').diff(now)

    setTimeout(count.saveDailyCounts, millisUntilNextHour)
}

export async function executeSaveWeeklyCountsDaily(){
    const now  = dayjs().utc()    
    if(now.isSame(now.endOf('day'))){
        const dongs = await read.readWeeklyCounts()
        count.saveWeeklyCounts()
    }
}

export function executeSaveMonthlyCountsDaily(){
    const now  = dayjs().utc()    
    if(now.isSame(now.endOf('day'))){
        count.saveMonthlyCounts()
    }
}