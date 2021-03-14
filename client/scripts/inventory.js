import * as alt from 'alt-client';
import * as native from 'natives';

import lib from '../lib/lib.js';

const url = 'http://resource/client/browser/inventory/index.html';
let webview;
let existedItems;
let inventoryConfig;
let inventoryIsLoaded = false;
let inventoryOpen = false;

let weight = 0;

export function interfaceStart(items, config) {
    if(!webview) {
        webview = new alt.WebView(url);
    }
    existedItems = items;
    inventoryConfig = config;

    webview.on('inventory:ready', initializeInventory);
    webview.on('inventory:update', inventoryUpdate)
}

function initializeInventory() {
    webview.emit('inventory:config', inventoryConfig, existedItems)

    inventoryIsLoaded = true
}

export function loadInventory(userItems) {
    // FETCH ITEMS FROM DATABASE AND LOAD ON THE CHARACTER
    if(!userItems) {
        alt.emit('base:notification', 1, "Ocorreu um erro ao tentar abrir o teu inventario !");
        return;
    }
    let shownItems = [];
    let tempWeight = 0;
    for (let i = 0; i < userItems.length; i++) {
        let itemInfo = existedItems.find(o => o.id === userItems[i].id);
        alt.log("CURRENT USERITEM: " + userItems[i])
        const weight = userItems[i].quantity * itemInfo.weight;
        tempWeight = tempWeight + weight;

        const object = {
            data: itemInfo,
            quantity: userItems[i].quantity,
            durability: userItems[i].durability
        }
        
        shownItems.push(object);
    }

    alt.Player.local.setMeta('inventory:server_inventory', userItems);
    alt.Player.local.setMeta('inventory:weight', tempWeight);
    webview.emit('inventory:loadInventory', shownItems);
    webview.emit('inventory:weight', tempWeight)
}

//force update the inventory
export function inventoryUpdate(array) {
    alt.Player.local.setMeta('inventory:content', array);
    
}


export function requestNewItem(item) {
    const itemInfo = existedItems.find(o => o.id === item.id);
    const userItems = alt.Player.local.getMeta('inventory:server_inventory');
    const userWeight = alt.Player.local.getMeta('inventory:weight');
    alt.log("REQUESTED " + JSON.stringify(itemInfo))

    if(!itemInfo) return;
    alt.log("REQUEST... " + JSON.stringify(userItems))
    if(!userItems) return;

    const futureWeight = (itemInfo.weight * item.quantity) + userWeight;
    const max_weight = inventoryConfig.max_weight * 1000;
    alt.log("MAX WEIGHT: " + max_weight)
    alt.log(itemInfo.weight + " * " + item.quantity + " = " + futureWeight + " // " + userWeight)
    alt.log("REQUESTED 0.2  WEIGHT ")
    //Check if user gonna have space to store the new item requested
    if(futureWeight > max_weight) {
        alt.emit('base:notification', 1, "Nao tens espaço suficiente !");
        alt.log("NO ENOUGHT SPACE")
        return;
    } else {
        alt.emit('base:notification', 0, "Peso futuro: " + futureWeight / 1000 + 'kg');
    }

    alt.log("REQUESTED1 " + JSON.stringify(userItems))

    // TUDO BUGADO
    let arrayOfItems = [];
    for (let i = 0; i < userItems.length; i++) {
        if(userItems[i].id === item.id) {
            alt.log("REQUESTED2")
            const totalFutureQuantity = item.quantity + userItems[i].quantity;
            if(totalFutureQuantity < itemInfo.stack ) {
                const quantityToDeposit = userItems[i].quantity + item.quantity;
                alt.emitServer('inventory:setquantity', i, quantityToDeposit)
            } else {
                let ammountToDeposit = item.quantity;  
                const valuePreseted = ammountToDeposit
                alt.log("REQUESTED3 " + valuePreseted + " / " + itemInfo.stack + " = " + Math.ceil(valuePreseted / itemInfo.stack))
                for (let i = 0; i < Math.ceil(valuePreseted / itemInfo.stack); i++) {
                    if(ammountToDeposit > itemInfo.stack) {
                        let newItemObject = {
                            id: item.id,
                            quantity: item.quantity,
                            durability: item.durability,
                            equipped: false
                        }
              
                        newItemObject.quantity = itemInfo.stack;
                        arrayOfItems.push(newItemObject);
                        alt.log("REQUESTED4 " + ammountToDeposit);
                        ammountToDeposit = ammountToDeposit - itemInfo.stack;
                        
                    }   
                }
                alt.emitServer('inventory:setitem', arrayOfItems)
            }
        
        }
    }
};
//webview.emit('inventory:additem', requestedItem);

alt.on('keyup', (key) => {
    if(inventoryIsLoaded) {
        //Clicked on escape
        if(key === 113) {
            inventoryOpen = !inventoryOpen
            webview.emit('inventory:toggle')
            if(inventoryOpen) {
                alt.emitServer('inventory:update') //Force inventory update
                alt.Player.local.setMeta('chatAllowedOpen', false);
                alt.emit('hide:chat');
                webview.focus()
                lib.showCursor(true);
            } else {
                alt.Player.local.setMeta('chatAllowedOpen', true);
                lib.showCursor(false);
                webview.unfocus()
            }
        }
    }
});

alt.setInterval(() => {
    if(webview !== undefined) {
        if(alt.hasMeta('player:getStatus') && alt.hasMeta('player:getHealth')) {
            const health = alt.getMeta('player:getHealth');
            const status = alt.getMeta('player:getStatus');
            const energy = alt.getStat('stamina')
            const data = {
                health: health - 100,
                water: status.thrist,
                food: status.hunger,
                energy: energy
            }
        

            webview.emit('status:setStatus', data)   
        }
    }
}, 1000);

alt.on('webview:destroyAll', () => {
    if(webview) {
        webview.destroy()
    }
});