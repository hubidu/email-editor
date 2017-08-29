const fs = require('fs')
const nodemailer = require('nodemailer');
const htmlToText = require('nodemailer-html-to-text').htmlToText;

const config = {
    "host": "mailload.mailman.check24.de",
    "port": 25,
    "secure": false,
    "requireTLS": false,
    "ignoreTLS": true
}


const transportOptions = config;
const transporter = nodemailer.createTransport(transportOptions);
transporter.use('compile', htmlToText());

function send(email) {
    return new Promise((resolve, reject) => {
        transporter.sendMail(email, (error, sendReport) => {
            if (error) return reject(`Failed to send email '${email.subject}' - ${error.toString()}`)

            return resolve({ email, sendReport });
        });
    });
}

const htmlFile = process.argv[2]

send({
    to: 'hubidu27@gmail.com, stefan.huber@check24.de',
    from: 'stefan.huber@check24.de',
    html: fs.readFileSync(htmlFile),
    subject: 'price-check email'
})