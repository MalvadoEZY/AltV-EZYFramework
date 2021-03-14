import * as alt from 'alt';

export const userRank = {
    PLAYER: 1, //Jogador
    HELPER: 2, //Suporte
    TRIAL_GAMEMASTER: 3, // TRIAL GAMEMASTER
    GAMEMASTER: 4, // GAMEMASTER
    ADMINISTRATOR: 10, // ADMINISTRATOR
    FACTION_COORDINATOR: 20, // COORDINATOR
    HEADADMIN: 30, // HEADADMIN
    DEVELOPER: 50 // DEVELOPER
}

function isPermitted(playerRank, rankRequested) {
    if(playerRank >= rankRequested) {
        return true;
    }
    return false;
}

export function hasPermission(player, rankRequested) {
    return isPermitted(player.rank, rankRequested)
}