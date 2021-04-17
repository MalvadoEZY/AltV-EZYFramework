import * as alt from "alt-server";
import * as mysql from '../../services/mysql/mysql.mjs';
import logger from '../../services/log/log.mjs';
import config from '../../config/config.mjs';
import lib from '../../lib/functions.mjs';
import {partID, wheelIndex, windowIndex} from './part.mjs';
import {hasPermission, userRank} from '../systems/admin.mjs';

//FUNCTIONS

export function deleteVehicle(player) {
    const closestVehicle = getClosestVehicle(player);
    if(closestVehicle.distance < 10) {
        if(!closestVehicle.vehicle.ownerid) {
            closestVehicle.vehicle.destroy();
            player.notification(0, 'Eliminas-te o carro com sucesso')
        } else {
            player.notification(1, 'Não consegues eliminar um carro persistente')
        }
    } else {
        player.notification(1, 'Está muito longe do veiculo')
    }
}

export function bring(player, plate) {
    for(let targetvehicle of alt.Vehicle.all) { 
        const TargetPlate = targetvehicle.numberPlateText;
        if(TargetPlate === plate) {
            const newPos = {
                x: player.pos.x + 2,
                y: player.pos.y,
                z: player.pos.z + 1
            }
            targetvehicle.pos = newPos;
            player.notification(0, 'Teleportas-te o veiculo para a tua posição')
            //lOGS
            return;
        }
    }
    player.notification(1, 'Veiculo não encontrado')
}

//Go to car position
export function goto(player, plate) {
    for(let targetvehicle of alt.Vehicle.all) { 
        const TargetPlate = targetvehicle.numberPlateText;
        if(TargetPlate === plate) {
            const newPos = {
                x: targetvehicle.pos.x + 2,
                y: targetvehicle.pos.y,
                z: targetvehicle.pos.z + 1
            }
            player.pos = newPos;
            player.notification(0, 'Teleportas-te para a posiçao do veiculo')
            return;
        }
    }
    player.notification(1, 'Veiculo não encontrado')
}

export function playerEnteredVehicle(player, vehicle, seat) {
    const charInfo = player.getMeta('player:charinfo');

    if(seat === 1) {       
        const dataObject = {
            identifier: vehicle,
            ownerid: vehicle.ownerid,
            pos: vehicle.pos,
            plate: vehicle.plate,
            vehiclekm: vehicle.kilometers,
            vehicleKey: vehicle.key_code,
            vehicleFType: vehicle.fuelType,

            fuel: vehicle.fuel,
            fuelConsumption: vehicle.fuelConsumption,

            brakeOil: vehicle.brakeOil,
            engineOil: vehicle.engineOil,
            engineWater: vehicle.engineWater,
            engineBroke: vehicle.engineBroke
        }

        if(vehicle.ownerid === player.ownerid) {
            player.log("Jogador " + charInfo.firstName + " " + charInfo.lastName + "(" + player.charid + ") entrou do seu veiculo em x:" + vehicle.pos.x + " y:" + vehicle.pos.y + " z:" + vehicle.pos.z);
        } else {
            player.log("Jogador " + charInfo.firstName + " " + charInfo.lastName + "(" + player.charid + ") entrou num veiculo de " + vehicle.ownerid + " em x:" + vehicle.pos.x + " y:" + vehicle.pos.y + " z:" + vehicle.pos.z);
        }
        alt.emitClient(player, 'vehicle:carData', dataObject);
    }

}

export function onPlayerLeftVehicle(player, vehicle, seat) {
    if(vehicle.IntervalSavable) {
        const charInfo = player.getMeta('player:charinfo');

        saveVehicle(vehicle);
        
        if(vehicle.ownerid === player.ownerid) {
            player.log("Jogador " + charInfo.firstName + " " + charInfo.lastName + "(" + player.charid + ") saiu do seu veiculo em x:" + vehicle.pos.x + " y:" + vehicle.pos.y + " z:" + vehicle.pos.z);
        } else {
            player.log("Jogador " + charInfo.firstName + " " + charInfo.lastName + "(" + player.charid + ") saiu num veiculo de " + vehicle.ownerid + " em x:" + vehicle.pos.x + " y:" + vehicle.pos.y + " z:" + vehicle.pos.z);
        }
        player.notification(0, "Veiculo guardado")
    }
}

