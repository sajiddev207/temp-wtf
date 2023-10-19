"use strict";
const nodemailer = require("nodemailer");
const { apiError } = require('../utils/globalFunctions')
async function sendMail(req, res, data) {
    console.log('data_____Send__Mail', data);
    let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
    let mailObj = {
        from: '"WTF " <sajiddev207@example.com>',
        to: data && data.email ? data.email : '', // list of receivers
        subject: "OTP", // Subject line
        text: "Hello world?", // plain text body
        html: `<b>${data.otp} OTP valid for only 10 minutes</b>`, // html body
    }
    transporter.sendMail(mailObj, (error, data) => {
        if (error) {
            console.log('__________', error);
            let returnData = {
                message: "****",
                error: true,
                data: null
            }
            return returnData;
            // return apiError(req, res, returnData);
        }
        console.log("Message sent: %s", data.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(data));
    });
    // let info = await transporter.sendMail({
    //     from: 'WTF',
    //     to: data && data.email ? data.email : '', // list of receivers
    //     subject: "OTP", // Subject line
    //     text: "Hello world?", // plain text body
    //     html: `<b>${data.otp} OTP valid for only 10 minutes</b>`, // html body
    // });
    // console.log('info________', info);
    // console.log("Message sent: %s", info.messageId);
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

module.exports = {
    sendMail: sendMail
}
