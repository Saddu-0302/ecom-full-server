const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
    },
    photo: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true
    },
    otp: { type: Number },
}, { timestamps: true })

module.exports = mongoose.model("user", userSchema)