export function updateKilometer(player, vehicle, kilometers) {
    vehicle.kilometers = kilometers
}

export function flipClosestVehicle(player) {
    const closestVehicle = getClosestVehicle(player);
    if(closestVehicle.distance < 10) {
        closestVehicle.vehicle.rot = new alt.Vector3(0, closestVehicle.vehicle.rot.y, closestVehicle.vehicle.rot.z)
        player.notification(0, 'O seu veiculo foi rodado com sucesso !')
    } else {
        player.notification(1, 'Está muito longe do veiculo')
    }
}
/**
 * Get the closest vehicle to a player.
 * @param  {} player
 * @returns {vehicle}
 */
function getClosestVehicle(player) {
    let data = { vehicle: null, distance: 0 };
    for(let targetvehicle of alt.Vehicle.all) {
        let dis = lib.distance(player.pos, targetvehicle.pos);
        let vehicleObject = targetvehicle.object;

        if (dis < data.distance || data.distance == 0) {
            data = { 
                vehicle: vehicleObject, 
                distance: dis 
            };
        }
    };

    return data;
}
export function repairVehicle(player) {
    if(player.getSyncedMeta('player:loggedIn')) { 
        const charInfo = player.getMeta('player:charinfo');
        if(hasPermission(player, userRank.ADMINISTRATOR)) {
            const closestVehicle = lib.getClosestVehicle(player)
            defaultState(closestVehicle);
            alt.emitClient(player, 'vehicle:repair', closestVehicle); 
            player.notification(0, 'Veiculo reparado')
   
        } else {
            player.log('Jogador ' + charInfo.firstName + " " + charInfo.lastName + "(" + player.charid + ")' tentou user o comando 'reparar' para o veiculo | modelo: " + closestVehicle.model + " do jogador " +  closestVehicle.ownerid)
        }
    }
}

export function updateStats(player, vehicle, object) {
    if(player.getSyncedMeta('player:loggedIn')) {
        vehicle.engineHealth = object.engineHealth;
        vehicle.bodyHealth =  object.bodyHealth;
        vehicle.petrolTankHealth = object.tankHealth;
        vehicle.fuel = object.fuel;
    
        vehicle.brakeOil = object.brakeOil;
        vehicle.engineOil = object.engineOil;
        vehicle.engineWater = object.engineWater;
        vehicle.engineBroke = object.engineBroke;
        if(player.charID === vehicle.ownerid) {
            player.log('Jogador guardou o seu veiculo| MATRICULA: ' + vehicle.plate + ' com ' + vehicle.kilometers + ' x:' + player.pos.x + ', y:' + player.pos.y + ', z:' + player.pos.z)
        } else {
            player.log('Jogador guardou um veiculo de ' + vehicle.ownerid + ' | MATRICULA: ' + vehicle.plate + ' com ' + vehicle.kilometers + ' x:' + player.pos.x + ', y:' + player.pos.y + ', z:' + player.pos.z)
        }
    }
}

