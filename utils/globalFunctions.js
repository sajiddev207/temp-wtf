const apiSuccess = (req, res, param) => {
    return res.status(200).json({
        message: param.message,
        error: param.error,
        data: param.data,
    })
}
const apiError = (req, res, param) => {
    return res.status(400).json({
        message: param.message,
        error: param.error,
        data: param.data,
    })
}

module.exports ={
    apiSuccess:apiSuccess,
    apiError:apiError,
}