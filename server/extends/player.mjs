import * as alt from 'alt';
import * as mysql from '../services/mysql/mysql.mjs';
import logger from '../services/log/log.mjs';
import { getVehicleCondition } from '../scripts/vehicles/vehicle.mjs'
import { hasPermission, userRank } from '../scripts/systems/admin.mjs';
import lib from '../lib/functions.mjs';

//PROTOTYPESS
//AFTER LOGIN

alt.Player.prototype.LoadCharacter = async function LoadCharacter(playerID, permissions) {
    const PlayerObj = {
        ownerID: playerID,
        permissions: permissions,
        charID: null,
        position: null,
        charInfo: null,
        appearance: null,
        clothes: null,
        tattoo: null,
        status: null,
        health: null,
        discord: null,
    };
    
    const fetchedInfo = await mysql.query("SELECT * FROM characters WHERE ownerID = " + PlayerObj.ownerID + "").then(async ([result, fields]) => {
        PlayerObj.charID = result[0].charID;
        PlayerObj.position = JSON.parse(result[0].position);
        PlayerObj.charInfo = JSON.parse(result[0].charInfo);
        PlayerObj.appearance = JSON.parse(result[0].appearance);
        PlayerObj.clothes = JSON.parse(result[0].clothes);
        PlayerObj.status = JSON.parse(result[0].status);
        PlayerObj.health = result[0].health;
        
        return true
    }).catch(async (err) => {
        //if he doesn't have account
        await mysql.query("UPDATE users SET verified = " + 1 + " WHERE socialID = '" + playerID + "'").then(([result, fields]) => {
            return; 
        })
      
    })

    const fetchedUser = await mysql.query("SELECT discordInfo FROM users WHERE socialID = " + playerID + " LIMIT 1").then(([result, fields]) => {
        PlayerObj.discord =  JSON.parse(result[0].discordInfo);
        return true;
    }).catch((err) => {
        alt.log("FETCHING USER: " + err)
    })
    
    if(fetchedInfo && fetchedUser) {
        //SET DATA TO THE PED
        this.charid = PlayerObj.charID;
        this.ownerid = PlayerObj.ownerID;
        this.rank = PlayerObj.permissions;
        this.discord = PlayerObj.discord;
        this.socialID = PlayerObj.socialID;

        this.pos = {
            x: PlayerObj.position.x,
            y: PlayerObj.position.y + 0.2,
            z: PlayerObj.position.z
        };

        this.rot = {
            x: 0,
            y: 0,
            z: PlayerObj.position.rot
        };
        
        this.setMeta('player:charinfo', PlayerObj.charInfo);
        this.setMeta('player:status', PlayerObj.status);
        this.setMeta('player:health', PlayerObj.health);
        this.setSyncedMeta('player:permission', this.rank);

        let startTime = new Date().getTime();

        if(!this.hasMeta('player:sessionTime')) {
            this.setMeta('player:sessionTime', startTime);
        }

        if(PlayerObj.charInfo.sex === 1) {
            this.model = "mp_m_freemode_01";
        } else {
            this.model = "mp_f_freemode_01";
        }
        this.dimension = 0;

        return PlayerObj;
    }  
}

alt.Player.prototype.kick = function kick(reason) {
    this.kick("Foste expulso por - " + reason);
}

alt.Player.prototype.ban = async function ban(reason, time) {
    const fetchedUser = await mysql.query("SELECT socialID, hwlicense, hwlicenseEx, email, discordID, registedIP FROM users WHERE socialID = " + this.ownerid + " LIMIT 1").then(([result, fields]) => {
        return result[0];
    }).catch((err) => {
        alt.log("FETCHING USER: " + err);
    })

    const insertBAN = await mysql.query('INSERT INTO ban_list (socialID, hwlicense, hwlicenseEx, discordID, email, ipAddress, time) VALUES ("' + fetchedUser.socialID + '","' + fetchedUser.hwlicense + '","' + fetchedUser.hwlicenseEx + '","' + fetchedUser.discordID + '","' + fetchedUser.email + '","' + fetchedUser.registedIP + '", "' + time + '")').then((res) => {
        return true
    }).catch((err) => {
        alt.log("ERRO A DAR BAN A UTILIZADOR: " + err);
        return false;
    })

    if(insertBAN) {
        this.kick("Foste banido: " + reason);
    }
}

