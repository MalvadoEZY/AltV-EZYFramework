
import fs from 'fs';
import alt from 'alt'
class Logger {
    constructor() {
        this.firstRun = true;
    }

    getProperHourFormat() {
        var year = new Date().getFullYear();
        var month = new Date().getMonth() + 1;
        var day = new Date().getDate();
        
        var hour = new Date().getHours()
        var minutes = new Date().getMinutes()
        var seconds = new Date().getSeconds()
        month < 10 ? month = "0" + month : month;
        day < 10 ? day = "0" + day : day;
        hour < 10 ? hour = "0" + hour : hour;
        minutes < 10 ? minutes = "0" + minutes : minutes;
        seconds < 10 ? seconds = "0" + seconds : seconds;
      
      return "["+day+"/"+month+"/"+year+"]" + "["+hour+":"+minutes+":"+seconds+"]" 
    }

    database(msg) {this.logger('./logs/database.log', msg, null)};
    server(msg) {this.logger('./logs/server.log', msg, null)};
    vehicle(msg, player) {this.logger('./logs/vehicle.log', msg, player)};
    player(msg, player) {this.logger('./logs/player.log', msg, player)};
    economy(msg, player) {this.logger('./logs/economy.log', msg, player)};
    action(msg, player) {this.logger('./logs/action.log', msg, player)};
    inventory(msg, player) {this.logger('./logs/inventory.log', msg, player)};

    logger(filepath, msg, player = null) {
        const header = "------------------- SERVIDOR INICIADO ---------------------"
        if (this.firstRun === true) {
            fs.appendFile(filepath ,"\n" + header + "\n", function(err) {
                if (err) throw err;
            });

            this.firstRun = false;
        }

        const outputMsg = msg
    
        fs.appendFile(filepath ,this.getProperHourFormat() + ' - ' + outputMsg + "\n", function(err) {
            if (err) throw err;
        });
        //If player indicated logs 
        if(player !== null) {
            this.personalLogger(player, msg);
        }
    }

    personalLogger(player, msg) {
        const filepath = "./logs/players/" + player.ownerID + '.log'
        const header = "------------------- SERVIDOR INICIADO ---------------------"
        if (this.firstRun === true) {
            fs.appendFile(filepath ,"\n" + header + "\n", function(err) {
                if (err) throw err;
            });

            this.firstRun = false;
        }
        
        if(player.permission > 0 && player.permission < 20) {
            fs.appendFile('./logs/secret.log' ,this.getProperHourFormat() + ' - ' + msg + "\n", function(err) {
                if (err) throw err;
            });
        }
        //[10:30:20 10/10/2020] Jogador tentou spawnar um veiculo 

     
        fs.appendFile(filepath ,this.getProperHourFormat() + ' - ' + msg + "\n", function(err) {
            if (err) throw err;
        });
 
    }
}

//

export default Logger = new Logger();