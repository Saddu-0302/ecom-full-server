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
            qty: {
                type: Number,
                required: true
            }
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
    cod: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model("order", orderSchema)