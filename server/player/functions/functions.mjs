import alt from 'alt';
import  * as mysql from '../../services/mysql/mysql.mjs';
import {hasPermission, userRank} from '../../scripts/systems/admin.mjs';

//////// FUNCTIONS //////////

export function toggleNoclip(player) {
    alt.emit('freecam:Toggle', player);
}

export function reviveStatus(player) {
    const fullStatus = {
        hunger: 100,
        thrist: 100
    }
    player.setStatus(fullStatus)
}

export function banUser(player, playerID, reason) {
    for(let target of alt.Player.all) {
        if(String(target.charid) === String(playerID)) {
            //permissions
            target.ban(playerID, reason)
        }
    }
}

export function kickUser(player, args) {
    const splitArgs = args.split(" ");
    alt.log("ARGS" + JSON.stringify(splitArgs))
    for(let target of alt.Player.all) {
        if(String(target.charid) === String(splitArgs[0])) {
            const arrayWithoutID = splitArgs.shift();
            alt.log(typeof(arrayWithoutID))
            let newArray = []
            newArray.push(arrayWithoutID)
            const outPutArray = newArray.join(' ')
            //permissions
            alt.log("VAI KIKCAR " )
            target.kick(outPutArray)
        }
    }
}

export async function RetreiveInfo(player) {
    if(hasPermission(player, userRank.HELPER)) {
        var t = new Date().getTime(); 
        const users = await mysql.query('SELECT * FROM users').then(([result, fields]) => {
            return result
        })

        const chars = await mysql.query('SELECT charID, ownerID, charInfo FROM characters').then(([result, fields]) => {
            return result
        })
            let playersArray = [];
            let target;

            for (let i = 0; i < chars.length; i++) {
                const charInfo = JSON.parse(chars[i].charInfo);
                let filtering = users.filter(function (user) { 
                    if(user.socialID == chars[i].ownerID) { 
                        return user;
                    }
                });
                const DBDiscordInfo = JSON.parse(filtering[0].discordInfo)
              
                const object = {
                    id: chars[i].charID, 
                    name: charInfo.firstName + ' ' + charInfo.lastName, 
                    discord: {
                        id: filtering[0].discordID,
                        name: DBDiscordInfo.name, 
                        discriminator: DBDiscordInfo.discriminator, 
                        avatar: DBDiscordInfo.avatar
                    }, 
                    
                    ping: null, 
                    isMuted: false, 
                    isOnline: false,
                }
            
                for(target of alt.Player.all) {
                    if(target.getSyncedMeta('player:loggedIn')) {
                        if(target.charid === object.id) {
                            object.isOnline = true;
                            object.ping = target.ping - 45;
                        }
                    }
                }
                playersArray.push(object)
            };
    
            return playersArray
    } else {
        // LOGGER
        player.setSyncedMeta('adminmenu:permitted', false)
        alt.log('alguem tentou abrir o painel admin')
    }
}

export async function AdminMenuLoad(player) {
    const receiveInfo = await RetreiveInfo(player)
    if(Array.isArray(receiveInfo) && receiveInfo.length) {
        alt.emitClient(player, 'admin:create', receiveInfo)
    }
}



export async function refreshPlayers(player) {
    const receiveInfo = await RetreiveInfo(player)
    if(Array.isArray(receiveInfo) && receiveInfo.length) {
        alt.emitClient(player, 'adminmenu:refreshplayer', receiveInfo)
    }
}
