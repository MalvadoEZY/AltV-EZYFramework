import alt from 'alt-client';
import native from 'natives';

const url = 'http://resource/client/browser/base/index.html';
let webview;
let pageisLoaded = false;
export function interfaceStart() {
    if(!webview) {
        webview = new alt.WebView(url);
    }

    webview.on('base:ready', pageLoaded)
}

function pageLoaded() {
    webview.emit('base:start')
    pageisLoaded = true;
}

alt.on('webview:destroyAll', () => {
    if(webview) {
        webview.destroy();
    }
});

alt.on('globalMetaChange', (key, value, oldvalue) => {
    if(pageisLoaded) {
        if(key === 'driving') {
            if(value) {
                showSpeedoMeter();
                webview.emit('base:toggleSpeedMeter', true);
            } else {
                webview.emit('base:toggleSpeedMeter', false);
            }
        }
    }
});

export function sendNotification(data) {
    if(webview) {
        const obj = {
            name: null,
            volume: 0.35
        };
        
        if(data.type === 0) {obj.name = 'success'};
        if(data.type === 1) {obj.name = 'error'};
        if(data.type === 2) {obj.name = 'warning'};
        if(data.type === 3) {obj.name = 'info'};
        
       
        webview.emit('base:notification', data);
    }
};

function showSpeedoMeter() {
    alt.everyTick(() => {
        
        const playerVehicle = native.getVehiclePedIsIn(alt.Player.local.scriptID, false)
        const vehicleSpeed = native.getEntitySpeed(playerVehicle)

        const vehicleData  = {
            speed: vehicleSpeed,
            distanceTraveled: 200,
            fuel: 50
        }

        if(webview) {
            webview.emit('base:speedometerData', vehicleData);
        }
    });
}

export function playSound(data) {
    if(webview) {
        webview.emit('base:playaudio', obj.name,  obj.volume);
    }
}


