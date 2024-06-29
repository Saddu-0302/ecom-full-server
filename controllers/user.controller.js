const asyncHandler = require("express-async-handler")
const Order = require("../models/Order")


exports.userGetAllOrders = asyncHandler(async (req, res) => {
    const result = await Order
        .find({ user: req.params.id })
        .sort({ createdAt: -1 })
        .populate("products.product")
    res.json({ message: "Order fetch success", result })
})

exports.userGetOrderDetails = asyncHandler(async (req, res) => {
    const result = await Order.findById(req.params.id)
    res.json({ message: "Order Details fetch success", result })
})
exports.userUpdatePassword = asyncHandler(async (req, res) => {

    res.json({ message: "password update success" })
})
exports.userPlaceOrder = asyncHandler(async (req, res) => {
    await Order.create(req.body)
    res.json({ message: "order place success" })
})
exports.userCancelOrder = asyncHandler(async (req, res) => {
    await Order.findByIdAndUpdate(req.params.id, { status: "cancel" })
    res.json({ message: "order cancel success" })
})