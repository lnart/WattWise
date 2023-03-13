import { expect, test, vi } from "vitest";
import * as weather from '../controller/weatherApiController'
import { format } from "path";

test('formats weather data', async ()=>{
    let weatherData = {
        queryCost: 2,
        latitude: 51.1408,
        longitude: 7.21705,
        resolvedAddress: 'Wermelskirchen, Nordrhein-Westfalen, Deutschland',
        address: 'Wermelskirchen',
        timezone: 'Europe/Berlin',
        tzoffset: 1,
        days: [
            {
                datetime: '2023-03-12',
                datetimeEpoch: 1678575600,
                tempmax: 12,
                tempmin: 0.9,
                temp: 5.8,
                feelslikemax: 12,
                feelslikemin: -3.5,
                feelslike: 3.4,
                dew: 2,
                humidity: 77.1,
                precip: 3.4,
                precipprob: 100,
                precipcover: 29.17,
                preciptype: [Array],
                snow: 0.1,
                snowdepth: 0.1,
                windgust: 33.8,
                windspeed: 25.5,
                winddir: 178.1,
                pressure: 1009.8,
                cloudcover: 87.3,
                visibility: 9.4,
                solarradiation: 42.1,
                solarenergy: 3.6,
                uvindex: 2,
                severerisk: 10,
                sunrise: '06:52:36',
                sunriseEpoch: 1678600356,
                sunset: '18:30:16',
                sunsetEpoch: 1678642216,
                moonphase: 0.67,
                conditions: 'Snow, Rain, Partially cloudy',
                description: 'Partly cloudy throughout the day with rain or snow.',
                icon: 'snow',
                stations: [Array],
                source: 'obs'  
            }
        ],
        stations: {
            D6206: {
              distance: 35729,
              latitude: 51.454,
              longitude: 7.107,
              useCount: 0,
              id: 'D6206',
              name: 'DW6206 Essen DE',
              quality: 0,
              contribution: 0
            },
            D2248: {
              distance: 33549,
              latitude: 50.999,
              longitude: 6.794,
              useCount: 0,
              id: 'D2248',
              name: 'DW2248 Pulheim DE',
              quality: 0,
              contribution: 0
            },
            EDDK: {
              distance: 30325,
              latitude: 50.87,
              longitude: 7.17,
              useCount: 0,
              id: 'EDDK',
              name: 'EDDK',
              quality: 50,
              contribution: 0
            },
            E0822: {
              distance: 22018,
              latitude: 50.955,
              longitude: 7.111,
              useCount: 0,
              id: 'E0822',
              name: 'EW0822 Cologne DE',
              quality: 0,
              contribution: 0
            },
            EDDL: {
              distance: 34192,
              latitude: 51.28,
              longitude: 6.78,
              useCount: 0,
              id: 'EDDL',
              name: 'EDDL',
              quality: 50,
              contribution: 0
            }
          },
          currentConditions: {
            datetime: '10:46:01',
            datetimeEpoch: 1678700761,
            temp: 14.2,
            feelslike: 14.2,
            humidity: 75.4,
            dew: 9.9,
            precip: 0,
            precipprob: 0,
            snow: 0,
            snowdepth: 0,
            preciptype: null,
            windgust: null,
            windspeed: 25.8,
            winddir: 216,
            pressure: 1000.1,
            visibility: 10,
            cloudcover: 94.7,
            solarradiation: 24,
            solarenergy: 0.1,
            uvindex: 0,
            conditions: 'Overcast',
            icon: 'cloudy',
            stations: [ 'EDDK', 'EDDL', 'E0822' ],
            source: 'obs',
            sunrise: '06:50:23',
            sunriseEpoch: 1678686623,
            sunset: '18:31:57',
            sunsetEpoch: 1678728717,
            moonphase: 0.71
          }
        }
    let expected = [
        { datetime: '2023-03-12', tempmax: 12, tempmin: 0.9 },
        { datetime: '2023-03-13', tempmax: 15.4, tempmin: 8.8 }
      ]

        const spy = vi.spyOn(weather, 'getWeatherData').mockImplementation(async() => weatherData)
        const result = await weather.formatWeatherData('2023-03-12', '2023-3-13')
        expect(result).toEqual(expected)
        

}
)
