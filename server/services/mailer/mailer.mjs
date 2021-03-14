import alt from 'alt';
import nodemailer from 'nodemailer';
import mailercred from './crendts.mjs';
import config from '../../config/config.mjs';

class mailerHandler {
    constructor() {
        this.mailer;
        this.config = {
            service: 'gmail',
            user: mailercred.user,
            pass: mailercred.pass,
        };
  
    };

    create() {
        this.mailer = nodemailer.createTransport({
            service: this.config.service,
            auth: {
                user: this.config.user,
                pass: this.config.pass
            },
        })
    };

    //sends a email to the target !
    sendMail(target, subject, email) {
            const mailOptions = {
                from: `${config.SERVERNAME}` + '<this.config.user>',
                to: target,
                subject: subject,
                html: email
            };
    
            this.mailer.sendMail(mailOptions, (error, info) => {
                if(error) {
                    return false;
                } else {
             
                    alt.log("Email enviado com sucesso ! para  " + target);
                    return true;
                };
            });
     
    };

    //recover the password on the login screen
    recoverPassword(code, email) {

            try {
                this.create();
                //target / type
                this.sendMail(email, 'Recuperação de password', 
                '<h1>Codigo de recuperaçao:</h1><h2>'+`${code}`+'</h2>'
                );
                //change login page
                return true;
            
            } catch (error) {
                utility.log("ERROR: Trying to send recover email -> " + error)
                return false;
            }

    };


    getcode() {
        return this.code;
    }
};

export default mailerHandler = new mailerHandler();