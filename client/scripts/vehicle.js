import * as alt from 'alt-client'
import * as native from 'natives'
import lib from '../lib/lib.js'

//EVENTS
alt.onServer('vehicle:carData', setVariables)

//VARIABLES
let pedInSameVehicleLast = false;
let vehicle;
let lastVehicle;
let vehicleClass;

let healthEngineLast = 1000.0;
let healthEngineCurrent = 1000.0;
let healthEngineNew = 1000.0;
let healthEngineDelta = 0.0;
let healthEngineDeltaScaled = 0.0;

let healthBodyLast = 1000.0;
let healthBodyCurrent = 1000.0;
let healthBodyNew = 1000.0;
let healthBodyDelta = 0.0;
let healthBodyDeltaScaled = 0.0;

let healthPetrolTankLast = 1000.0;
let healthPetrolTankCurrent = 1000.0;
let healthPetrolTankNew = 1000.0;
let healthPetrolTankDelta = 0.0;
let healthPetrolTankDeltaScaled = 0.0;

let fuelTankConsumption;
let fuelTankCapacity;
let fuelTankExistingFuel;

let brakeOil;
let engineOil;
let engineWater;
let engineBroke;


const classDamageMultiplier = [0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.8,0.9,0.5,0.9,0.9,0.9,0.05,0.05,0.05,0.06,0.06,0.9,0.9,0.05];
//IF PED IS IN VEHICLE FUNCTION
function isPedDrivingAVehicle() {
	let scriptID = alt.Player.local.scriptID;
	if (native.isPedInAnyVehicle(scriptID)) {
        vehicle = native.getVehiclePedIsIn(scriptID);
        if (native.getPedInVehicleSeat(vehicle,-1) == scriptID) {
            let model = native.getVehicleClass(vehicle)
			if (model != 13 && model != 15 && model != 16 && model != 21) {
				return true;
            };
        };
    };
    return false;
};

//HANDLE ROLL 
alt.setInterval(() => { 
	if (pedInSameVehicleLast) {
        let factor = 1.0
        if (healthEngineNew < 900) {
            factor = ((healthEngineNew + 200.0) / 1100)
        }   
        native.setVehicleCheatPowerIncrease(vehicle,factor)        
    }
    let roll = native.getEntityRoll(vehicle)
    if ((roll > 75.0 || roll < -75.0) && native.getEntitySpeed(vehicle) < 2) {
        native.disableControlAction(2,59,true)
        native.disableControlAction(2,60,true)
    }    
},5);

