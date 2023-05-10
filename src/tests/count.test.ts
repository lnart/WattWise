import {afterEach, beforeEach,expect, vi, test} from 'vitest'
import { saveLiveCount } from '../controller/countController'
import { findCounter } from '../helpers/dbHelpers';


test("should upate counter if it finds one", async() => {
    vi.mock('../helpers/dbHelpers.ts', async () => {
      return {
        findCounter:async () => {
          return {
            counter_id: 999,
            user_id: 999,
            type: 'water',
            count: 1,
            timestamp: '2023-05-07 22:00:00'
          }
        }
      }
    })
    const startOfDay = '2023-05-07T22:00:00.000Z'
    const result = await saveLiveCount('999', 'water', startOfDay, '1')
    expect(result).toEqual('counter 999 was updated')
  }) 