const Jwt = require('jsonwebtoken')
const { apiError, apiSuccess } = require('../utils/globalFunctions')
const { User } = require('../db/index')
async function managerAuth(req, res, next) {
    const secretKey = process.env.MANAGER_SECRET
    const token = req.headers.authorization?.split(" ")[1]
    let returnData = {}
    if (!token) {
        returnData = {
            message: "Unauthorize User",
            error: true,
            data: null
        }
        return apiError(req, res, returnData)
    }
    try {
        let decodedData = Jwt.verify(token, secretKey)
        if (decodedData && decodedData.userId) {
            let correctUser = await User.findById(decodedData.userId)
            if (!correctUser) {
                returnData = {
                    message: "Manager access only",
                    error: true,
                    data: null
                }
                return apiError(req, res, returnData)
            }
            let tempObj = {
                userId: correctUser.userId,
                userType: correctUser.userType,
            }
            req.user = tempObj
            next();
        }
    } catch (error) {
        returnData = {
            message: "Unidentify User",
            error: true,
            data: null
        }
        return apiError(req, res, returnData)
    }
}
async function adminAuth(req, res, next) {
    const secretKey = process.env.ADMIN_SECRET
    console.log('req.headers.authorization', req.headers.authorization);
    const token = req.headers.authorization?.split(' ')[1]
    console.log('token_______', token);
    let returnData = {}
    if (!token) {
        returnData = {
            message: "Please send with valid authorization",
            error: true,
            data: null
        }
        return apiError(req, res, returnData)
    }
    try {
        let decodedData = Jwt.verify(token, secretKey)
        if (decodedData && decodedData.userId) {
            let correctUser = await User.findById(decodedData.userId)
            if (!correctUser) {
                returnData = {
                    message: "Admin access only",
                    error: true,
                    data: null
                }
                return apiError(req, res, returnData)
            }
            let tempObj = {
                userId: correctUser.userId,
                userType: correctUser.userType,
            }
            req.user = tempObj
            next();
        }
    } catch (error) {
        returnData = {
            message: "Unidentify User",
            error: true,
            data: null
        }
        return apiError(req, res, returnData)
    }
}


module.exports = {
    managerAuth: managerAuth,
    adminAuth: adminAuth,
}