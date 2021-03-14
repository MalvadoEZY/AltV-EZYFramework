import * as alt from 'alt';
import * as mysql from '../services/mysql/mysql.mjs';

alt.Player.prototype.LoadInventory = async function LoadInventory(socialID) {
    mysql.query("SELECT * FROM inventory WHERE ownerID = " + socialID + " LIMIT 1").then(([result, fields]) => {
        //fetch all items
        const dbInventory = JSON.parse(result[0].inventory);

        this.setMeta('inventory:content', dbInventory);
        alt.emit('inventory:update');
    });
}

alt.Player.prototype.saveInventory = async function saveInventory() {
    const currentInventory = this.getMeta('inventory:content');
    mysql.query("UPDATE inventory SET inventory = '" + JSON.stringify(currentInventory) + "' WHERE ownerID = " + this.ownerid + "").then(([result, fields]) => {
        //fetch all items
        alt.log("INVENTORY SAVED ! " + JSON.stringify(result))
    });
}



//COMMANDS
///giveitem initialization
alt.Player.prototype.giveitem = async function giveitem(id, quantity, durability) {
    let uniqueItem = {
        id: 0, 
        quantity: 0, 
        durability: false
    }

    if(id) {uniqueItem.id = parseInt(id)};
    if(quantity) {uniqueItem.quantity = parseInt(quantity)};
    if(durability) {uniqueItem.durability = parseInt(durability)};
    alt.log("SERVER WILL REQUEST TO THE CLIENT FOR A ITEM")
    
    alt.emitClient(this, 'inventory:requestItem', uniqueItem)

}
