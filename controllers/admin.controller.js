const asyncHandler = require("express-async-handler")
const Product = require("../models/Product")
const { upload } = require("../utils/upload")
const cloudinary = require("cloudinary").v2

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

exports.adminGetAllProducts = asyncHandler(async (req, res) => {

    const result = await Product.find()
    res.json({ message: "Product Fetch Success", result })
})
exports.adminAddProduct = asyncHandler(async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ message: "upload error" })
        }
        // console.log(req.file.path);  //image's path
        const { secure_url } = await cloudinary.uploader.upload(req.file.path)
        const result = await Product.create({ ...req.body, images: secure_url })
        res.json({ message: "Product Add Success", result })

    })
})
exports.adminUpdateProduct = asyncHandler(async (req, res) => {
    const { updateId } = req.params
    await Product.findByIdAndUpdate(updateId, req.body)
    res.json({ message: "Product Update Success" })
})
exports.adminDeleteProduct = asyncHandler(async (req, res) => {
    const { deleteId } = req.params
    const result = await Product.findById(deleteId)
    const str = result.images.split("/")
    const img = str[str.length - 1].split(".")[0]
    await cloudinary.uploader.destroy(img)
    await Product.findByIdAndDelete(deleteId)
    res.json({ message: "Product Delete Success" })
})
exports.deactivateProduct = asyncHandler(async (req, res) => {
    const { deactiveId } = req.params
    await Product.findByIdAndUpdate(deactiveId, { active: false })
    res.json({ message: "Product Deactivate Success" })
})
exports.activateProduct = asyncHandler(async (req, res) => {
    const { activeId } = req.params
    await Product.findByIdAndUpdate(activeId, { active: true })
    res.json({ message: "Product Activate Success" })
})
exports.getProductDetails = asyncHandler(async (req, res) => {
    res.json({ message: "Product Details Fetch Success" })
})


// order
exports.getAllOrder = asyncHandler(async (req, res) => {
    res.json({ message: "Order Fetch Success" })
})
exports.getOrderDetails = asyncHandler(async (req, res) => {
    res.json({ message: "Order details Fetch Success" })
})
exports.cancelOrder = asyncHandler(async (req, res) => {
    res.json({ message: "Order cancel Success" })
})
exports.updateOrderStatus = asyncHandler(async (req, res) => {
    res.json({ message: "Order status update Success" })
})


// user
exports.getAllUsers = asyncHandler(async (req, res) => {
    res.json({ message: "User Fetch Success" })
})
exports.getUserDetails = asyncHandler(async (req, res) => {
    res.json({ message: "User Details Fetch Success" })
})
exports.blockUsers = asyncHandler(async (req, res) => {
    res.json({ message: "User Block Success" })
})
exports.unBlockUsers = asyncHandler(async (req, res) => {
    res.json({ message: "User Unblock Success" })
})
exports.getUserOrders = asyncHandler(async (req, res) => {
    res.json({ message: "User Order Fetch Success" })
})