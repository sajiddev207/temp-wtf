const Joi = require('joi')
const Jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User, Product } = require('../db/index')
const { apiSuccess, apiError } = require('../utils/globalFunctions')
const serviceMail = require("../services/serviceMail");
const MANAGER_SECRET = process.env.MANAGER_SECRET;
const ADMIN_SECRET = process.env.ADMIN_SECRET;
const asyncRedis = require("async-redis");
const client = asyncRedis.createClient({
    host: '127.0.0.1',
    port: '6379'
});
const userRegister = async (req, res) => {
    const userValidSchema = Joi.object({
        email: Joi.string().email({ tlds: { allow: false } }),
        password: Joi.string().required(),
        confirmPassword: Joi.string().required(),
        userType: Joi.string().valid("ADMIN", "MANAGER"),
    })
    const validateUserData = userValidSchema.validate(req.body, {
        abortEarly: true
    })
    let returnData = {}
    if (validateUserData && validateUserData.error) {
        returnData = {
            message: validateUserData.error.details[0].message.replace(/\"/g, ""),
            error: true,
            data: null
        }
        return apiError(req, res, returnData);

    }
    const { email, password, confirmPassword, userType } = req.body
    if (password !== confirmPassword) {
        returnData = {
            message: "Password and confirm password are different",
            error: true,
            data: null
        }
        return apiError(req, res, returnData);

    }
    let alreadyUser = await User.findOne({ email: email, userType: userType })
    if (alreadyUser) {
        returnData = {
            message: "User already exist",
            error: true,
            data: null
        }
        return apiError(req, res, returnData);
    }
    let token = "";
    let possibl = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (let i = 0; i < 40; i++) {
        token += possibl.charAt(Math.floor(Math.random() * possibl.length));
    }
    let otp = "";
    let possible = "0123456789";
    for (let i = 0; i < 4; i++) {
        otp += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    let mailData = {
        email: req.body.email,
        otp: otp,
    }
    let saveData = {
        ...req.body,
        otp: otp
    }
    await serviceMail.sendMail(req, res, mailData);
    client.set('OTP_' + token, JSON.stringify(saveData),
        'EX', 600
    )
    returnData = {
        message: "Otp sent to email",
        error: false,
        data: token
    }
    return apiSuccess(req, res, returnData);
}

const validateOtp = async (req, res) => {
    const userValidSchema = Joi.object({
        token: Joi.string().required(),
        otp: Joi.string().required(),
    })
    const validateUserData = userValidSchema.validate(req.body, {
        abortEarly: true
    })
    let returnData = {}
    if (validateUserData && validateUserData.error) {
        returnData = {
            message: validateUserData.error.details[0].message.replace(/\"/g, ""),
            error: true,
            data: null
        }
        return apiError(req, res, returnData);

    }
    let { token, otp } = req.body;
    let redisData = await client.get("OTP_" + token)
    let redisFinalData = JSON.parse(redisData)
    console.log('redisData_______', redisFinalData);
    if (redisFinalData === null) {
        returnData = {
            message: "OTP expired...",
            error: true,
            data: null
        }
        return apiError(req, res, returnData);
    }
    if (redisFinalData.otp === otp) {
        let saveDataReq = {
            email: redisFinalData.email,
            password: redisFinalData.password,
            userType: redisFinalData.userType,
        }
        let saveDataRes = await User.create(saveDataReq);
        if (saveDataRes && saveDataRes._id) {
            client.del("OTP_" + token)
            let secretKey = saveDataRes && saveDataRes.userType && saveDataRes.userType == "MANAGER" ? MANAGER_SECRET : ADMIN_SECRET;
            let userObj = {
                userId: saveDataRes._id,
                userType: saveDataRes.userType
            }
            const jwtToken = Jwt.sign(userObj, secretKey, {
                expiresIn: '30d'
            })
            let dataTemp = {
                ...userObj,
                token: jwtToken
            }
            returnData = {
                message: "Succesfully registered...",
                error: false,
                data: dataTemp
            }
            return apiSuccess(req, res, returnData);
        }
        else {
            returnData = {
                message: "Registration failed...",
                error: true,
                data: null
            }
            return apiError(req, res, returnData);
        }
    }
    else {
        returnData = {
            message: "Invalid OTP...",
            error: true,
            data: null
        }
        return apiError(req, res, returnData);
    }

}

const userLogin = async (req, res) => {
    const userValidSchema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
        userType: Joi.string().valid("ADMIN", "MANAGER"),
    })
    const validateUserData = userValidSchema.validate(req.body, {
        abortEarly: true
    })
    let returnData = {}
    if (validateUserData && validateUserData.error) {
        returnData = {
            message: validateUserData.error.details[0].message.replace(/\"/g, ""),
            error: true,
            data: null
        }
        return apiError(req, res, returnData);

    }
    const { email, password, userType } = req.body;
    let alreadyUser = await User.findOne({ email: email, userType: userType });
    if (!alreadyUser) {
        returnData = {
            message: "User Not Found",
            error: true,
            data: null
        }
        return apiError(req, res, returnData);
    }
    else {
        let comparePass = await bcrypt.compare(password, alreadyUser.password)
        if (!comparePass) {
            returnData = {
                message: "Email or Password is incorrect...",
                error: true,
                data: null
            }
            return apiError(req, res, returnData);
        } else {
            let secretKey = alreadyUser && alreadyUser.userType && alreadyUser.userType == "MANAGER" ? MANAGER_SECRET : ADMIN_SECRET;
            let userObj = {
                userId: alreadyUser._id,
                userType: alreadyUser.userType
            }
            const token = Jwt.sign(userObj, secretKey, {
                expiresIn: '30d'
            })
            let dataTemp = {
                ...userObj,
                token: token
            }
            returnData = {
                message: "Successfully Login",
                error: false,
                data: dataTemp
            }
            return apiSuccess(req, res, returnData);
        }
    }

}
const getProductList = async (req, res) => {
    const productValidSchema = Joi.object({
        category: Joi.string().required(),
        page: Joi.number().required(),
        size: Joi.number().required()
    })
    const validateProductData = productValidSchema.validate(req.body, {
        abortEarly: true
    })
    let returnData = {}
    if (validateProductData && validateProductData.error) {
        returnData = {
            message: validateUserData.error.details[0].message.replace(/\"/g, ""),
            error: true,
            data: null
        }
        return apiError(req, res, returnData);
    }
    const { category, page, size } = req.body;
    let productList = await Product.find({ category: category }).skip(page - 1).limit(size);
    console.log('productList_____', productList);
    if (productList && productList.length > 0) {
        returnData = {
            message: "Success",
            error: false,
            data: productList
        }
        return apiSuccess(req, res, returnData);
    }
    else {
        returnData = {
            message: "Not Found",
            error: true,
            data: null
        }
        return apiError(req, res, returnData);
    }

}

module.exports = {
    userRegister: userRegister,
    validateOtp: validateOtp,
    userLogin: userLogin,
    getProductList: getProductList,
}