import * as alt from "alt";
import * as mysql from './services/mysql/mysql.mjs';
import { initializeWXClockEngine } from './scripts/weather/weather.mjs';
import { initializeServerVehicles } from './scripts/vehicles/vehicle.mjs';

//PLAYER
import './player/playerSession.mjs'; //SCRIPT
import './player/functions/functions.mjs'; //SCRIPT

//EVENTS
import './events/events.mjs'; //EVENTS
import './events/onDisconnect.mjs'; //EVENTS

/////// EXTENDS ///////////////
import './extends/vehicle.mjs'; //EXTENDS
import './extends/player.mjs'; //EXTENDS
import './extends/status.mjs'; //EXTENDS

/////////////////////////////////////////////////////////////////////////////////
//SCRIPTS --------------------------------------------------------------------///
/////////////////////////////////////////////////////////////////////////////////

// INVENTORY //
import './extends/inventory.mjs'

// VEHICLES //
import './scripts/vehicles/vehicle.mjs'; //SCRIPT

// WEATHER //
import './scripts/weather/weather.mjs'; //SCRIPT

// CHAT //
import './scripts/chat/chat.mjs'; //SCRIPT
import './scripts/chat/voice-chat.mjs'; //SCRIPT

// AUTH //
import './scripts/auth/auth.mjs'; //SCRIPT

// TOOLS //
import './scripts/tools/noclip.mjs'; //SCRIPT

// SYSTEMS //
import './scripts/systems/admin.mjs'; //SCRIPT

// STATUS //


//HTTP SERVER
import './services/www/http.mjs'

import items from './scripts/inventory/items.mjs';

//SERVER INITIALIZATION
mysql.startMysql();
initializeServerVehicles();
initializeWXClockEngine();
alt.setSyncedMeta('items', items);

alt.setMeta('server:onlinePlayers', 0);

alt.on('playerConnect', (player) => {
    alt.setMeta('server:onlinePlayers', alt.getMeta('server:onlinePlayers') + 1);
    alt.emitClient(player, 'onConnect', player.socialId, player.hwidHash, player.hwidExHash, player.ip);
    player.spawn(0, 2, 0, 0);
});