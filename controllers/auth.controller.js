const asyncHandler = require("express-async-handler")
const bcrypt = require("bcrypt")
const Admin = require("../models/Admin")
const JWT = require("jsonwebtoken")
const User = require("../models/User")

const { OAuth2Client } = require("google-auth-library")



exports.registerAdmin = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    const hash = await bcrypt.hash(password, 10)
    const found = await Admin.findOne({ email })
    if (!found) {
        return res.status(401).json({ message: "Email already Registered" })
    }
    await Admin.create({ name, email, password: hash })
    res.json({ message: "Admin Register Success" })
})
exports.loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const result = await Admin.findOne({ email })
    if (!result) {
        res.json({ message: "Email Not found" })
    }

    const verify = bcrypt.compare(password, result.password)
    if (!verify) {
        res.json("Password Not Verify")
    }

    token = JWT.sign({ adminId: result._id }, process.env.JWT_KEY)
    res.cookie("admin", token, { httpOnly: true })
    res.json({
        message: "Admin Login Success", result: {
            _id: result._id,
            name: result.name,
            email: result.email
        }
    })
})

exports.logout = asyncHandler(async (req, res) => {
    res.clearCookie("admin")
    res.json({ message: " Logout Success" })
})

exports.registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    const hash = await bcrypt.hash(password, 10)
    const found = await User.findOne({ email })
    if (found) {
        return res.status(401).json({ message: "Email Already Registered" })
    }
    await User.create({ name, email, password: hash })
    res.json({ message: "User Register Success" })
})
exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const result = await User.findOne({ email })

    if (!result) {
        res.json({ message: "Email Not found" })
    }

    const verify = bcrypt.compare(password, result.password)
    if (!verify) {
        res.json("Password Not Verify")
    }

    if (!result.active) {
        return res.status(401).json({ message: "Account Block By Admin" })
    }

    token = JWT.sign({ userId: result._id }, process.env.JWT_KEY)
    res.cookie("user", token, { httpOnly: true })
    res.json({
        message: "User Login Success", result: {
            _id: result._id,
            name: result.name,
            email: result.email
        }
    })
})

exports.continueWithGoogle = asyncHandler(async (req, res) => {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
    const { payload } = await client.verifyIdToken({ idToken: req.body.credential })
    console.log(payload);

    const result = await User.findOne({ email: payload.email })
    if (result) {
        const token = JWT.sign({ userId: result._id }, process.env.JWT_KEY, { expiresIn: "1d" })
        res.cookie("customer", token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 })
        return res.json({
            message: "User Login Success", result: {
                _id: result._id,
                name: result.name,
                email: result.email,
                photo: payload.picture
            }
        })
    } else {

        const result = await User.create({
            name: payload.name,
            email: payload.email,
            photo: payload.picture
        })
        const token = JWT.sign({ userId: result._id }, process.env.JWT_KEY, { expiresIn: "1d" })
        res.cookie("customer", token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 })
        res.json({ message: "User Register Success", result })
    }
})