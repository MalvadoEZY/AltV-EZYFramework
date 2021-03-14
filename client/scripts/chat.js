import * as alt from 'alt-client';
import * as native from 'natives';
import lib from '../lib/lib.js';
import * as vehicle from '../scripts/vehicle.js';
import config from '../config/main.js';
import { sendNotification } from '../scripts/base.js'


const url = 'http://resource/client/browser/chat/index.html';
let webview;
let permissions;
let chatInitialized = false;
let isChatOpen = false;
let headerTextArray = [];
let commands;

export async function interfaceStart(perm, chatCommands) {
    if(!webview) {
        webview = await new alt.WebView(url);
    }

    permissions = perm;
    commands = chatCommands;
    //EVENTS
    alt.Player.local.setMeta('chatAllowedOpen', true);
    webview.on('chat:ready', () => {loadChat(perm)});
    webview.on('chat:sendmessage', sendMessage);
    webview.on('chat:sendcommand', checkCommand);
    webview.on('chat:hideChat', hideChat);

}

function checkCommand(cmd, args) {
    const newArgs = args.slice(1, args.length);

    const availableCommands = commands.commands;
    let cmdExist;
    //CHECK COMMAND PERMISSIONS
    for (let i = 0; i < availableCommands.length; i++) {
        if(availableCommands[i].cmd === cmd) {
            if(availableCommands[i].level <= permissions) {
                cmdExist = true;
                break;
            } else {
                alt.log("Player doesn't have permission");
                cmdExist = false;
            }
        } else {
            cmdExist = false;
        }
        cmdExist = false;
    }

    //EXECUTE THE FOLLOWING COMMAND IF HAS PERMITTIONS
    
    if(cmdExist) {
        switch (cmd) {
            case '/me':             alt.emitServer('chat:me', newArgs); break;
            case '/do':             alt.emitServer('chat:do', newArgs); break;
            case '/goto':           alt.emitServer('chat:goto', newArgs); break;
            case '/bring':          alt.emitServer('chat:bring', newArgs); break;
            case '/pm':             alt.emitServer('chat:pm', newArgs); break; // not done
            case '/car':            vehicle.requestVehicle(newArgs); break;
            case '/fix':            alt.emitServer('vehicle:repair');; break;
            case '/flip':           alt.emitServer('vehicle:flipVehicle'); break;
            case '/revive':         alt.emitServer('player:revive', newArgs); break;
            case '/revivestatus':   alt.emitServer('player:revivestatus'); break;
            case '/noclip':         alt.emitServer('player:noclip'); break;
            case '/setperm':        alt.emitServer('player:setPermission', newArgs); break;
            case '/giveitem':       alt.emitServer('inventory:giveitem', newArgs); break;
            case '/removeitem':     alt.emitServer('inventory:removeitem', newArgs); break;
            case '/dv':             alt.emitServer('vehicle:deleteVehicle', newArgs); break;
            case '/gotocar':        alt.emitServer('vehicle:goto', newArgs); break;
            case '/bringcar':       alt.emitServer('vehicle:bring', newArgs); break;
            
            case '/ban':            alt.emitServer('player:ban', newArgs); break;
            case '/kick':           alt.emitServer('player:kick', newArgs); break;

            case '/playcut':        playCutscene(newArgs); break; //play a cutscene
            default: break;
        }
    } else {
        alt.emit('base:notification', 1, 'Comando nao encontrado !')
    }
    //alt.emitServer('chat:sendcommand', cmd, newArgs)
}
let isCutsceneRunning = false;
async function playCutscene(scene) {
    if(isCutsceneRunning) {
        native.stopCutsceneImmediately();
    }

    await lib.playCutscene(scene).then((resolve) => {
        if(resolve) {
            isCutsceneRunning = true
        }
    })
}

function hideChat() {
    isChatOpen = false;
    alt.toggleGameControls(true);
    webview.emit('chat:input_state', false);
}

