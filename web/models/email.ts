import * as aws from "aws-sdk";

export class Email {
    to: string;
    sender: string;
    subject: string;
    message: string;

    constructor(to: string, subject: string, message: string, sender?: string) {
        this.to = to;
        this.sender = sender ? sender : "hello@autohub.io";
        this.subject = subject;
        this.message = message;
    }

    send(cb: ErrorCallback) {        
        let ses = new aws.SES();
        let params = {
            Source: this.sender, 
            Destination: { ToAddresses: [ this.to ] },
            Message: {
                Subject: {
                    Data: this.subject
                },
                Body: {
                    Text: {
                        Data: this.message,
                    }
                }
            }
        }

        ses.sendEmail(params, (err, data) => {
            console.log('Email sent with error:' + err);
            cb(err);
        });
    }   
}