//HANDLE THE DAMAGE
alt.setInterval(() => {     
    let scriptID = alt.Player.local.scriptID;
	vehicle = native.getVehiclePedIsIn(scriptID);
    if (isPedDrivingAVehicle()) {
        vehicleClass = native.getVehicleClass(vehicle)
        healthEngineCurrent = native.getVehicleEngineHealth(vehicle)
        
        if (healthEngineCurrent == 1000) {
            healthEngineLast = 1000.0
        }
        healthEngineNew = healthEngineCurrent
        healthEngineDelta = (healthEngineLast - healthEngineCurrent)
        healthEngineDeltaScaled = (healthEngineDelta * 1.1 * classDamageMultiplier[vehicleClass])
        healthBodyCurrent = native.getVehicleBodyHealth(vehicle)
        
        if (healthBodyCurrent == 1000) {
            healthBodyLast = 1000.0
        }
        
        healthBodyNew = healthBodyCurrent
        healthBodyDelta = (healthBodyLast - healthBodyCurrent)
        healthBodyDeltaScaled = (healthBodyDelta * 1.1 * classDamageMultiplier[vehicleClass])
        healthPetrolTankCurrent = native.getVehiclePetrolTankHealth(vehicle)
        
        if (healthPetrolTankCurrent == 1000) {
            healthPetrolTankLast = 1000.0
        }   

        healthPetrolTankNew = healthPetrolTankCurrent
        healthPetrolTankDelta = (healthPetrolTankLast - healthPetrolTankCurrent)
        healthPetrolTankDeltaScaled = (healthPetrolTankDelta * 61.0 * classDamageMultiplier[vehicleClass])

        

        if (vehicle != lastVehicle) {
            pedInSameVehicleLast = false
        }

        if (healthEngineCurrent > 101.0) {
            native.setVehicleUndriveable(vehicle,false)
        }

        if (healthEngineCurrent <= 101.0) {
            native.setVehicleUndriveable(vehicle,true)
        }

        if (pedInSameVehicleLast) {
            if (healthEngineCurrent !== 1000.0 || healthBodyCurrent !== 1000.0 || healthPetrolTankCurrent !== 1000.0) {
                let healthEngineCombinedDelta = Math.max(healthEngineDeltaScaled,healthBodyDeltaScaled,healthPetrolTankDeltaScaled)
                if (healthEngineCombinedDelta > (healthEngineCurrent - 100.0)) {
                    healthEngineCombinedDelta = (healthEngineCombinedDelta * 0.7)
                }

                if (healthEngineCombinedDelta > healthEngineCurrent) {
                    healthEngineCombinedDelta = (healthEngineCurrent - (210.0 / 5))
                }
                healthEngineNew = (healthEngineLast - healthEngineCombinedDelta)

                if (healthEngineNew > (210.0 + 5) && healthEngineNew < 477.0) {
                    healthEngineNew = (healthEngineNew - (0.128 * 3.2))
                }

                if (healthEngineNew < 210.0) {
                    healthEngineNew = (healthEngineNew - (0.1 * 0.9))
                }

                if (healthEngineNew < 100.0) {
                    healthEngineNew = 100.0
                }

                if (healthBodyNew < 0) {
                    healthBodyNew = 0.0
                }
            } else {
                if (healthBodyCurrent < 210.0) {
                    healthBodyNew = 210.0
                }
                pedInSameVehicleLast = true
            }

            if (healthEngineNew != healthEngineCurrent) {
                native.setVehicleEngineHealth(vehicle,healthEngineNew)
            }

            if (healthBodyNew != healthBodyCurrent) {
                native.setVehicleBodyHealth(vehicle,healthBodyNew)
            }

            if (healthPetrolTankNew != healthPetrolTankCurrent) {
                native.setVehiclePetrolTankHealth(vehicle,healthPetrolTankNew)
            }

       
            healthEngineLast = healthEngineNew
            healthBodyLast = healthBodyNew
            healthPetrolTankLast = healthPetrolTankNew
            lastVehicle = vehicle           
        } else {
            pedInSameVehicleLast = false
        }
    }
}, 50);

//DETECTOR VARIABLES
let vehicleMeters = 0;
alt.setInterval(() => {     
    //fuelTankConsumption
    //fuelTankCapacity
    //fuelTankExistingFuel
    let scriptID = alt.Player.local.scriptID;
	vehicle = native.getVehiclePedIsIn(scriptID);
    let vehicleSpeed = native.getEntitySpeed(vehicle) * 3.6;
    if (isPedDrivingAVehicle()) {
        //KM COUNTER
        vehicleMeters = vehicleMeters + (vehicleSpeed * 0.0277777778);
        
        let fuelConsumptionPer100ms = (fuelTankConsumption / 60 / 60) / 10
        if(native.getIsVehicleEngineRunning(vehicle)) {
            let getRpm = alt.Player.local.vehicle.rpm + 1
            //let getBrakeTense = alt.HandlingData.getForModel(alt.Player.local.vehicle.model).breakForce
            if(getRpm < 1.4) {
                getRpm * alt.Player.local.vehicle.rpm
            }
            if(getRpm >= 1.4 && getRpm < 1.5) {
                getRpm * alt.Player.local.vehicle.rpm * 25.2
            }
            if(getRpm >= 1.5 && getRpm < 1.7) {
                getRpm * alt.Player.local.vehicle.rpm * 40.6
            }
            if(getRpm >= 1.7) {
                getRpm * alt.Player.local.vehicle.rpm * 100
            }
            fuelTankExistingFuel = fuelTankExistingFuel - (fuelConsumptionPer100ms * getRpm)    
        }
    }
    //limitators
    if(brakeOil < 0) {
        brakeOil = 0
    } else if(brakeOil > 100) {
        brakeOil = 100
    }
    if(engineOil < 0) {
        engineOil = 0
    } else if(engineOil > 100) {
        engineOil = 100
    }
    if(engineWater < 0) {
        engineWater = 0
    } else if(engineWater > 100) {
        engineWater = 100
    }
    if(fuelTankExistingFuel < 0) {
        fuelTankExistingFuel = 0
    } else if (fuelTankExistingFuel > fuelTankCapacity) {
        fuelTankExistingFuel = fuelTankCapacity
    }

    native.setVehicleCanLeakPetrol(vehicle, true)
    native.setVehicleCanLeakOil(vehicle, true)
    brakeOil = brakeOil - 0.00040;
    engineOil = engineOil - 0.00060;
    engineWater = engineWater - 0.00050;
}, 100)

