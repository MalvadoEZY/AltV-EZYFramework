import alt from 'alt-server'
//chat command trigger
export function giveitem(player, args) {
    const splitArgs = args.split(" ");
    player.giveitem(...splitArgs); 
}

export function setitem(player, arrayOfItems) {
    const content = player.getMeta('inventory:content');
    const newItemList = content.concat(arrayOfItems);
    player.setMeta('inventory:content', newItemList)
    update(player);
}

export function setquantity(player, index, quantity) {
    const content = player.getMeta('inventory:content');
    content[index].quantity = quantity 
    player.setMeta('inventory:content', content);
    update(player);
}

export function update(player) {
    const inventory = player.getMeta('inventory:content')
    if(!inventory) return;
    alt.emitClient(player, 'inventory:updateInventory', inventory);
}