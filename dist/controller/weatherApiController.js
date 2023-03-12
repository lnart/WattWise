"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function getWeatherData(start, end) {
    try {
        let response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Wermelskirchen/${start}/${end}?unitGroup=metric&include=days%2Ccurrent&key=NP2FELSQW3GM3CKAP3EQQPJHZ&contentType=json`);
        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        let data = await response.json();
        return data;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}
async function formatWeatherData(start, end) {
    let data = await getWeatherData(start, end);
    let formattedTemps = [];
    for (let i = 0; i < data.days.length; i++) {
        formattedTemps.push({ datetime: data.days[i]['datetime'], tempmax: data.days[i]['tempmax'], tempmin: data.days[i]['tempmin'] });
    }
    return formattedTemps;
}
formatWeatherData('2023-02-11', '2023-03-11');
//# sourceMappingURL=weatherApiController.js.map