alt.setInterval(() => {
    const scriptID = alt.Player.local.scriptID;
    const vehicle = native.getVehiclePedIsIn(scriptID);

    //SAVERS
    let cachedKm;
    if(vehicle) {
        const obj = {
            engineHealth: healthEngineCurrent.toFixed(2),
            bodyHealth: healthBodyCurrent.toFixed(2),
            tankHealth: healthPetrolTankCurrent.toFixed(2),
            fuel: fuelTankExistingFuel.toFixed(2),
            brakeOil: brakeOil.toFixed(2),
            engineOil: engineOil.toFixed(2),
            engineWater: engineWater.toFixed(2),
            engineBroke: engineBroke,
            
        }
        //SAVES VEHICLE STATS
        if(healthEngineLast !== healthEngineCurrent) {
            alt.emitServer('vehicle:updateStats', alt.Player.local.vehicle, obj)
        }
        //SAVES KILOMETERS
        if (isPedDrivingAVehicle()) {
            if(vehicleMeters !== cachedKm) {
                alt.emitServer('vehicle:updateKilometers', alt.Player.local.vehicle, (vehicleMeters * 0.001).toFixed(3))
                cachedKm = vehicleMeters;
            }
        }
    }

    if(native.getIsVehicleEngineRunning(vehicle)) {
        getBrakeTense = alt.HandlingData.getForModel(alt.Player.local.vehicle.model).breakForce
        
        // range 0.0 - 1.0
        if(brakeOil === 0) {
            alt.HandlingData.getForModel(alt.Player.local.vehicle.model).breakForce = 0
        }else if (brakeOil > 0 && brakeOil < 20) {
            alt.HandlingData.getForModel(alt.Player.local.vehicle.model).breakForce = 0.2
        } else if (brakeOil >= 20 && brakeOil < 50) {
            alt.HandlingData.getForModel(alt.Player.local.vehicle.model).breakForce = 0.5
        } else if (brakeOil >= 50 && brakeOil < 80) {
            alt.HandlingData.getForModel(alt.Player.local.vehicle.model).breakForce = 0.9
        } else if(brakeOil >= 80 && brakeOil <= 100 ) {
            alt.HandlingData.getForModel(alt.Player.local.vehicle.model).breakForce = 1.2
        }

        if(engineOil === 0) {
            engineOil = engineOil - 1
        } else if (engineOil > 0 && engineOil <= 30) {
            engineOil = engineOil - 0.3
        } else if (engineOil > 30 && engineOil <= 40) {
            engineOil = engineOil - 0.080
        }

        if(engineWater === 0) {
            engineWater = 0
        } else if(engineWater <= 30) {
            engineWater = engineWater - 0.0020
        }

        //failure
        if(engineBroke !== true) {
            if(engineOil === 0) {
                native.setVehicleUndriveable(vehicle, true);
                engineBroke = true;
            } else if(engineOil < 15) {
                const possibility = Math.floor(Math.random() * 100); 
                if(possibility > 97) {
                    engineBroke = true;
                    native.setVehicleUndriveable(vehicle, true);
                }
            }
        }

        if(engineBroke !== true) {
            if(engineWater === 0) {
                native.setVehicleUndriveable(vehicle, true);
                engineBroke = true;
            } else if(engineWater < 15) {
                const possibility = Math.floor(Math.random() * 100); 
                if(possibility > 97) {
                    native.setVehicleUndriveable(vehicle, true);
                    engineBroke = true;
                }
            }
        }
    }
}, 5000)

