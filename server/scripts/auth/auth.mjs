import * as alt from 'alt'
import * as mysql from '../../services/mysql/mysql.mjs'
import mailer from '../../services/mailer/mailer.mjs'
import logger from '../../services/log/log.mjs'
import config from '../../config/config.mjs'
import { userRank } from '../systems/admin.mjs'

var dimension = 50
var numLogins = 0

export function changeSex(player, sexIndex) {
    if(sexIndex === 1) {
        player.model = 'mp_m_freemode_01'
    } else {
        player.model = 'mp_f_freemode_01'
    }
    player.pos = {x: 427.5,y: -800.2,z: 29.5}
}
export function prepareChar(player) {
    dimension = dimension +  1
    player.model = 'mp_m_freemode_01'
    player.dimension = dimension
    player.pos = {x: 427.5,y: -800.2,z: 29.5}
    alt.emitClient(player, 'auth:prepareChar', true);
}

export async function getStatus(player, socialID, hwHash, hwHashEx, playerIP, discordData) {
    const mysqlState = alt.getMeta('mysql:state')
    //If the socialclub was not detected
    if(socialID === String(0) || socialID === undefined || socialID === null) {
        player.kick("Socialclub não detetado!")
        return;
    }
    if(mysqlState) {
        let banInformation;
        const checkAccountExists = await mysql.query('SELECT socialID, email, discordID FROM users WHERE socialID = "' + socialID + '"').then(([result,fields]) => {
            if(Array.isArray(result) && result.length === 0) {
                //IF THERE IS NO ACCOUNT -> GOES TO THE REGISTER PAGE
                return false
            } else {
                if(result[0].socialID === socialID) {
                    //THIS CONFIRMS THAT THE USER EXISTS
                    player.setMeta('player:email', result[0].email)
                    player.setMeta('player:discordID', result[0].discordID)
                    return true
                } else {
                    return false
                }
            }  
        }).catch((err) => {
            logger.error('Jogador SocialID: ' + socialID + ' teve um erro ao iniciar: ' + err.code)
            return err.code;
        })
        
        const email = player.getMeta('player:email')

        
        const isBanned = await mysql.query('SELECT * FROM ban_list WHERE discordID = "' + discordData.id + '" OR socialID = "' + socialID + '" OR email = "' + email + '" OR hwlicense = "' + hwHash + '" OR hwlicenseEx = "' + hwHashEx + '" OR ipAddress = "' + playerIP + '" LIMIT 1').then(([result, fields]) => {
            if(Array.isArray(result) && result.length === 0) {
                return false
            } else {
                banInformation  = {
                    banID: result[0].banID,
                    reason: result[0].reason
                }

                return true;
            }
        }).catch((err) => {
            alt.log("Ocorreu um erro na base de dados -> " + err)
        })
        
        if(isBanned) {
            alt.emitClient(player, 'player:userbanned', banInformation);
            player.kick('Foste banido do servidor: ' + banInformation.reason); 
            return;
        }        
      
        alt.emitClient(player, 'auth:getStatus', checkAccountExists)
        
    } else {
        alt.emitClient(player, 'auth/InternalError', 500)
    }
}
export async function requestRegister(player, obj, hashes) {
    const verifiedState = 0;
    const timestamp = new Date().toLocaleString();
    let finalResult;
    await mysql.query("SELECT email, discordID FROM users WHERE email = '" + obj.email + "' OR discordID = '" + obj.discordid + "'").then(async([result,fields]) => {
        //if user already exists
        if(Array.isArray(result) && result.length) {
            if(result[0].email === obj.email && result[0].discordID === obj.discordid) {
                alt.emitClient(player, 'auth:requestRegister', )
                finalResult = [true,true]
            } else {
                
                let callbackResult1 = false;
                let callbackResult2 = false;

                if(result[0].email === obj.email) {
                    callbackResult1 = true
                } 
                if (result[0].discordID === obj.discordid) {
                    callbackResult2 = true
                }
                finalResult = [callbackResult1, callbackResult2]
            }
        } else {
            await mysql.query("INSERT INTO users (socialID, hwlicense, hwlicenseEx, email, password, discordID, discordInfo, verified, registedDate, registedIP) VALUES ('" + hashes.socialID + "',  '" + hashes.hwHash + "' , '" + hashes.hwHashEx + "', '" + obj.email + "', '" + obj.password + "', '" + obj.discordid + "', '" + JSON.stringify(obj.discordinfo) + "', '" + verifiedState + "', '" + timestamp + "', '" + hashes.playerIP + "')").then((result) => {
                finalResult = [false, false, result[0].insertId]
            })
        }
    }).catch((err) => {
        alt.log(err)
    })
    alt.emitClient(player, 'auth:requestRegister', finalResult)
}
export async function verifiedAddValue(player, value, socialID) {
    const result = await mysql.query("UPDATE users SET verified = " + value + " WHERE socialID = '" + socialID + "'").then((result) => {
        if(result) {
            return true;
        } else {
            return false;
        }
    });

    alt.emitClient(player, 'auth:verifiedAddValue', result)
}
export async function requestLogin(player, password, socialID) {
    const passwordHashed = String(password)
    let resultado;
    await mysql.query('SELECT id, password, verified, permission FROM users WHERE socialID = "' + socialID + '"').then(([result,fields]) => {
        if(Array.isArray(result) && result.length) {
            if(result[0].password === passwordHashed) {
                numLogins = numLogins + 1
                resultado = [true, result[0].verified, result[0].permission];
            } else {
                resultado = [false, null];
            }
        }
    }).catch((err) => {
        logger.server('ERRO: [auth/requestLogin] : JOGADOR ID:' + playerID + " -> " + err)
        resultado = [null, null];
    }) 

    if(resultado !== undefined) {
        alt.emitClient(player, 'auth:requestLogin', resultado);
    }
}

