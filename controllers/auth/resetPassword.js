const nodemailer = require('nodemailer');
module.exports = (req, res) => {

    //TODO отримати мило з формочки

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'simstomat@gmail.com',
            pass: //TODO
        }
    });

    let mailOptions = {
        from: '"Сімейна стоматологія" <simstomat@gmail.com>',
        to: 'victor.fzs10@gmail.com',
        subject: 'Тема повідомлення',
        text: `Якийсь текст`,
        html: '<b>http://localhost:3000</b>'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Mail Sent');
        console.log(info);
    });
};