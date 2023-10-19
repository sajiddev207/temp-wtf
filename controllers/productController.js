const Joi = require('joi')
const { Product } = require('../db/index')
const { apiSuccess, apiError } = require('../utils/globalFunctions')

const addProduct = async (req, res) => {
    const productValidSchema = Joi.object({
        name: Joi.string().required(),
        category: Joi.string().required(),
        price: Joi.number().required(),
        quantity: Joi.number().required(),
    })
    const validateProductData = productValidSchema.validate(req.body, {
        abortEarly: true
    })
    let returnData = {}
    if (validateProductData && validateProductData.error) {
        returnData = {
            message: validateProductData.error.details[0].message.replace(/\"/g, ""),
            error: true,
            data: null
        }
        return apiError(req, res, returnData);

    }
    let alreadyProduct = await Product.findOne({ name: req.body.name })
    if (alreadyProduct) {
        returnData = {
            message: "Product already exist",
            error: true,
            data: alreadyProduct
        }
        return apiError(req, res, returnData);
    }
    const productData = await Product.create(req.body)
    returnData = {
        message: "Add Successfully",
        error: false,
        data: productData
    }
    return apiSuccess(req, res, returnData);
}
const updateProduct = async (req, res) => {
    const productValidSchema = Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
        category: Joi.string().required(),
        price: Joi.number().required(),
        quantity: Joi.number().required(),
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
    let alreadyProduct = await Product.findOne({ _id: req.body.id })
    console.log('alreadyProduct_____', alreadyProduct);
    if (!alreadyProduct) {
        returnData = {
            message: "Product not found",
            error: true,
            data: null
        }
        return apiError(req, res, returnData);
    }
    const updatedData = await Product.findOneAndUpdate({ _id: req.body.id }, req.body, { new: true })
    returnData = {
        message: "Update Successfully",
        error: false,
        data: updatedData
    }
    return apiSuccess(req, res, returnData);
}
const deleteProduct = async (req, res) => {
    const productValidSchema = Joi.object({
        id: Joi.string().required()
    })
    const validateProductData = productValidSchema.validate(req.params, {
        abortEarly: true
    })
    let returnData = {}
    if (validateProductData && validateProductData.error) {
        returnData = {
            message: validateProductData.error.details[0].message.replace(/\"/g, ""),
            error: true,
            data: null
        }
        return apiError(req, res, returnData);
    }
    console.log('REQQQQQQQQ_____', req.params.id);
    let alreadyProduct = await Product.findOne({ _id: req.params.id })
    if (!alreadyProduct) {
        returnData = {
            message: "Product not found",
            error: true,
            data: null
        }
        return apiError(req, res, returnData);
    }
    await Product.deleteOne({ _id: req.params.id })
    returnData = {
        message: "Delete Successfully",
        error: false,
        data: null
    }
    return apiSuccess(req, res, returnData);
}
const getFilteredProductList = async (req, res) => {
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
    addProduct: addProduct,
    updateProduct: updateProduct,
    deleteProduct: deleteProduct,
    getFilteredProductList: getFilteredProductList,
}