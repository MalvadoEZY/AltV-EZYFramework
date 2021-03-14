import * as alt from 'alt'

alt.Vehicle.prototype.loadVehicle = function loadVehicle(result, vehicle, IntervalSavable = true) {
    this.object = vehicle;
    this.IntervalSavable = IntervalSavable;
    if(result === null) {
        this.numberPlateText = 'STAFF';
    } else {
        const vehicleInfo = JSON.parse(result.info);

        this.identifier = result.id;
        this.ownerid = result.ownerID;
        this.plate = vehicleInfo.plate;
        this.numberPlateText = this.plate;
        this.key_code = vehicleInfo.key_code;
        this.kilometers = vehicleInfo.kilometers;
        //FUEL
        this.fuelType = vehicleInfo.fuelType;
        this.fuelConsumption = vehicleInfo.fuelConsumption;
        this.fuel = vehicleInfo.fuel;
        //MISC
        this.brakeOil = vehicleInfo.brakeOil;
        this.engineOil = vehicleInfo.engineOil;
        this.engineWater = vehicleInfo.engineWater;
        this.engineBroke = vehicleInfo.engineBroke;
    }
}

alt.Player.prototype.saveVehicles = async function saveVehicles() {
    for(let vehicles of alt.Vehicle.all) {
        if(vehicles.ownerid === this.ownerid) {
            const carPosition = {
                x: vehicles.pos.x,
                y: vehicles.pos.y,
                z: vehicles.pos.z,
                rotx: vehicles.rot.x,
                roty: vehicles.rot.y,
                rotz: vehicles.rot.z
            }
            const statusOBJ = getVehicleCondition(vehicles)
            await mysql.query("UPDATE vehicles SET location = '" + JSON.stringify(carPosition) + "', status = '" + JSON.stringify(statusOBJ) + "' WHERE ownerID = '" + this.ownerid + "' AND id = '" + vehicles.identifier + "'").then(([result, fields]) => {
            }).catch((err) => {
            return err;
            })
            
        }
    }
}