export async function spawnVehicle(player, vehicleName, vehiclePedIn) {
    
    //If vehicle has already a owner will not destroy 
    if(vehiclePedIn !== undefined && vehiclePedIn.ownerid === undefined) {
        vehiclePedIn.destroy();
    }

    const vehicle = new alt.Vehicle(vehicleName, player.pos.x + 1, player.pos.y + 1, player.pos.z + 1, 0, 0, 0);
    
    const carPosition = {
        x: vehicle.pos.x,
        y: vehicle.pos.y,
        z: vehicle.pos.z,

        rotx: vehicle.rot.x,
        roty: vehicle.rot.y,
        rotz: vehicle.rot.z
    };

    const def_carInfo = {
        id: player.charid,
        ownerID: player.charid,
        plate: "SPWCAR",
        key_code: null,
        kilometers: 0,
        fuelType: 0,
        fuelConsumption: 10,
        fuel: 50,
        brakeOil: 10,
        engineOil: 20,
        engineWater: 20,
        engineBroke: 20,
        
    };

    vehicle.loadVehicle(JSON.stringify(def_carInfo), vehicle, false);
    
    await mysql.query("INSERT INTO vehicles (ownerID, model, location, status, info) VALUES ('" + player.ownerid + "', '" + vehicleName + "', '" + JSON.stringify(carPosition) + "', '" + JSON.stringify(getVehicleCondition(vehicle)) + "', '" + JSON.stringify(def_carInfo) + "')").then(([result, fields]) => {
        player.notify('Veiculo: <b>"' + vehicleName + '"</b> spawn com sucesso !', 20, 255, 20);
    }).catch((err) => {
        vehicle.destroy();
        logger.database(err);
        player.notify('Veiculo: <b>"' + vehicleName + '"</b> não foi spawn devido : ' + err + ' !', 255, 20, 20);
    })
}

//INITIALIZE ALL SERVER VEHICLES
export async function initializeServerVehicles() {
    await mysql.query('SELECT * FROM vehicles').then(([result, fields]) => {
        var t = new Date().getTime(); 
        let i;
        for (i = 0; i < result.length; i++) {
            
            const position = JSON.parse(result[i].location)
            const status = JSON.parse(result[i].status)
            let vehicle = new alt.Vehicle(result[i].model, position.x, position.y, position.z, position.rotx, position.roty, position.rotz);
      
            //Loads vehicle extends info
            vehicle.loadVehicle(result[i].info, vehicle)
            //Loads vehicle condition based on database
            setVehicleCondition(vehicle, status)
            //Set a interval for each car
            alt.setTimeout(() => {}, 100);
        }
        saveAllVehicles(true);

        var s = new Date().getTime();
        var time = s - t;
        var convTime = time;

        alt.log("\u001b[32m" + i + ' carros inicializados em ' + convTime + 'ms\u001b[0m')
        
        logger.server(i + ' carros inicializados em ' + convTime + 'ms');
    })
}

export async function saveVehicle(vehicle) {

    const carInfo = {
        plate: vehicle.plate,
        key_code: vehicle.key_code,
        kilometers: vehicle.kilometers,
        fuelType: vehicle.fuelType,
        fuel: vehicle.fuel,
        fuelConsumption: vehicle.fuelConsumption,

        brakeOil: vehicle.brakeOil,
        engineOil: vehicle.engineOil,
        engineWater: vehicle.engineWater,
        engineBroke: vehicle.engineBroke
        
    };

    const carPosition = {
        x: vehicle.pos.x,
        y: vehicle.pos.y,
        z: vehicle.pos.z,

        rotx: vehicle.rot.x,
        roty: vehicle.rot.y,
        rotz: vehicle.rot.z
    };

    await mysql.query("UPDATE vehicles SET location = '" + JSON.stringify(carPosition) + "', status = '" + JSON.stringify(getVehicleCondition(vehicle)) + "', info = '" + JSON.stringify(carInfo) + "' WHERE id = '" + vehicle.identifier + "'").then(([result, fields]) => {
        alt.log("Veiculo: " + targetVehicle.model + " guardado !")
    }).catch((err) => {
        return err;
    })
}

export async function saveAllVehicles(loop = false) {
    if(loop) {
    
        alt.setInterval(async () => {
            let targetVehicle
            for(targetVehicle of alt.Vehicle.all) {
                if(targetVehicle.IntervalSavable) {
                    saveVehicle(targetVehicle)
                }
            }
        }, 1000 * config.vehicle.save_interval);
        
    }
}