function showChat() {
    isChatOpen = true;
    alt.toggleGameControls(false);
}

export function setlocalmessage(msg, r, g, b, a = 255) {
    const obj = {
        message: msg,
        r: r,
        g: g,
        b: b,
        a: a
    };
    displayMessage(obj);
}

function loadChat(permissions) {
    webview.emit('chat:loadChat', permissions, commands.commands);
    chatInitialized = true;
}

function sendMessage(message) {
    alt.emitServer('chat:sendmessage', message);
}

export function displayMessage(message) {
    webview.emit('chat:sendProximity', message);
}

export function toggleAdmin(state) {
    webview.emit('chat:toggleAdmin', state);
}

// /ME /DO FUNCTION
function headText(message, senderID, r,g,b,a) {
    let getObjectIndex = headerTextArray.map(function(item) { return item.senderID; }).indexOf(senderID);

    if(getObjectIndex >= 0) {
        alt.clearTimeout(headerTextArray[getObjectIndex].timeout);
        alt.clearEveryTick(headerTextArray[getObjectIndex].everyTick);
        headerTextArray.splice(getObjectIndex, 1);
    }

    let timeouter;
    let timeEverytick; 

    timeEverytick = alt.everyTick(() => {
        const getCoords = native.getEntityCoords(senderID);
        lib.drawText3d(message, getCoords.x, getCoords.y, getCoords.z + 1, 0.4, 4, r,g,b,a, false);
    });

    timeouter = alt.setTimeout(() => {
        alt.clearEveryTick(timeEverytick);
        alt.clearTimeout(timeouter);
    }, config.overHeadCharTime * 1000);

    const obj = {
        id: Math.random(),
        senderID: senderID,
        everyTick: timeEverytick,
        timeout: timeouter
    };
    headerTextArray.push(obj); 
}

// WIP
alt.on('syncedMetaChange', (entity, key, value) => {
    if (entity !== alt.Player.local) {
        return;
    }

    if(key !== 'player:permission' || value !== permissions) {
        return;
    }

    if(webview !== undefined) {
        alt.log("PERMISSION CHANGED TO : " + value);
        permissions = value;
        webview.emit('chat:setPermission', value, commands.commands);
    }
});

//RECEIVERS

export function sendMe(senderID, messageOBJ) {
    headText(messageOBJ.message, senderID.scriptID, messageOBJ.r, messageOBJ.g, messageOBJ.b, messageOBJ.a)
}

export function sendDo(senderID, messageOBJ) {
    headText(messageOBJ.message, senderID.scriptID, messageOBJ.r, messageOBJ.g, messageOBJ.b, messageOBJ.a)
}

export function doFix(message) {
    displayMessage(message);
}

export function pm(message) {
    displayMessage(message);
}

alt.on('keyup', (key) => {
    if(chatInitialized) {
        //Clicked on escape
        if(isChatOpen) {
            if(key === 27) {
                webview.emit('chat:input_state', false);
                hideChat();
            } else if (key === 38) {
                webview.emit('chat:keyPress', 'ArrowUp');
            } else if (key === 40) {
                webview.emit('chat:keyPress', 'ArrowDown');
            } else if (key === 13) {
                webview.emit('chat:keyPress', 'Enter');
            } else if (key === 33) {
                webview.emit('chat:keyPress', 'PageUp');
            } else if (key === 34) {
                webview.emit('chat:keyPress', 'PageDown');
            }
        }
        //OPEN CHAT
        if(!isChatOpen) {
            if(key === 84) {
                if(alt.Player.local.getMeta('chatAllowedOpen')) {
                    webview.emit('chat:input_state', true);
                    showChat();
                }
            }
        }  
    }
});

alt.on('webview:destroyAll', () => {
    if(webview) {
        webview.destroy()
        lib.showCursor(false);
    }
});

alt.on('hide:chat', () => {
    hideChat();
});
