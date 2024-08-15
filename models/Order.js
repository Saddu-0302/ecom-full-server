const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true
    },
    products: [
        {
            product: {
                type: mongoose.Types.ObjectId,
                ref: "product",
                required: true
            },
            // qty: {
            //     type: Number,
            //     required: true
            // }
        }
    ],
    status: {
        type: String,
        enum: ["placed", "cancel", "delivered"],
        default: "placed",
        required: false
    },
    address: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
}, { timestamps: true })

module.exports = mongoose.model("order", orderSchema)