//VEHICLE STATE FUNCTIONS
export function defaultState(vehicle) {
    //Damage
    vehicle.setBumperDamageLevel(1, 0)
    vehicle.setBumperDamageLevel(2, 0)

    //DOORS
    
    vehicle.setDoorState(0, 1)
    vehicle.setDoorState(1, 1)
    vehicle.setDoorState(2, 1)
    vehicle.setDoorState(3, 1)

    //PART Bullets
    
    vehicle.setPartBulletHoles(0, 0)
    vehicle.setPartBulletHoles(1, 0)
    vehicle.setPartBulletHoles(2, 0)
    vehicle.setPartBulletHoles(3, 0)
    vehicle.setPartBulletHoles(4, 0)
    vehicle.setPartBulletHoles(5, 0)

    //PART DAMAGE LEVEL
    vehicle.setPartDamageLevel(0, 0)
    vehicle.setPartDamageLevel(1, 0)
    vehicle.setPartDamageLevel(2, 0)
    vehicle.setPartDamageLevel(3, 0)
    vehicle.setPartDamageLevel(4, 0)
    vehicle.setPartDamageLevel(5, 0)

    //WHEEL
    vehicle.setWheelHealth(0, 0)
    vehicle.setWheelHealth(1, 0)
    vehicle.setWheelHealth(2, 0)
    vehicle.setWheelHealth(3, 0)
    vehicle.setWheelHealth(4, 0)
    vehicle.setWheelHealth(5, 0)
    vehicle.setWheelHealth(45, 0)
    vehicle.setWheelHealth(46, 0)


    //WHEEL Burst
    vehicle.setWheelBurst(0, false);
    vehicle.setWheelBurst(1, false);
    vehicle.setWheelBurst(2, false);
    vehicle.setWheelBurst(3, false);
    vehicle.setWheelBurst(4, false);
    vehicle.setWheelBurst(5, false);
    vehicle.setWheelBurst(45, false);
    vehicle.setWheelBurst(46, false);

    vehicle.setWheelDetached(0, false);
    vehicle.setWheelDetached(0, false);
    vehicle.setWheelDetached(0, false);
    vehicle.setWheelDetached(0, false);
    vehicle.setWheelDetached(0, false);
    vehicle.setWheelDetached(0, false);
    vehicle.setWheelDetached(0, false);
    vehicle.setWheelDetached(0, false);
    

    //WINDOM DAMAGE
    vehicle.setWindowDamaged(0, false);
    vehicle.setWindowDamaged(1, false);
    vehicle.setWindowDamaged(2, false);
    vehicle.setWindowDamaged(3, false);

    vehicle.setWindowOpened(0, false);
    vehicle.setWindowOpened(1, false);
    vehicle.setWindowOpened(2, false);
    vehicle.setWindowOpened(3, false);
    
    //windows
    vehicle.setArmoredWindowHealth(0, 0);
    vehicle.setArmoredWindowHealth(1, 0);
    vehicle.setArmoredWindowHealth(2, 0);
    vehicle.setArmoredWindowHealth(3, 0);

    vehicle.setArmoredWindowShootCount(0, 0);
    vehicle.setArmoredWindowShootCount(1, 0);
    vehicle.setArmoredWindowShootCount(2, 0);
    vehicle.setArmoredWindowShootCount(3, 0);

    vehicle.setLightDamaged(0, 0);
    vehicle.setLightDamaged(1, 0);
    vehicle.setLightDamaged(2, 0);
    vehicle.setLightDamaged(3, 0);
    vehicle.setLightDamaged(4, 0);
    vehicle.setLightDamaged(5, 0);
    vehicle.setLightDamaged(6, 0);

    vehicle.dirtLevel = 0,
    vehicle.engineOn = false,
    vehicle.bodyAdditionalHealth = 1000.0,
    vehicle.engineHealth = 1000.0,
    vehicle.petrolTankHealth = 1000.0,
    vehicle.bodyHealth = 1000.0
}
export function setVehicleCondition(vehicle, status) {
    //vehicle.setGamestateDataBase64(status.deformation64)
    //vehicle.setAppearanceDataBase64(status.appearance64)
    //vehicle.setDamageStatusBase64(status.damage64)
    //vehicle.setHealthDataBase64(status.health64)
    //vehicle.setScriptDataBase64(status.script64)

    //Damage
    vehicle.setBumperDamageLevel(1, status.bumperDamage_f);
    vehicle.setBumperDamageLevel(2, status.bumperDamage_b);

    //DOORS
    vehicle.setDoorState(0, status.door_state_fl);
    vehicle.setDoorState(1, status.door_state_fr);
    vehicle.setDoorState(2, status.door_state_bl);
    vehicle.setDoorState(3, status.door_state_br);

    //PART Bullets
    
    vehicle.setPartBulletHoles(0, status.getPartBullet_fl);
    vehicle.setPartBulletHoles(1, status.getPartBullet_fr);
    vehicle.setPartBulletHoles(2, status.getPartBullet_ml);
    vehicle.setPartBulletHoles(3, status.getPartBullet_mr);
    vehicle.setPartBulletHoles(4, status.getPartBullet_bl);
    vehicle.setPartBulletHoles(5, status.getPartBullet_br);

    //PART DAMAGE LEVEL
    vehicle.setPartDamageLevel(0, status.getPartDamageLevel_fl);
    vehicle.setPartDamageLevel(1, status.getPartDamageLevel_fr);
    vehicle.setPartDamageLevel(2, status.getPartDamageLevel_ml);
    vehicle.setPartDamageLevel(3, status.getPartDamageLevel_mr);
    vehicle.setPartBulletHoles(4, status.getPartDamageLevel_bl);
    vehicle.setPartBulletHoles(5, status.getPartDamageLevel_br);

    //WHEEL
    vehicle.setWheelHealth(0, status.getwlH_fl);
    vehicle.setWheelHealth(1, status.getwlH_fr);
    vehicle.setWheelHealth(2, status.getwlH_ml);
    vehicle.setWheelHealth(3, status.getwlH_mr);
    vehicle.setWheelHealth(4, status.getwlH_bl);
    vehicle.setWheelHealth(5, status.getwlH_br);
    vehicle.setWheelHealth(45, status.getwlHTrl_ml);
    vehicle.setWheelHealth(46, status.getwlHTrl_mr);


    //WHEEL Burst
    vehicle.setWheelBurst(0, status.getwlB_fl);
    vehicle.setWheelBurst(1, status.getwlB_fr);
    vehicle.setWheelBurst(2, status.getwlB_ml);
    vehicle.setWheelBurst(3, status.getwlB_mr);
    vehicle.setWheelBurst(4, status.getwlB_bl);
    vehicle.setWheelBurst(5, status.getwlB_br);
    vehicle.setWheelBurst(45, status.getwlBTrl_ml);
    vehicle.setWheelBurst(46, status.getwlBTrl_mr);

    vehicle.setWheelDetached(0, status.getwlD_fl);
    vehicle.setWheelDetached(1, status.getwlD_fr);
    vehicle.setWheelDetached(2, status.getwlD_ml);
    vehicle.setWheelDetached(3, status.getwlD_mr);
    vehicle.setWheelDetached(4, status.getwlD_bl);
    vehicle.setWheelDetached(5, status.getwlD_br);
    vehicle.setWheelDetached(45, status.getwlDTrl_ml);
    vehicle.setWheelDetached(46, status.getwlDTrl_mr);
    

    //WINDOM DAMAGE
    vehicle.setWindowDamaged(0, status.getWinDamage_fr);
    vehicle.setWindowDamaged(1, status.getWinDamage_fl);
    vehicle.setWindowDamaged(2, status.getWinDamage_rr);
    vehicle.setWindowDamaged(3, status.getWinDamage_rl);



    //WINDOM OPEN
    vehicle.isWindowOpened(status.getWinOpen_fr);
    vehicle.isWindowOpened(status.getWinOpen_fl);
    vehicle.isWindowOpened(status.getWinOpen_rr);
    vehicle.isWindowOpened(status.getWinOpen_rl);
    
    //windows
    vehicle.setArmoredWindowHealth(0, status.armoured_w_health_fr);
    vehicle.setArmoredWindowHealth(1, status.armoured_w_health_fl);
    vehicle.setArmoredWindowHealth(2, status.armoured_w_health_br);
    vehicle.setArmoredWindowHealth(3, status.armoured_w_health_bl);

    vehicle.setArmoredWindowShootCount(0, status.armoured_w_shootCount_fr);
    vehicle.setArmoredWindowShootCount(1, status.armoured_w_shootCount_fl);
    vehicle.setArmoredWindowShootCount(2, status.armoured_w_shootCount_br);
    vehicle.setArmoredWindowShootCount(3, status.armoured_w_shootCount_bl);

    vehicle.setLightDamaged(0, status.light_01);
    vehicle.setLightDamaged(1, status.light_02);
    vehicle.setLightDamaged(2, status.light_03);
    vehicle.setLightDamaged(3, status.light_04);
    vehicle.setLightDamaged(4, status.light_05);
    
    vehicle.dirtLevel = status.dirtLevel,
    vehicle.engineOn = status.engineOn,
    vehicle.bodyAdditionalHealth = status.bodyAdditionalHealth,
    vehicle.engineHealth = status.engineHealth,
    vehicle.petrolTankHealth = status.petrolTankHealth,
    vehicle.bodyHealth = status.bodyHealth

}
export function getVehicleCondition(vehicles) {
    const OBJ = {
        //deformation64: vehicles.getGamestateDataBase64(),
        //appearance64: vehicles.getAppearanceDataBase64(),
        //damage64: vehicles.getDamageStatusBase64(),
        //health64: vehicles.getHealthDataBase64(),
        //script64: vehicles.getScriptDataBase64(),

        //Damage
        bumperDamage_f: vehicles.getBumperDamageLevel(1),
        bumperDamage_b: vehicles.getBumperDamageLevel(2),

        //DOORS
        door_state_fl: vehicles.getDoorState(0),
        door_state_fr: vehicles.getDoorState(1),
        door_state_bl: vehicles.getDoorState(2),
        door_state_br: vehicles.getDoorState(3),

        //PART Bullets
        
        getPartBullet_fl: vehicles.getPartBulletHoles(partID.FrontLeft),
        getPartBullet_fr: vehicles.getPartBulletHoles(partID.FrontRight),
        getPartBullet_ml: vehicles.getPartBulletHoles(partID.MiddleLeft),
        getPartBullet_mr: vehicles.getPartBulletHoles(partID.MiddleRight),
        getPartBullet_bl: vehicles.getPartBulletHoles(partID.RearLeft),
        getPartBullet_br: vehicles.getPartBulletHoles(partID.RearRight),

        //PART DAMAGE LEVEL
        getPartDamageLevel_fl: vehicles.getPartDamageLevel(partID.FrontLeft),
        getPartDamageLevel_fr: vehicles.getPartDamageLevel(partID.FrontRight),
        getPartDamageLevel_ml: vehicles.getPartDamageLevel(partID.MiddleLeft),
        getPartDamageLevel_mr: vehicles.getPartDamageLevel(partID.MiddleRight),
        getPartDamageLevel_bl: vehicles.getPartBulletHoles(partID.RearLeft),
        getPartDamageLevel_br: vehicles.getPartBulletHoles(partID.RearRight),

        //WHEEL
        getwlH_fl: vehicles.getWheelHealth(wheelIndex.FrontLeft),
        getwlH_fr: vehicles.getWheelHealth(wheelIndex.FrontRight),
        getwlH_ml: vehicles.getWheelHealth(wheelIndex.MiddleLeft),
        getwlH_mr: vehicles.getWheelHealth(wheelIndex.MiddleRight),
        getwlH_bl: vehicles.getWheelHealth(wheelIndex.RearLeft),
        getwlH_br: vehicles.getWheelHealth(wheelIndex.RearRight),
        getwlHTrl_ml: vehicles.getWheelHealth(wheelIndex.middleLeftTrailer),
        getwlHTrl_mr: vehicles.getWheelHealth(wheelIndex.middleRightTrailer),


        //WHEEL Burst
        getwlB_fl: vehicles.isWheelBurst(wheelIndex.FrontLeft),
        getwlB_fr: vehicles.isWheelBurst(wheelIndex.FrontRight),
        getwlB_ml: vehicles.isWheelBurst(wheelIndex.MiddleLeft),
        getwlB_mr: vehicles.isWheelBurst(wheelIndex.MiddleRight),
        getwlB_bl: vehicles.isWheelBurst(wheelIndex.RearLeft),
        getwlB_br: vehicles.isWheelBurst(wheelIndex.RearRight),
        getwlBTrl_ml: vehicles.isWheelBurst(wheelIndex.middleLeftTrailer),
        getwlBTrl_mr: vehicles.isWheelBurst(wheelIndex.middleRightTrailer),

        //WHEEL Detached
        getwlD_fl: vehicles.isWheelDetached(wheelIndex.FrontLeft),
        getwlD_fr: vehicles.isWheelDetached(wheelIndex.FrontRight),
        getwlD_ml: vehicles.isWheelDetached(wheelIndex.MiddleLeft),
        getwlD_mr: vehicles.isWheelDetached(wheelIndex.MiddleRight),
        getwlD_bl: vehicles.isWheelDetached(wheelIndex.RearLeft),
        getwlD_br: vehicles.isWheelDetached(wheelIndex.RearRight),
        getwlDTrl_ml: vehicles.isWheelDetached(wheelIndex.middleLeftTrailer),
        getwlDTrl_mr: vehicles.isWheelDetached(wheelIndex.middleRightTrailer),

        //WINDOM DAMAGE

        getWinDamage_fr: vehicles.isWindowDamaged(windowIndex.FrontRight),
        getWinDamage_fl: vehicles.isWindowDamaged(windowIndex.FrontLeft),
        getWinDamage_rr: vehicles.isWindowDamaged(windowIndex.RearRight),
        getWinDamage_rl: vehicles.isWindowDamaged(windowIndex.RearLeft),

        //WINDOM OPEN
        getWinOpen_fr: vehicles.isWindowOpened(windowIndex.FrontRight),
        getWinOpen_fl: vehicles.isWindowOpened(windowIndex.FrontLeft),
        getWinOpen_rr: vehicles.isWindowOpened(windowIndex.RearRight),
        getWinOpen_rl: vehicles.isWindowOpened(windowIndex.RearLeft),
        
        //windows
        armoured_w_health_fr: vehicles.getArmoredWindowHealth(0),
        armoured_w_health_fl: vehicles.getArmoredWindowHealth(1),
        armoured_w_health_br: vehicles.getArmoredWindowHealth(2),
        armoured_w_health_bl: vehicles.getArmoredWindowHealth(3),

        armoured_w_shootCount_fr: vehicles.getArmoredWindowShootCount(0),
        armoured_w_shootCount_fl: vehicles.getArmoredWindowShootCount(1),
        armoured_w_shootCount_br: vehicles.getArmoredWindowShootCount(2),
        armoured_w_shootCount_bl: vehicles.getArmoredWindowShootCount(3),
        //getExtra() ???

        light_01: vehicles.isLightDamaged(0),
        light_02: vehicles.isLightDamaged(1),
        light_03: vehicles.isLightDamaged(2),
        light_04: vehicles.isLightDamaged(3),
        light_05: vehicles.isLightDamaged(4),

        dirt_level: vehicles.dirtLevel,
        isEngineON: vehicles.engineOn,
        bodyAdditionalHealth: vehicles.bodyAdditionalHealth,
        engineHealth: vehicles.engineHealth,
        petrolTankHealth: vehicles.petrolTankHealth,
        bodyHealth: vehicles.bodyHealth,
    }
    return OBJ;
}
