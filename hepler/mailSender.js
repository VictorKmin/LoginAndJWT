const nodemailer = require('nodemailer');
const email = require('../constants/emailParams').email;
const pass = require('../constants/emailParams').pass;

module.exports = (userMail, userName, token) => {

    const msg = `http://localhost:3000/auth/setnewpass?token=${token}`;

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: email ,
            pass: pass
        }
    });

    let mailOptions = {
        from: '"Зміна паролю" <simstomat@gmail.com>',
        to: userMail,
        subject: 'Тема повідомлення',
        text: `Якийсь текст`,
        html: msg
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) throw new Error(error.message);
        console.log('Mail Sent');
    });
};