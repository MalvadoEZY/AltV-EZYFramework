import * as alt from 'alt-client';
import * as native from 'natives';
import CameraHandler from '../lib/camera.js'
import lib from '../lib/lib.js';
import skin from '../lib/skin.js'

let PlayerClass;
//EVENTS

alt.onServer('player:createChar', initChar);
alt.onServer('player:saveAllPlayers', saveAllPlayers);
alt.onServer('player:setStatus', (OBJ) => {PlayerClass.player.status = OBJ})

function initChar(playerOBJ) {
    const playerPed = alt.Player.local.scriptID;
    const playerPosition = native.getEntityCoords(playerPed, true)
    native.setFocusPosAndVel(playerPosition.x,playerPosition.y,playerPosition.z,0,0,0)
    native.setEntityVisible(playerPed, true, false);
    alt.setTimeout(() => {
        native.freezeEntityPosition(playerPed, true); // Freeze Player
        native.requestCollisionAtCoord(playerPosition.x, playerPosition.y, playerPosition.z); // Load collisions of the new position
        
        
        let counter = 0;
    
        const timer = alt.setInterval(() => {
            if (native.hasCollisionLoadedAroundEntity(playerPed) == true) {
                alt.clearInterval(timer);
                native.freezeEntityPosition(playerPed, false); // Unfreeze once collisions have loaded
            
                alt.toggleGameControls(true)
                createChar(playerOBJ)
            } else {
                counter++;
            }
            
            //20sec timeout
            if (counter == 200) {
                alt.clearInterval(timer); // Clear timeout on fail
                alt.emitServer('player:kick', 'O teu cliente não conseguiu carregar o mapa!'); // Tell server it's failed
                native.doScreenFadeIn(300)
            }
        }, 100); 
        
    }, 500);
}
//CREATE THE CHARACTER INITIALLY
function createChar(playerOBJ) {
    PlayerClass = new Player(playerOBJ);
}

class Player {
    constructor(playerObj) {
        this.player = {
            id: playerObj.charID,
            charInfo: playerObj.charInfo,
            clothes: playerObj.clothes,
            appearance: playerObj.appearance,
            status: playerObj.status,
            health: playerObj.health
        }
        
        this.createChar()
    }

    createChar() {
        const playerPed = alt.Player.local.scriptID;
        const playerCoords = native.getEntityCoords(playerPed, true);
        const playerRotation = native.getEntityRotation(playerPed, 2);
        const cameraDecendTime = 4000;
        CameraHandler.destroyAllCams();
        native.doScreenFadeIn(300);

        let cam1 = native.createCamWithParams("DEFAULT_SCRIPTED_CAMERA", playerCoords.x, playerCoords.y, playerCoords.z + 200.0, 270.00, 0.00, 0.00, 80.00, 0, 0)
        let cam2 = native.createCamWithParams("DEFAULT_SCRIPTED_CAMERA", playerCoords.x, playerCoords.y, playerCoords.z, 270.00, 0.00, 0.00, 80.00, 0, 0)
        native.setCamActive(cam1, true);
        
        native.setCamRot(cam2, playerRotation.x, playerRotation.y, playerRotation.z, 2);
        native.renderScriptCams(true, true, 0, true, false);
        native.setCamActiveWithInterp(cam2, cam1, cameraDecendTime, 0, 0); 
        native.freezeEntityPosition(playerPed, true);
        native.setEntityVisible(playerPed, true, true);
        alt.setTimeout(() => {
            native.doScreenFadeOut(300);
        }, cameraDecendTime - 300);
        //native.setEntityHeading(alt.Player.local.scriptID, this.player.position.rot)
        alt.setTimeout(() => {
            native.renderScriptCams(false, false, 0, true, true)
            native.setCamActive(cam1, false);
            native.destroyCam(cam1, true);
            native.setCamActive(cam2, false);
            native.destroyCam(cam2, true);
            native.switchInPlayer(playerPed);
            native.doScreenFadeIn(300);
            native.freezeEntityPosition(playerPed, false);
            native.clearFocus();
            
            alt.emitServer('playerSession:start_hud');
            lib.showRadar(true);
        alt.setMeta('player:loggedIn', true)
        }, cameraDecendTime);
        skin.setPlayerComponents(this.player.appearance, this.player.clothes)
        //UNFREEZE THE ENTITY FOR SPAWN PROTECTION
        const getDataObj = {
            id: this.player.id,
            charInfo: this.player.charInfo, 
            status: this.player.status     
        }
        alt.setMeta('player:getData', getDataObj)

        alt.beginScaleformMovieMethodMinimap('SETUP_HEALTH_ARMOUR');
        native.scaleformMovieMethodAddParamInt(3);
        native.endScaleformMovieMethod();
        //destroy the authentication UI
        
        
        checkStatus(playerPed, this.player);
        //start UI status
        alt.setInterval(() => {
            alt.emitServer('player:savePosition')
        }, 30000);
    }
}


