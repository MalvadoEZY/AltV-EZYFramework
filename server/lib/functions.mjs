import logger from '../services/log/log.mjs'
import alt from 'alt';

let serverCallbacks = {};


alt.onClient('event:teleport', (player, coord) => {
    utils.teleport(player, coord.x, coord.y, coord.z)
})

class utils {
    constructor() {

    }

    stringGen(len) {
        var text = "";
        
        var charset = "QWERTYUIOPASDFGHJKLZXCVBNM0123456789";
        
        for (var i = 0; i < len; i++)
            text += charset.charAt(Math.floor(Math.random() * charset.length));
        
        return text;
    }

    teleport(player, xPos, yPos, zPos) {
        logger.log("Player teleported !");
        player.pos = { 
            x: xPos, 
            y: yPos, 
            z: zPos
        };
    };
    /**
     * Logs something into a file and console.
     * @param {string} type - TYPE OF LOG: log, info, alert, warn, error, success, database, login
     * @param {string} msg - Contains the message log
     */

    loadModel(player) {
        logger.log("Player model set");
        player.model = 'mp_m_freemode_01';
    }

    kickPlayer(player) {
        player.kick();
    }
    
    registerServerCallback(name, cb) {
        serverCallbacks[name] = cb;
    }

    degreesToRadians(degrees) {
        var pi = Math.PI;
        return degrees * (pi/180);
    }

    /**
     * Get the distance from one vector to another.
     * Does take Z-Axis into consideration.
     * @param  {} vector1
     * @param  {} vector2
     * @returns {number}
     */
    distance(vector1, vector2) {
        if (vector1 === undefined || vector2 === undefined) {
            throw new Error('AddVector => vector1 or vector2 is undefined');
        }

        return Math.sqrt(
            Math.pow(vector1.x - vector2.x, 2) + Math.pow(vector1.y - vector2.y, 2) + Math.pow(vector1.z - vector2.z, 2)
        );
    }

    /**
     * Get the closest vector from a group of vectors.
     * @param  {} pos
     * @param  {Array<{x,y,z}> | Array<{pos}} arrayOfPositions
     * @returns {Array<any>}
     */
    getClosestVector(pos, arrayOfPositions) {
        if (!arrayOfPositions[0].pos && !arrayOfPositions[0].x) {
            throw new Error('The specified vectors do not contain x,y,z or pos in their object.');
        }

        arrayOfPositions.sort((a, b) => {
            if (a.pos && b.pos) {
                return this.distance(pos, a.pos) - this.distance(pos, b.pos);
            }

            return this.distance(pos, a.pos) - this.distance(pos, b.pos);
        });

        return arrayOfPositions[0];
    }

    /**
     * Get the closest player to a player.
     * @param  {} player
     * @returns {Array<alt.Player>}
     */
    getClosestPlayer(player) {
        return this.getClosestVector(player.pos, [...alt.Player.all]);
    }

    getClosestVehicle(player) {
        return this.getClosestVector(player.pos, [...alt.Vehicle.all]);
    }

    getProperHourFormat() {
        var hour = new Date().getHours()
        var minutes = new Date().getMinutes()
        var seconds = new Date().getSeconds()
        hour < 10 ? hour = "0" + hour : hour;
        minutes < 10 ? minutes = "0" + minutes : minutes;
        seconds < 10 ? seconds = "0" + seconds : seconds;
      
      return "["+hour+":"+minutes+":"+seconds+"]";
    }

}

const core = new utils()
export default core;