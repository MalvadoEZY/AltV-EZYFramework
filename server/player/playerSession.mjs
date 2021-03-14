import * as alt from 'alt-server';
import chatCommands from '../scripts/chat/commands/commands.mjs'
//MODULES
import * as Weather from '../scripts/weather/weather.mjs';
import config from '../config/config.mjs';
import itemList from '../scripts/inventory/items.mjs'


alt.onClient('core:initSession', playerSession);

//SERVER INIT FUNCTION
async function playerSession(player, socialID, permissions) {
    alt.emitClient(player, 'auth:destroy');
    alt.emitClient(player, 'core:fade', true);
    const charInit = await player.LoadCharacter(socialID, permissions);
    const playerInventory = await player.LoadInventory(socialID);
    const weatherInit = await Weather.initPlayer(player)

    Promise.all([charInit, weatherInit, playerInventory]).then((results) => {
        player.setSyncedMeta('player:loggedIn', true);
        player.log('Jogador entrou com sucesso na sessão na posição x:' + player.pos.x + ' y:' + player.pos.y + ' z:' + player.pos.z);
        alt.emitClient(player, 'player:createChar', charInit);
    });
}


export function startGUI(player) {
    alt.emit('voice:begin', player);
    alt.emitClient(player, 'chat:begin', player.rank, chatCommands);
    alt.emitClient(player, 'baseUI:begin');
    alt.emitClient(player, 'inventory:begin', itemList.items, config.inventory)
    alt.emitClient(player, 'base:begin')
}