function checkStatus(playerPed, playerOBJ) {
    let getStatusInterval;
    let lastHealth;
    let health
    let firstime;

    updateStat(playerPed, playerOBJ)
    //GET PLAYER HEALTH EACH 500MS
    getStatusInterval = alt.setInterval(() => {
        if(PlayerClass === undefined || PlayerClass === null) {
            alt.clearInterval(getStatusInterval);
            return;
        }
        if(firstime === undefined) {
            health = native.setEntityHealth(playerPed, playerOBJ.health);
            firstime = 1;
        }
        //STATUS 
        health = native.getEntityHealth(playerPed);
        const currentStatus = PlayerClass.player.status

        if(currentStatus.hunger > 100) {
            currentStatus.hunger = 100
        } else if (currentStatus.hunger < 0) {
            currentStatus.hunger = 0
        }

        if(currentStatus.thrist > 100) {
            currentStatus.thrist = 100
        } else if (currentStatus.thrist < 0) {
            currentStatus.thrist = 0
        }

        if(currentStatus.thrist === 0 || currentStatus.hunger === 0) {
           
        }
        const isPedRunning = native.isPedRunning(playerPed)
        if(isPedRunning) {
            currentStatus.thrist = currentStatus.thrist - 0.04;
            currentStatus.hunger = currentStatus.hunger - 0.02;
            alt.emitServer('player:setStatus', currentStatus);
        } else {
            currentStatus.thrist = currentStatus.thrist - 0.006;
            currentStatus.hunger = currentStatus.hunger - 0.006;
            alt.emitServer('player:setStatus', currentStatus);
        }
        // HEALTH GETTING
        
        alt.setMeta('player:getHealth', health)
        alt.setMeta('player:getStatus', currentStatus)
        if(lastHealth === health) {
            return;
        } else {
            lastHealth = health
        }

    }, 5000);

}

function updateStat(ped, playerObj) {
    let stamina;
    let lung_capacity;
    stamina = alt.setStat('stamina', 100);
    lung_capacity = alt.setStat('lung_capacity', 100);

    alt.setStat('stamina', 100);
    alt.setStat('strength', 100);
    alt.setStat('wheelie_ability', 100);
    alt.setStat('flying_ability', 100);
    alt.setStat('shooting_ability', 100);
    alt.setStat('stealth_ability', 100);

    alt.setInterval(() => {
        if(native.isPedRunning(ped) || native.isPedSprinting(ped)) {
            stamina = stamina - 3
        } else {
            stamina = stamina + 3
        }
        if(stamina > 100) {
            stamina = 100
        }
        if(stamina < 0) {
            stamina = 0
        }

        alt.setStat('stamina', stamina);
        alt.setStat('lung_capacity', stamina);
    }, 200); 
}

function saveAllPlayers() {
    if(PlayerClass === undefined || PlayerClass === null) {
        return;
    } else {
        alt.emitServer('player:saveAllPlayer', CPlayer)
    }
}

export default Player