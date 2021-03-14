import alt from 'alt-server';
import config from '../../config/config.mjs';
import lib from '../../lib/functions.mjs';

export function toggleAdmin(player, state) {
    if(hasPermission(player, userRank.ADMIN)) {
        alt.emitClient(player, 'chat:toggleAdmin', state)
    } else {
        //LOG PLAYER TRIED TOGGLE ADMIN
    }
}

function basicTextFunction(player, message, r = 255, g = 255, b = 255, a = 255) {
    const playerInfo = player.getMeta('player:charinfo');
    const OBJ = {
        id: player.charid,
        date: lib.getProperHourFormat(),
        sender: playerInfo.firstName + ' ' + playerInfo.lastName,
        message: message,
        r: r,
        g: g,
        b: b,
        a: a
    };
    return OBJ;
}   

export function sendMessage(player, message) {
    const text = basicTextFunction(player, '[' + player.charid + '] ' + '' + player.discord.name + ' : ' + message, 255, 255, 255, 255);
    //SEND TO PROXIMITY
    for(let target of alt.Player.all) {
        let dis = lib.distance(player.pos, target.pos);
        if(dis < config.proximityChatRange) {
            alt.emitClient(target, 'chat:proximityChat', text);
        }
    }
}

//COMMANDS
//keep eye on this boy
export function handleGoto(player, args) {
    const splitArgs = args.split(" ");
    player.teleport(...splitArgs);
}

export function handleBring(player, args) {
    const splitArgs = args.split(" ");
    player.teleport(...splitArgs);
}

export function sendPrivateMsg(player, message, r, g, b, a) {
    const text = basicTextFunction(player, message, r, g, b, a);
    alt.emitClient(player, 'chat:proximityChat', text);
}

export function sendMe(player, message) {
    const text = basicTextFunction(player, '*' + message + ' *', 219, 0, 182, 255);
    for(let target of alt.Player.all) {
        let dis = lib.distance(player.pos, target.pos);
        if(dis < config.proximityChatRange) {
            alt.emitClient(target, 'chat:me', player, text);
        }
    }
}

export function sendDo(player, message) {
    const text = basicTextFunction(player, '((' + message + ' ))', 161, 0, 242, 255);
    for(let target of alt.Player.all) {
        let dis = lib.distance(player.pos, target.pos);
        if(dis < config.proximityChatRange) {
            alt.emitClient(target, 'chat:do', player, text);
        }
    }
}

function doFix(player, message) {
    const splitArgs = args.split(" ");
    splitArgs.shift();
  

    for(let target of alt.Player.all) {
        let dis = lib.distance(player.pos, player.pos);
        if(dis < config.proximityChatRange) {
            alt.emitClient(target, 'chat:dofix', OBJ);
        }
    }
}

function chatPm(player, message) {
    const splitArgs = message.split(" ");
    splitArgs.shift();
    let idArgument = splitArgs;
    splitArgs.shift();  
    let unArray = splitArgs;

    //SEND TO PROXIMITY
    for(let target of alt.Player.all) {
        if(toString(target.charid) === toString(idArgument)) {
            const text = basicTextFunction(player, '[STAFF] ' + '' + player.discord.name + ' ->  ' + target.discord.name + ': ' + unArray, 255, 11, 11, 255);
            alt.emitClient(target, 'chat:proximityChat', text);
        }
    }
}

function broadcast(msg) {
    const OBJ = {
        id: null,
        date: lib.getProperHourFormat(),
        sender: "Administrador",
        message: "STAFF: " + msg,
        infoShow: false,
        color: 'red'
    }
   
    for(let target of alt.Player.all) {
        alt.emitClient(target, 'chat:sendmessage', OBJ)
    }
}

