import * as alt from 'alt-client';
import native from 'natives';
import lib from '../lib/lib.js';
import CameraHandler from '../lib/camera.js';
import { charCreation } from '../config/camera_preset.js';
import skin from '../lib/skin.js';


//TO LEAVE THE GAME -> native.restartGame()
const socialclub = native.scGetNickname();
const url = 'http://resource/client/browser/auth/index.html';
let webview;

export function getStatusResponse(response) {
    if(response === null) {return;}
    const discordData = alt.Discord.currentUser;

    webview.emit('auth/status', response)
    webview.emit('auth/discord', discordData)
}

export function interfaceStart(socialID, hwHash, hwHashEx, playerIP) {
    if(!webview) {
        webview = new alt.WebView(url);
    }
    //gets the client socialclub
    CameraHandler.cinematic('login'); // flying cinematic 
    //CREATE THE WEBVIEW TO HANDLE 
    webview.on('auth/ready', () => {readyToStart(socialID, hwHash, hwHashEx, playerIP)});
    webview.on('auth/register/requestRegister', requestRegister);
    //webview.on('closegame', core.closeGame());
    webview.on('auth/verifiedAddValue', verifiedAddValue);
    webview.on('auth/requestLogin', requestLogin);
    webview.on('auth/create/isClickerShown', isClickerShown)
    webview.on('auth/create/changeSex', changeSexSecondary)
    webview.on('auth/beginCharCreation', BeginPrepareChar)
    webview.on('auth/changeSex', changeSex)
    webview.on('auth/creation/setmod', setPedMod);
    webview.on('auth/creation/getDrawableTextures', getDrawable)
    webview.on('auth/creation/getPropsTextures', getProp);
    webview.on('auth/creation/clothes', setCloth);
    webview.on('auth/creation/props', setProp);
    webview.on('auth/creation/createChar', viewCreateChar);
    webview.on('auth/startSession', startSession);
    webview.on('auth:requestRecoverCode', requestRecoverCode);
    webview.on('auth:sendNewPassword', sendNewPassword);
};

function isClickerShown(index, isClickerShown) {
    if(isClickerShown) {
        CameraHandler.changeCinematicAngle(427.6,-802.0,30, -17, 0, 0, 2 / 6)
    } else {
        CameraHandler.changeCinematicAngle(charCreation[index].x,charCreation[index].y,charCreation[index].z, charCreation[index].rx, charCreation[index].ry, charCreation[index].rz, charCreation[index].timelapse)
    }
}

function BeginPrepareChar() {
    alt.emitServer('auth:prepareChar');
}

function changeSexSecondary(sex) {
    alt.emitServer("auth/create/changeSex", sex)
}

function changeSex(sexIndex) {
    alt.emitServer('auth:changeSex', sexIndex)
}

function setPedMod(type, data) {
    skin.setMod(type, data)
}

function getDrawable(componentID, drawable) {
    const textures = skin.getDrawableTexture(alt.Player.local.scriptID, componentID, drawable)
    webview.emit('auth/creation/getComponentTextures', componentID, textures)
}

function getProp(componentID, drawable) {
    const textures = skin.getPropTexture(alt.Player.local.scriptID, componentID, drawable)
    webview.emit('auth/creation/getPropsTextures', componentID, textures)
}

function setCloth(component, drawableid, textureid) {
    skin.setCloth(component, drawableid, textureid)
}

function setProp(component, drawableid, textureid) {
    skin.setProp(component, drawableid, textureid)
}

function viewCreateChar(charInfo) {
    const clothes = skin.getCloth(alt.Player.local.scriptID);
    const appearance = skin.getAppearance()
    const playerID = alt.getMeta('player:socialID')
    alt.emitServer('auth:createChar', charInfo, clothes, appearance, playerID);
    
}

function startSession(permission) {
    native.animpostfxStop("CamPushInMichael")
    const socialID = alt.getMeta('player:socialID')
    if(!alt.hasMeta('player:loggedIn')) {
        alt.setMeta('player:loggedIn', false)
    }
    alt.deleteMeta('auth:active')
    alt.emitServer('core:initSession', socialID, permission)
}

function requestRecoverCode(code) {
    alt.emitServer('auth:requestVerification', code)
}

function sendNewPassword(password) {
    const hashedPassword = alt.hash(password)
    const socialID = alt.getMeta('player:socialID')
    alt.emitServer('auth:changePassword', hashedPassword, socialID); 
}

