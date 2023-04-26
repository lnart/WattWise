import get from 'https'



export async function getWeatherData(start: String, end: String) {
    try{
        let response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Wermelskirchen/${start}/${end}?unitGroup=metric&include=days%2Ccurrent&key=NP2FELSQW3GM3CKAP3EQQPJHZ&contentType=json`);
        if(!response.ok){
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        let data = await response.json()
        console.log(data);
        
        return data
    }catch(error){
        console.error(error)
        return null
    }
}

export async function formatWeatherData(start: String, end: String){
    let data = await getWeatherData(start, end)
    let formattedTemps = []
    for(let i = 0; i < data.days.length; i++){
        formattedTemps.push({datetime: data.days[i]['datetime'], tempmax: data.days[i]['tempmax'], tempmin: data.days[i]['tempmin']})
    }
    console.log(formattedTemps);
    
    return formattedTemps 
}

module.exports = {
    formatWeatherData, 
    getWeatherData
}

