
import * as alt from 'alt-client';
import lib from '../lib/lib.js';

import * as chat from '../scripts/chat.js';
import * as auth from '../scripts/auth.js';
import * as vehicle from '../scripts/vehicle.js';
import * as inventory from '../scripts/inventory.js';
import * as admin from '../scripts/adminmenu.js';
import * as base from '../scripts/base.js';
//----------------------------------------
//Admin menu
alt.onServer('admin:create', admin.interfaceStart); //WEBVIEW


// Base
alt.on('base:notification', base.sendNotification);
alt.onServer('base:notification', base.sendNotification);
alt.onServer('base:begin', base.interfaceStart);
alt.onServer('base:playsound', base.playSound);

// Chat 
alt.onServer('chat:begin', chat.interfaceStart);
alt.onServer('chat:proximityChat', chat.displayMessage);
alt.onServer('chat:toggleAdmin', chat.toggleAdmin);

alt.onServer('chat:me', chat.sendMe);
alt.onServer('chat:do', chat.sendDo);
alt.onServer('chat:dofix', chat.doFix);
alt.onServer('chat:pm', chat.pm);

//----------------------------------------
//AUTH
alt.on('client:begin_client', auth.interfaceStart); //WEBVIEW
alt.onServer('auth:getStatus', auth.getStatusResponse);
alt.onServer('auth:requestRegister', auth.requestRegisterResponse);
alt.onServer('auth:verifiedAddValue', auth.verifiedAddValueResponse);
alt.onServer('auth:requestLogin', auth.requestLoginResponse);
alt.onServer('auth:prepareChar', auth.prepareChar);
alt.onServer('auth:createChar', auth.createChar);
alt.onServer('auth:destroy', auth.destroy);
alt.onServer('auth:codeVerificationConfirmation', auth.codeVerificationConfirmation);
alt.onServer('auth:changePasswordSuccess', auth.changedPasswordSuccesfully);

//----------------------------------------
//CORE
alt.onServer('core:fade', lib.fade);


//----------------------------------------
//VEHICLE
alt.onServer('vehicle:spawnCompleted', vehicle.completeSpawn);
alt.onServer('vehicle:repair', vehicle.repairVehicle);

//-----------------------------------------
//INVENTORY
alt.onServer('inventory:begin', inventory.interfaceStart); //WEBVIEW
alt.onServer('inventory:requestItem', inventory.requestNewItem);
alt.onServer('inventory:updateInventory', inventory.loadInventory)