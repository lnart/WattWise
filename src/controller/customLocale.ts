// customLocale.ts

import dayjs, { Dayjs } from 'dayjs';
import WeekOfYear from 'dayjs/plugin/weekOfYear'
import Isoweek from 'dayjs/plugin/isoWeek'
const customLocale = {
  name: 'customLocale',
  weekStart: 1,
};
//@ts-ignore
dayjs.locale(customLocale); 

export function getNextDay(date:Date){
  const nextDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()+1)
  if (nextDay.getMonth() !== date.getMonth()) {
    nextDay.setDate(1);
    nextDay.setMonth(date.getMonth() + 1);
  }
  return nextDay
}

export function getStartOfWeek(){
  return getNextDay(dayjs().startOf('week').utc().toDate()).toISOString()
}

//@ts-ignore
export default dayjs;