function setVariables(vehicleOBJ) {
    const isLogged = alt.getMeta('player:loggedIn');
    if(isLogged) {
        vehicleMeters = vehicleOBJ.vehiclekm * 1000;
        fuelTankConsumption = vehicleOBJ.fuelConsumption;
        fuelTankCapacity = alt.HandlingData.getForModel(alt.Player.local.vehicle.model).petrolTankVolume;
        fuelTankExistingFuel = vehicleOBJ.fuel;
        brakeOil = vehicleOBJ.brakeOil;
        engineOil = vehicleOBJ.engineOil;
        engineWater = vehicleOBJ.engineWater;
        engineBroke = vehicleOBJ.engineBroke;
        alt.setMeta('driving', false);
        showUI(vehicleOBJ);
    }
}

function showUI(vehicleOBJ) {
    alt.everyTick(() => {

        if(isPedDrivingAVehicle()) {  
            if(!alt.getMeta('driving')) {
                alt.setMeta('driving', true);
            }
        } else {
            if(alt.getMeta('driving')) {
                alt.setMeta('driving', false);
            }
        }

        if(vehicleOBJ.ownerid === undefined) {return;}
        const coord = native.getEntityCoords(vehicleOBJ.identifier.scriptID, true)
        lib.drawText("Carro de: " + vehicleOBJ.ownerid + " | matricula: " + vehicleOBJ.plate, 0.9,0.39,0.4)
        lib.drawText("Conta KM: " + (vehicleMeters * 0.001).toFixed(2), 0.9,0.41,0.4)
        lib.drawText("Dano do motor: " + healthEngineCurrent, 0.9,0.43,0.4)
        lib.drawText("Dano da chapa: " + healthBodyCurrent, 0.9,0.45,0.4)
        lib.drawText("Dano do tanque: " + healthPetrolTankCurrent, 0.9,0.47,0.4)
        lib.drawText("Tamanho do tanque: " + fuelTankCapacity, 0.9,0.49,0.4)
        lib.drawText("Consumo de combustivel: " + vehicleOBJ.fuelConsumption + " L/100km", 0.9,0.51,0.4)
        lib.drawText("Quantidade combustivel: " + fuelTankExistingFuel, 0.9,0.53,0.4)
        lib.drawText("Quantidade oleo de travão: " + brakeOil, 0.9,0.55,0.4)
        lib.drawText("Agua no motor: " + engineWater, 0.9,0.57,0.4)
        lib.drawText("Quantidade oleo no motor: " + engineOil, 0.9,0.59,0.4)
        lib.drawText(" X: " + Math.floor(coord.x) + " Y: " + Math.floor(coord.y) + " Z: " + Math.floor(coord.z), 0.5,0.05,0.7, 200, 0 , 0, 235)
        
    });              
}

export function requestVehicle(vehicleName, temporaryVehicle = true) {
    let vehiclePedIn;
    if(native.isPedInAnyVehicle(alt.Player.local.scriptID, false)) {
        vehiclePedIn = alt.Player.local.vehicle;
    }
    if(native.isModelAVehicle(native.getHashKey(vehicleName))) {
        alt.emitServer('vehicle:spawnVehicle', vehicleName, vehiclePedIn, temporaryVehicle);
    } else {
        lib.sendlocalmessage('Este veiculo não foi encontrado', 255, 0, 10);
    }
}

export function completeSpawn(vehicle) {

    lib.loadModelAsync(vehicle.model).then((hasLoaded) => {
        if(hasLoaded === true) {
            alt.setTimeout(() => {
                native.setPedIntoVehicle(alt.Player.local.scriptID, vehicle.scriptID, -1);
            }, 200);
        }
    })
}

export function repairVehicle(vehicle) {
    native.setVehicleFixed(vehicle.scriptID);
    native.setVehicleDeformationFixed(vehicle.scriptID);
    native.setVehicleUndriveable(vehicle.scriptID, false);
}