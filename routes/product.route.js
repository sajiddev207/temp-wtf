const express = require('express')
const router = express.Router();
const { addProduct, updateProduct, deleteProduct, getFilteredProductList } = require('../controllers/productController')
const { adminAuth, managerAuth } = require('../middleware/auth')


router.post('/addProduct', adminAuth, addProduct)
router.put('/updateProduct', adminAuth, updateProduct)
router.delete('/deleteProduct/:id', adminAuth, deleteProduct)
router.post('/getFilteredProductList', adminAuth, getFilteredProductList)


module.exports = router;