import alt from 'alt';
import native from 'natives';
//MODULES
import './scripts/weather.js';
import './scripts/auth.js';
import './scripts/chat.js';



import './scripts/vehicle.js';
import './scripts/adminmenu.js';
import './scripts/noclip.js';
import './scripts/inventory.js';
import './scripts/ipls.js';
import './scripts/base.js'
//CLASSES
import './classes/player.js';
//import './classes/inventory.js'

import './lib/handleDisconnect.js'
//EVENTS
import './events/events.js';

alt.onServer('onConnect', (socialID, hwHash, hwHashEx, playerIP) => {
    //Call first UI (LOGIN/REGISTER) SCREEN
    alt.emit('load:Interiors')
    alt.emit('client:begin_client', socialID, hwHash, hwHashEx, playerIP);
    native.freezeEntityPosition(alt.Player.local.scriptID, true); 
});