alt.Player.prototype.save = async function save() {
    const newPosition = {
        x: this.pos.x,
        y: this.pos.y,
        z: this.pos.z,
        rot: this.rot.z
    }

    const charStatus = this.getMeta('player:status')
    await mysql.query("UPDATE characters SET position = '" + JSON.stringify(newPosition) + "', health = '" + this.health + "', status = '" + JSON.stringify(charStatus) + "' WHERE ownerID = " + this.socialId + " ").then((res) => {
    //if position saved
    }).catch((err) => {
        logger.error("Ocorreu um erro a guardar a posição do jogador ! " + err)
    })
}

//sets logs to a player
alt.Player.prototype.log = function log(msg) {
    if(this.getSyncedMeta('player:loggedIn')) {
        const charInfo = this.getMeta('player:charinfo');
        if(this.hasMeta('player:charinfo')) {
            const playerOBJ = {
                id: this.charid,
                ownerID: this.ownerid,
                name: charInfo.firstName + ' ' + charInfo.lastName,
                permissions: this.permissions
            }
            logger.player(msg, playerOBJ);
        }
    } else {
        logger.player(msg, this.socialId)
    }
}


alt.Player.prototype.notification = function notification(type, text, time = 3) {
    const data = {
        type: type,
        text: text,
        time: time
    }
    alt.emitClient(this, 'base:notification', data)
}

alt.Player.prototype.setPermission = async function setPermission(requestedid, permissionID) {
    alt.log(requestedid)
    alt.log(permissionID)
    if(hasPermission(this, userRank.ADMINISTRATOR)) {
        let hasFoundPlayer = false;
        for(let target of alt.Player.all) {
            if(toString(target.charid) == toString(requestedid)) {
                if(target.getSyncedMeta('player:loggedIn')) {
                    if(permissionID < this.rank) {
                        const charInfo = target.getMeta('player:charinfo')
                        const charInfoSource = this.getMeta('player:charinfo')
                        hasFoundPlayer = true
                        await mysql.query('UPDATE users SET permission = ' + permissionID + ' WHERE socialID = "' + target.socialId + '"').then((result) => {
                            logger.server('Permissão de ' + charInfo.firstName + '(' + target.charid + ') foi mudada de ' + target.rank + ' para ' + permissionID );
                            this.notification(0, 'Inseris-te permissão com successo no jogador ID: ' + target.charid);
                            target.notification(0, 'A tua permissão foi mudada de: ' + target.rank + " para " + permissionID + " por " + charInfoSource.firstName + " " + charInfoSource.lastName);
                            target.rank = permissionID;
                            target.setSyncedMeta('player:permission', permissionID);
                        }).catch((err) => {
                            logger.server('Erro a dar permissão ao jogador: ' + charInfo.firstName + ' ID: ' + target.charid);
                            return;
                        })
                    } else {
                        this.notification(1,'Não tens permissões suficientes !');
                        return;
                    }
                } else {
                    this.notification(1, 'Utilizador encontrado mas ainda não iniciou sessão !');
                    return;
                }  
            }
        }

        if(!hasFoundPlayer) {
            this.notification(1, 'Jogador não encontrado')
        }
    } else {
        logger.server('Utilizador ID: ' + this.charid + ' tentou inserir permissões')
    
    }
    
}

//Revive self or a player
alt.Player.prototype.revive = function revive(requestedid) {
    if(hasPermission(this, userRank.ADMINISTRATOR)) {
        if(this.getSyncedMeta('player:loggedIn')) {
            //SELF REVIVE
            if(requestedid.length === 0) {
                this.health = 200
                this.notification(0, 'Reviveste-te com sucesso')
                this.spawn(this.pos.x, this.pos.y, this.pos.z, 100) // need some rework
                return;
            //REVIVE ANOTHER ID
            } else {
                const sourceChar = this.getMeta('player:charinfo')
                let hasFoundPlayer = false;
                //revive another player
                let target;
                for(target of alt.Player.all) {
                    if(String(target.charid) === requestedid) {
                        hasFoundPlayer = true;
                        const position = target.pos;
                        target.health = 200
                        target.spawn(position.x, position.y, position.z, 100)
                        this.notification(0, 'Revives-te com sucesso o jogador ID: ' + target.charid)
                        target.notification(0, 'Foste revivido por ' + sourceChar.firstName + " " + sourceChar.lastName)
                    } else {
                        this.notification(1, 'Jogador não encontrado')
                    }
                }
                if(!hasFoundPlayer) {
                    this.notification(1, 'Jogador não encontrado')
                }
            }
        }
    } else {
        this.notification(1, 'Não tens permissões')
    }
}

