import * as alt from 'alt'

alt.Player.prototype.sethunger = async function sethunger(value) {
    if(this.hasMeta('player:status')) {
        const status = JSON.parse(this.getMeta('player:status'));
        
        const newHunger = status.hunger = value;
        this.setMeta('player:status', newHunger);
    }
}

alt.Player.prototype.setthrist = async function setthrist(value) {
    if(this.hasMeta('player:status')) {
        const status = JSON.parse(this.getMeta('player:status'));
        
        const newHunger = status.setthrist = value;
        this.setMeta('player:status', newHunger);
    }
}

alt.Player.prototype.setStatus = async function setStatus(OBJ) {
 

    if(this.hasMeta('player:status')) {
        this.setMeta('player:status', OBJ)
        alt.emitClient(this, 'player:setStatus', OBJ)
    }
}