export function changedPasswordSuccesfully(state) {
    webview.emit('auth:changedPasswordSuccesfully', state)
}

function requestRegister(register, discord) {
    //object that takes all main information of the user
    const hashedPassword = alt.hash(register.password)
    const data = {
        socialclub: socialclub,
        email: register.email,
        password: hashedPassword,
        discordid: discord.id,
        discordinfo: {
            name: discord.name,
            discriminator: discord.discriminator,
            avatar: discord.avatar
        }
    };

    const hashes = {
        hwHash: alt.getMeta('player:hwHash'),
        hwHashEx: alt.getMeta('player:hwHashEx'),
        socialID: alt.getMeta('player:socialID'),
        playerIP: alt.getMeta('player:playerIP'),

    };
    alt.emitServer('auth:requestRegister', data, hashes)
}
export function requestRegisterResponse(registerResponse) {
    if(!registerResponse[0] && !registerResponse[1]) {
        alt.setMeta('player:id', registerResponse[2]);
    }
    webview.emit('auth/register/emailExistance', registerResponse) 
}

function verifiedAddValue(value) {
    const socialID = alt.getMeta('player:socialID');
    alt.emitServer('auth:verifiedAddValue', value, socialID)
}

export function verifiedAddValueResponse(response) {
    webview.emit('auth/writtenCompletionStatus', response);
}

function requestLogin(password) {
    const socialID = alt.getMeta('player:socialID');
    const hashedPassword = alt.hash(password);

    alt.emitServer('auth:requestLogin', hashedPassword, socialID)
}

export function requestLoginResponse(response) {
    webview.emit('auth/authData', response)
}

export function prepareChar() {
    startcreate();
    webview.emit('auth/createChar');
}

export function createChar(hasCreated) {
    if(hasCreated) {
        const socialID = alt.getMeta('player:socialID')
        CameraHandler.destroyAllCams()
        alt.emitServer('core:initSession', socialID, 0);
    } else {
        //NOT CREATED YET
        webview.emit('auth/creation/errorCreatingChar')
    }
}

export function codeVerificationConfirmation(confirmation) {
    webview.emit('auth/codeVerificationConfirmation', confirmation)
}

function readyToStart(socialID, hwHash, hwHashEx, playerIP) {
    const discordData = alt.Discord.currentUser;
    alt.emitServer('auth:getStatus', socialID, hwHash, hwHashEx, playerIP, discordData);
    
    alt.setMeta('auth:active', true)
    alt.setMeta('player:hwHash', hwHash)
    alt.setMeta('player:hwHashEx', hwHashEx)
    alt.setMeta('player:socialID', socialID)
    alt.setMeta('player:playerIP', playerIP)

    native.animpostfxStop("CamPushInMichael")
    native.animpostfxPlay("CamPushInMichael", 0, true)
    alt.setMeta('player:loggedIn', false);
    lib.showCursor(true);
    webview.focus();
    alt.toggleGameControls(false);
}

alt.onServer('auth/InternalError', (errCode) => {
    webview.emit('auth/PageError', errCode)
})
//Show notification of user banned and kick
alt.onServer('player:userbanned', (banInformation) => {
    webview.emit('auth/showBan', banInformation)
    alt.setTimeout(() => {
        alt.emitServer('player:kick', banInformation.reason)
    }, 5000);
})

async function startcreate() {
    native.setEntityHeading(alt.Player.local.scriptID, 180)
    CameraHandler.destroyCinematic()
    skin.beginMod(alt.Player.local.scriptID)
    //+ ->    <- -
    //Coordinates for the center camera
    //427.6,-802.0,30, -17, 0, 0
    CameraHandler.changeCinematicAngle(427.6,-802.0,30.050, -16, 0, 0)
    //to get clothes
    const availableCloth = await skin.getClothNumber(alt.Player.local.scriptID)
    webview.emit('auth/creation/getComponentDrawables', availableCloth)
}

export function destroy() {
    if(webview) {
        webview.destroy();
        lib.showCursor(false);
        alt.toggleGameControls(true);
    }
}

alt.on('keyup', (key) => {
    //user clicked on enter
    if(alt.hasMeta('auth:active') && webview !== null) {
        if(key === 13) {
            webview.emit('auth/enterclicked')
        }
    }
})

alt.on('webview:destroyAll', () => {
    if(webview) {
        webview.destroy()
    }
});
