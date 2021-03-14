export default {
    items: [
        {
            id: 1, // id do item, necessario ser diferente SEMPRE !
            name: "money", // identificador *NOME SIMPLES/ INGLÊS*
            label: "Dinheiro", //Nome visivel
            description: "Usado par a comprar coisas", // descrição do item 
            weight: 0.25, // peso em gramas
            stack: 2500, //Stack por slot
            drop_prop: "", //Nome do prop do item que irá apareçer no chau depois de dropado
            type: "wealth", // Tipo de item | wealth, common, uncommon, rare, drugs, clothes, weapons, especial
            durability: false, //Durabilidade true ou false
            consumable: false, // Se o item pode ser consumido
            droppable: true, // Se o item pode ser dropado
            tradable: true, // Se o item pode ser trocado com outros jogadores
            equipable: false, // Se o item pode se equipado
            craftable: false, // Se o item pode ser craftado
        }

    ]
}