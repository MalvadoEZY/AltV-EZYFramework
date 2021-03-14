import * as alt from 'alt-client';
import * as native from 'natives';
let oldWeather = 'SUNNY';
let currentWeather;

// Events
alt.onServer('weather:syncWeather', updateWeatherValues);
alt.onServer('weather:syncTime', setTime);

// Functions
function setWeather(weather, time) {

    currentWeather = weather;
    if(time === 0) {
        native.setWeatherTypeNowPersist(weather);
    } else {
        if(oldWeather != currentWeather) {
            let i = 0;
            let inter = alt.setInterval(() => {
                i++;
                if(i < 100) {
                    native.setWeatherTypeTransition(native.getHashKey(oldWeather), native.getHashKey(currentWeather), (i / 100));
                } else {
                    alt.clearInterval(inter)
                    oldWeather = currentWeather;
                }
            }, (time * 10))
        }
        if(weather === 'XMAS') {
            native.setForceVehicleTrails(true);
            native.setForcePedFootstepsTracks(true);
        } else {
            native.setForceVehicleTrails(false);
            native.setForcePedFootstepsTracks(false);
        }
    }
}

function setTime(time, msperminute) {

    native.setClockTime(time.hour, time.minute, time.second)
    if(msperminute != alt.getMsPerGameMinute()) {
        alt.setMsPerGameMinute(msperminute);
    }
}


function updateWeatherValues() {
    alt.setInterval(() => {
        const windSpeed = alt.getSyncedMeta('weather:windspeed')
        const weathertype = alt.getSyncedMeta('weather:type')
        native.setWindSpeed(windSpeed)
        setWeather(weathertype, 1000)
    }, 10000);
}