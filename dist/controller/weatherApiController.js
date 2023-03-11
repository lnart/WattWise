"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function getWeatherData() {
    try {
        let response = await fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Wermelskirchen/2023-02-11/2023-03-11?unitGroup=metric&include=days%2Ccurrent&key=NP2FELSQW3GM3CKAP3EQQPJHZ&contentType=json');
        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        let data = await response.json();
        console.log(data);
        return data;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}
getWeatherData();
//# sourceMappingURL=weatherApiController.js.map