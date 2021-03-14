import mysql from 'mysql';
import * as alt from "alt";
import logger from '../log/log.mjs'
//state of the mysql
export let state;

let reconnectingInterval;

alt.setMeta('mysql:state', false)

const config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database':'ocidental1592020_db'
}; 

let db;

export function startMysql() {
    db = mysql.createConnection(config);
    db.connect((err) => {
        if(err) {
            logger.database("Base de dados nao está a responder!");
            state = false;
            db.destroy()
            alt.setTimeout(() => {
                startMysql()
            }, 5000);
        } else {
            alt.log("\u001b[32mBase de dados inicializada! \u001b[0m")
            logger.database("Base de dados inicializada!")
            if(reconnectingInterval) {
                alt.clearInterval(reconnectingInterval)
            }
            state = true; 
        }
        alt.setMeta('mysql:state', state)
    });

    db.on('error', (error) => {
        logger.server("Base de dados foi a baixo... A expulsar todos os jogadores")
        for (let player of alt.Player.all) {
            player.kick("Erro interno no servidor.. Tente novamente !")
            player.log("Expulso devido a erro interno do servidor")
        }
        startMysql()
    })
}
export function query(query) {
    //Checks mysql connection before returning the PROMISE
    return new Promise(function(resolve, reject) {
        var t = new Date().getTime(); 
            db.query(query, function (err, result, field) {
                if(err) {
                    reject(err)
                } 
                resolve([result, field]);
                  
            })
            
        var s = new Date().getTime();
        var time = s - t
        var convTime = time / 1000

        if(time > 100) {
            logger.database("QUERY: [" + query + "] levou " + convTime + " para executar!!")
        } else if (time > 50) {
            logger.database("QUERY: [" + query + "] levou " + convTime + "s para executar!!")
        }
    })
};