alt.Player.prototype.teleport = async function teleport(xOrChar, y, z) {  
    alt.log(xOrChar);
    alt.log(y);
    alt.log(z);
    if(hasPermission(this, userRank.HELPER)) {
        if(this.getSyncedMeta('player:loggedIn')) {
            let hasFoundPlayer = false;
            if(xOrChar && !y && !z) {
                let target;
                //TELEPORT TO PED
                for(target of alt.Player.all) {      
                    if(target.charid === parseInt(xOrChar)) {
                        const targetInfo = target.getMeta('player:charinfo')
                        const targetPosition = target.pos;
                        
                        this.pos = {
                            x: targetPosition.x,
                            y: targetPosition.y,
                            z: targetPosition.z
                        }
                        hasFoundPlayer = true
                        this.notification(0, 'Teleportas-te com sucesso para: ' + targetInfo.firstName + " " + targetInfo.lastName)
                    }
                    
                }
            } else if(xOrChar && y && !z) {
                //TELEPORT COORDS
                if(this.vehicle) {
                    this.vehicle.pos = {
                        x: xOrChar,
                        y: y,
                        z: 'ground'
                    }
                } else {
                    this.pos = {
                        x: xOrChar,
                        y: y,
                        z: 'ground'
                    }
                }
                hasFoundPlayer = true
                this.notification(0, 'Teleportas-te com sucesso')
            } else if(xOrChar && y && z) {
                //TELEPORT COORDS
                if(this.vehicle) {
                    this.vehicle.pos = {
                        x: xOrChar,
                        y: y,
                        z: z
                    }
                } else {
                    this.pos = {
                        x: xOrChar,
                        y: y,
                        z: z
                    }
                }
                hasFoundPlayer = true
                this.notification(0, 'Teleportas-te com sucesso') 
            }

            if(!hasFoundPlayer) {
                this.notification(1, 'Jogador não encontrado')
            }
            
            const noclipActivated = this.getSyncedMeta('FREECAM')
            //teleport noclip position if the player teleports with success
            if(hasFoundPlayer && noclipActivated) {
                alt.emitClient(this, 'noclip:teleportUpdate', this.pos);
            }
        }
    }
}

alt.Player.prototype.teleportMe = function teleportMe(requestedid) {
    if(hasPermission(this, userRank.HELPER)) {
        let target
        let hasFoundPlayer = false;
        if(requestedid.length <= 1) {
            this.notify('Este campo necessita de parâmentros !', 255, 20, 250, 255, true)
        }
        for (target of alt.Player.all) {
            if(target.charid === parseInt(requestedid)) {
                hasFoundPlayer = true;
                const sourcePos = this.pos;
                const targetInformation = target.getMeta('player:charinfo')
                target.pos = {
                    x: sourcePos.x,
                    y: sourcePos.y,
                    z: sourcePos.z
                }
                this.notification(0, 'Teletransportas-te com sucesso o jogador ' + targetInformation.firstName + " " + targetInformation.lastName + " para a tua posição") 
                target.notification('warning', 'Foste movido pelo STAFF: ' + this.discord.name);
            }
        }

        if(!hasFoundPlayer) {
            this.notification(1, 'Jogador não encontrado !'); 
        }
    } else {
        //Não tem permissões
    }
}

alt.Player.prototype.notify = function notify(msg, r,g,b,a = 255) {
    const playerInfo = this.getMeta('player:charinfo');
    let CurrentClock = lib.getProperHourFormat();
    const text = {
        id: this.charid,
        date: CurrentClock,
        sender: playerInfo.firstName + ' ' + playerInfo.lastName,
        message: msg,
        r: r,
        g: g,
        b: b,
        a: a
    };
    alt.emitClient(this, 'chat:proximityChat', text);
}