import dayjs, { utc } from 'dayjs'


export function getStartOfDayAsString(){
    const startOfDay:string = dayjs().utc().startOf('day').toISOString()
    return startOfDay
}