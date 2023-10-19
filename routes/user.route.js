const express = require('express')
const router = express.Router();
const { userRegister,validateOtp, userLogin, getProductList } = require('../controllers/userController')
const { managerAuth } = require('../middleware/auth')

router.post('/userRegister', userRegister);
router.post('/validateOtp', validateOtp);
router.post('/userLogin', userLogin);
router.post('/getProductList', managerAuth, getProductList);


module.exports = router;