import * as alt from 'alt-client';
import * as native from 'natives';
import * as chat from '../scripts/chat.js';

class lib {
    constructor() {
        this.cursorCount = 0;
    }

    showCursor(value) {
        if (value) {
            this.cursorCount += 1;
            alt.showCursor(true);
            return;
        }
    
        for (let i = 0; i < this.cursorCount; i++) {
            try {
                alt.showCursor(false);
            } catch (e) {}
        }
    
        this.cursorCount = 0;
    }



    helpText(data) {
        native.beginTextCommandDisplayHelp('STRING');
        native.addTextComponentSubstringPlayerName(data);
        native.endTextCommandDisplayHelp(0, false, false, -1);
    }

    //LOADs a MODEL asyncrounous
    loadModelAsync(model) {
        return new Promise(resolve => {
            if(typeof model === 'string') {
                model = native.getHashKey(model);
            }
            
            if(!native.isModelValid(model))
            return resolve(false);

            if(native.hasModelLoaded(model))
            return resolve(true);

            native.requestModel(model);

            let interval = alt.setInterval(() => {
                if(native.hasModelLoaded(model)) {
                    alt.clearInterval(interval);
                    resolve(true);
                }
            }, 0);
        });
    }

    playCutscene(scene) {
        return new Promise(resolve => {
            native.requestCutscene(scene, 8)
            let interval = alt.setInterval(() => {
                if(native.hasThisCutsceneLoaded(scene)) {
                    alt.clearInterval(interval);
                    resolve(true); 
                    native.startCutscene(0);
                    alt.log("CUTSCENE LOADED");

                }
            }, 5);
        })
    }

    degreesToRadians(degrees) {
        var pi = Math.PI;
        return degrees * (pi/180);
    }

    // Get Height of ground
    getGroundZ(x, y, z, tries = 0) {
        
        native.setFocusPosAndVel(x, y, z, 0, 0, 0);
        let [_, height] = native.getGroundZFor3dCoord(x, y, z + 100, undefined, undefined);
        if (!height && tries < 20) return getGroundZ(x, y, z + 100, ++tries);
        native.clearFocus();
        if (!height) return 0;
        return height;
    }


    drawText3d(msg, posX, posY, posZ, scale, fontType, r, g, b, a, rect = false, useOutline = true, useDropShadow = true) {
        const entity = alt.Player.local.vehicle ? alt.Player.local.vehicle.scriptID : alt.Player.local.scriptID;
        const vector = native.getEntityVelocity(entity);
        const frameTime = native.getFrameTime();
        native.setDrawOrigin(posX + (vector.x * frameTime), posY + (vector.y * frameTime), posZ + (vector.z * frameTime), 0);
        native.beginTextCommandDisplayText('STRING');
        native.addTextComponentSubstringPlayerName(msg);
        native.setTextFont(fontType);
        native.setTextScale(1, scale);
        native.setTextWrap(0.0, 1.0);
        native.setTextCentre(true);
        native.setTextColour(r, g, b, a);
        if(useOutline) native.setTextOutline();
        if(useDropShadow) native.setTextDropShadow();
        native.endTextCommandDisplayText(0, 0);
        native.clearDrawOrigin();

        let xfactor = msg.length / 250;
        let yfactor = scale / 12;
        if(rect) {this.drawRectangle(posX, posY, posZ - 0.085, xfactor, yfactor, 0, 0, 0, 50)};
    }

    drawRectangle(posX, posY, posZ, width, height, r, g, b, a) {
        const entity = alt.Player.local.vehicle ? alt.Player.local.vehicle.scriptID : alt.Player.local.scriptID;
        const vector = native.getEntityVelocity(entity);
        const frameTime = native.getFrameTime();
        native.setDrawOrigin(posX + (vector.x * frameTime), posY + (vector.y * frameTime), posZ + (vector.z * frameTime), 0);
        native.drawRect(0, 0, width, height, r, g, b, a);
        native.clearDrawOrigin();
    }

    drawText(msg, x, y, scale, r = 255, g = 255, b = 255, a = 255) {
        native.beginTextCommandDisplayText('STRING');
        native.addTextComponentSubstringPlayerName(msg);
        native.setTextFont(4);
        native.setTextScale(1, scale);
        native.setTextWrap(0.0, 1.0);
        native.setTextCentre(true);
        native.setTextColour(r, g, b, a);
        native.setTextOutline();
        native.setTextDropShadow();
        native.endTextCommandDisplayText(x,y);
    }
    
    closeGame() {
        native.restartGame();
    }

    showRadar(state) {
        native.displayRadar(state);
    }

    fade(state) {
        if(state) {
            native.doScreenFadeOut(100);
        } else {
            native.doScreenFadeIn(100);
        }
    }

    sendlocalmessage(msg, r, g, b, a = 255) {
        chat.setlocalmessage(msg, r, g, b, a);
    }

    displayNotification(text) {
        native.beginTextCommandThefeedPost('STRING');
        native.addTextComponentSubstringPlayerName(text);
        native.endTextCommandThefeedPostTicker(false, true);
    }
    
    displayAdvancedNotification(message, title = "Title", subtitle = "subtitle", notifImage = null, iconType = 0, backgroundColor = null, durationMult = 1) {
        native.beginTextCommandThefeedPost('STRING')
        native.addTextComponentSubstringPlayerName(message)
        if (backgroundColor != null) native.thefeedSetNextPostBackgroundColor(backgroundColor)
        if (notifImage != null) native.endTextCommandThefeedPostMessagetextTu(notifImage, notifImage, false, iconType, title, subtitle, durationMult)
        return native.endTextCommandThefeedPostTicker(false, true)
    }

    displayColoredNotification(text, color) {
        native.setNotificationTextEntry('STRING');
        native.setNotificationBackgroundColor(color);
        native.addTextComponentSubstringPlayerName(text);
        native.drawNotification(false, true);
    }

    
}

const libVariable = new lib();
export default libVariable;

