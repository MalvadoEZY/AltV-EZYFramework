
import * as alt from 'alt-server';
import fs from 'fs'
import jsonFile from '../../config/json/weather.json'

let rawJSONconfig = jsonFile;

//WEATHER
const Weather = [
    {type: "CLEAR", temp_average: 24, average_wind: 2.0, probability: 80}, //0
    {type: "EXTRASUNNY", temp_average: 28, average_wind: 1.0, probability: 90}, //1
    {type: "CLOUDS", temp_average: 21, average_wind: 12.0, probability: 70}, //2
    {type: "OVERCAST", temp_average: 20, average_wind: 6.0, probability: 60}, //3
    {type: "RAIN", temp_average: 18, average_wind: 12.0, probability: 50}, //4
    {type: "CLEARING", temp_average: 21, average_wind: 2.0, probability: 60}, //5
    {type: "THUNDER", temp_average: 17, average_wind: 12.0, probability: 40}, //6
    {type: "SMOG", temp_average: 20, average_wind: 2.0, probability: 10 }, //7
    {type: "SNOWLIGHT", temp_average: 1, average_wind: 2.0, probability: 1}, //8
]

let weatherDetails = {
    weather: rawJSONconfig.cache.lastWeather,
    temperature: rawJSONconfig.cache.lastTemperature,
    windSpeed: rawJSONconfig.cache.lastWind,
    windDirection: rawJSONconfig.cache.lastWindDirection
}


let time = {
    hour: 0,
    minute: 0,
    second: 0
}

const msperminute = 1000

export function initPlayer(player) {
    let lastWeather = weatherDetails.weather
    alt.emitClient(player, 'weather:syncWeather', Weather[lastWeather].type)
    alt.emitClient(player, 'weather:syncTime', time, msperminute)
    

}

export function initializeWXClockEngine() {

    weatherEngine();
    clockEngine();

}

function weatherEngine() {
    alt.log("\u001b[32m Weather engine loaded ! \u001b[0m")
    let minusWeatherMultiplier = 0.8;
    let maxWeatherMultiplier = 0.8;
    
    
    setInterval(() => {

        let lastWeather = weatherDetails.weather
        let getWeatherData = Weather[lastWeather]
        let currentTemperature = getWeatherData.temp_average;
        let windAverageSpeed = getWeatherData.average_wind

        if(currentTemperature >= 28 && currentTemperature <= 34) {
            minusWeatherMultiplier = 0.4
            maxWeatherMultiplier = 0.1
        } else if (currentTemperature < 16) {
            minusWeatherMultiplier = 0.1
            maxWeatherMultiplier = 0.5
        } else {
            if(time.hour < 7 && time.hour > 18) {
                minusWeatherMultiplier = 0.08
                maxWeatherMultiplier = 0.03
            } else {
                minusWeatherMultiplier = 0.03
                maxWeatherMultiplier = 0.08
            }
        }
        
        let newWindSpeed = Number(getRandomInt(Math.floor(0), Math.floor(windAverageSpeed)))
        let newTemperature = Number(getRandomInt(Math.floor(currentTemperature) - minusWeatherMultiplier, Math.floor(currentTemperature) + maxWeatherMultiplier))
        let newWeather = Number(getRandomInt(Math.floor(0), Math.floor(2)))
        
        alt.setSyncedMeta('weather:windspeed', newWindSpeed)
        alt.setSyncedMeta('weather:temperature', newTemperature)
        alt.setSyncedMeta('weather:type', Weather[Math.ceil(newWeather)].type)
        fs.writeFileSync('./resources/core/server/config/weather.mjs', JSON.stringify(weatherDetails))
        currentTemperature = newTemperature;
    }, msperminute * 60 * 5);    
}

function probability(n){
    return Math.random() < n;
  }

function clockEngine() {
    time = {
        day: 0,
        hour: 0,
        minute: 0,
        second: 0
    }
    setInterval(() => {
        time.minute = time.minute + 1
        if(time.minute === 60) {
            time.minute = 0
            time.hour = time.hour + 1
        }
        if(time.hour === 24) {
            time.hour = 0
            time.day = time.day + 1
        }
    }, msperminute);
}

function getRandomInt(min, max) {
    return ((Math.random() * (max - min + 1)) + min).toFixed(2);
}

