import alt from 'alt-server';

alt.on('playerDisconnect', onPlayerDisconnect); 

function onPlayerDisconnect(player) {
    //If player constructor is not created yet
    if(player.charid) {
        player.save();
        player.saveVehicles();
        player.saveInventory();

        const startedTime = player.getMeta('player:sessionTime')
        const endTime = new Date().getTime();
        const time = (endTime - startedTime) / 60000; //Conversion to minutes

        player.log("Disconectou-se com " + time.toFixed(2) + " minutos de sessão")
    } else {
        player.log("Um utilizador saiu que ainda nao tinha entrado no personagem")
    }
}
