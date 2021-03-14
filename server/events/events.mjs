import * as alt from 'alt-server';

import * as vehicle from '../scripts/vehicles/vehicle.mjs';
import * as auth from '../scripts/auth/auth.mjs';
import * as playerSession from '../player/playerSession.mjs';
import * as chat from '../scripts/chat/chat.mjs';
import * as pFunctions from '../player/functions/functions.mjs';
import * as noclip from '../scripts/tools/noclip.mjs';
import * as inventory from '../scripts/inventory/inventory.mjs'
//EVENTS
alt.on('playerLeftVehicle', vehicle.onPlayerLeftVehicle);
alt.on('playerEnteredVehicle', vehicle.playerEnteredVehicle);

//PLAYER
alt.onClient('player:savePosition', (player) =>{player.save()});
alt.onClient('player:setPermission', (player, playerID, permission) => {player.setPermission(playerID, permission)});
alt.onClient('player:tp', (player, xOrChar, y, z) => {player.teleport(xOrChar, y, z)});
alt.onClient('player:tpme', (player, charID) => {player.teleportMe(charID)});
alt.onClient('player:revive', (player, charID) => {player.revive(charID)});
alt.onClient('player:noclip', noclip.handleToggle);

alt.onClient('player:ban', pFunctions.banUser);
alt.onClient('player:kick', pFunctions.kickUser);

//  --- >  INVENTORY  < ---
//INBOUND

alt.onClient('inventory:giveitem', inventory.giveitem);

//OUTBOUND

alt.onClient('inventory:setquantity', inventory.setquantity);
alt.onClient('inventory:setitem', inventory.setitem);

alt.onClient('inventory:update', inventory.update);

//--------------------------------
//VEHICLES
alt.onClient('vehicle:updateKilometers', vehicle.updateKilometer);
alt.onClient('vehicle:flipVehicle', vehicle.flipClosestVehicle);
alt.onClient('vehicle:spawnVehicle', vehicle.spawnVehicle);
alt.onClient('vehicle:repair', vehicle.repairVehicle);
alt.onClient('vehicle:updateStats', vehicle.updateStats);
alt.onClient('vehicle:deleteVehicle', vehicle.deleteVehicle);
alt.onClient('vehicle:goto', vehicle.goto);
alt.onClient('vehicle:bring', vehicle.bring);

//AUTH
alt.onClient('auth:getStatus', auth.getStatus);
alt.onClient('auth:requestRegister', auth.requestRegister);
alt.onClient('auth:verifiedAddValue', auth.verifiedAddValue);
alt.onClient('auth:requestLogin', auth.requestLogin);
alt.onClient('auth:prepareChar', auth.prepareChar);
alt.onClient('auth:createChar', auth.createChar);
alt.onClient('auth:changeSex', auth.changeSex);
alt.onClient('auth:requestVerification', auth.requestVerification);
alt.onClient('auth:changePassword', auth.changePassword);

//playerSession
alt.onClient('playerSession:start_hud', playerSession.startGUI);

//STATUS
alt.onClient('player:setStatus', (player, statusOBJ) =>{player.setStatus(statusOBJ)});
alt.onClient('player:notify', (player, ...args) => {player.notify(...args)});

// ADMIN MENU
alt.onClient('adminmenu:reloadplayer', pFunctions.refreshPlayers);
alt.onClient('adminmenu:checkplayer', pFunctions.AdminMenuLoad);
alt.onClient('player:revivestatus', pFunctions.reviveStatus);
alt.onClient('GiveWeapon', (player, hashKey) => {player.giveWeapon(hashKey, 100, true)});

//CHAT
alt.onClient('chat:toggleAdmin', chat.toggleAdmin);
alt.onClient('chat:sendmessage', chat.sendMessage);

alt.onClient('chat:me', chat.sendMe);
alt.onClient('chat:do', chat.sendDo);
alt.onClient('chat:goto', chat.handleGoto);
alt.onClient('chat:bring', chat.handleBring);
alt.onClient('chat:error', chat.sendPrivateMsg);
alt.onClient('chat:pm', chat.sendPrivateMsg);