export async function requestVerification(player, code) {
    if(player.hasMeta('player:email')) {
        const target = player.getMeta('player:email')
        const emailSending = mailer.recoverPassword(code, target)

        if(emailSending) {
            //if email has been sended
            alt.emitClient(player, 'auth:codeVerificationConfirmation', true)
        } else {
            //if email has been not sended
            alt.emitClient(player, 'auth:codeVerificationConfirmation', false)
        }

    }
}

//when player put a new password to change
export async function changePassword(player, password, socialID) {
    alt.log(socialID + " //  " +  password)
    await mysql.query("UPDATE users SET password = '" + password + "' WHERE socialID = '" + socialID + "'").then(([resolve, fields]) => {
        alt.log(resolve)
        alt.emitClient(player, 'auth:changePasswordSuccess', true);
        logger.server('Um utilizador mudou a password')
    }).catch((err) => {
        alt.log(err)
        alt.emitClient(player, 'auth:changePasswordSuccess', false);
    })
}

export async function createChar(player, charInfo, clothes, appearance, playerID) {
    const defaultPosition = config.spawnposition
    const defaultStatus = {
        hunger: 100,
        thrist: 100
    }
    const startupHealth = 200
    await mysql.query("INSERT INTO characters (ownerID, position, charInfo, health, appearance, clothes, status) VALUES ("+ playerID +",'" + JSON.stringify(defaultPosition) + "', '" + JSON.stringify(charInfo) + "', " + startupHealth + ", '" + JSON.stringify(appearance) + "', '" + JSON.stringify(clothes) + "', '" + JSON.stringify(defaultStatus) + "')").then(async (result) => {
        await mysql.query('UPDATE users SET verified = ' + 2 + ', permission = ' + userRank.PLAYER + ' WHERE socialID = "' + playerID + '"').then((res) => {
            logger.server('Um novo utilizador registado da conta ID: ' + playerID + ", Nome: " + charInfo.firstName + ' ' + charInfo.lastName)
            alt.emitClient(player, 'auth:createChar', true);
        }).catch((err) => {
            logger.server('ERRO: [auth/creation/createChar] : JOGADOR ID:' + playerID + " -> " + err)
        })
    }).catch((err) => {
        logger.server('ERRO: [auth/creation/createChar] : JOGADOR ID:' + playerID + " -> " + err)
        alt.emitClient(player, 'auth:createChar', false);
    })

}
