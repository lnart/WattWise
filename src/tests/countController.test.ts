import {afterEach, beforeEach,expect, vi, test} from 'vitest'
import { saveLiveCount } from '../controller/countController'
import { findCounter } from '../helpers/dbHelpers';
import { getStartOfDayAsString } from '../helpers/dateTimeHelpers';
import { PrismaClient } from '@prisma/client';
import { error } from 'console';

const prisma = new PrismaClient()

afterEach(async() => {
  vi.resetAllMocks()
})
test("should create new counter if doesnt find one", async () => {
  await prisma.counter.delete({where: {user_id_type: {user_id: 999, type: 'gas'}}}) 
  const expected = "new counter created";
  vi.mock("../helpers/dbHelpers.ts", async () => {
    return {
      findCounter: async () => {
        return null
  }
} 
}) 
  const startOfDay = '2023-05-07T22:00:00.000Z'
  const result = await saveLiveCount('999', 'gas', startOfDay, '1')
  expect(result).toEqual(expected)
});


test('should throw error if data is invalid', async() => {
  const result = await saveLiveCount('999999', 'akgfkjd', '67559', '1')
  const expected = 'didnt save live count'
  expect(result).toEqual(expected)
})

 

