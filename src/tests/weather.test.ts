import { expect, it, test, vi } from "vitest";
import * as weather from '../controller/weatherApiController'
import { format } from "path";

test('formats weather data', async ()=>{
        const result = await weather.formatWeatherData('2023-03-12', '2023-3-13')
        expect(result).toBeDefined()
        expect(result).toHaveLength(2)
        expect(result[0]['datetime']).toBeTypeOf("string")
        expect(result[0]['tempmax']).toBeTypeOf("number")
        expect(result[0]['tempmin']).toBeTypeOf("number")
        expect(result[1]['datetime']).toBeTypeOf("string")
        expect(result[1]['tempmax']).toBeTypeOf("number")
        expect(result[1]['tempmin']).toBeTypeOf("number")
}
)

test('fetch weather data correctly', async() => {
  const result = await weather.getWeatherData('2023-03-12', '2023-3-13')
  expect(result).toBeDefined()
  expect(result).toBeTypeOf('object')
  expect(result).toHaveProperty('days')
  expect(result['days']).toHaveLength(2)

  
})
