const asyncHandler = require("express-async-handler")
const bcrypt = require("bcrypt")
const Admin = require("../models/Admin")
const JWT = require("jsonwebtoken")
const User = require("../models/User")

const { OAuth2Client } = require("google-auth-library")

const sendEmail = require("../utils/email")
const { checkEmpty } = require("../utils/checkEmpty")

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
    const isMatch = await User.findOne({ email })
    console.log(req.body);

    if (!isMatch) {
        res.json({ message: "Email Not found" })
    }

    const verify = bcrypt.compare(password, isMatch.password)
    if (!verify) {
        res.json("Password Not Verify")
    }

    const otp = Math.floor(100000 + Math.random() * 900000)

    await sendEmail({
        to: email,
        subject: 'Login OTP',
        message: `<h1>Do Not Share Your Account OTP With Any One</h1><p>Your Login OTP ${otp}</p>`
    });

    await User.findByIdAndUpdate(isMatch._id, { otp });

    if (!isMatch.active) {
        return res.status(401).json({ message: "Account Block By Admin" })
    }

    res.status(200).json({
        message: "OTP Send Successfully", result: email
    })
})
exports.verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp, } = req.body

    console.log(req.body.email);
    // console.log(req.body.user);

    const result = await User.findOne({ email })

    console.log(result);

    if (!result) {
        return res.status(400).json({ message: "User Not found with this email" })
    }
    if (result.otp != otp) {
        return res.status(400).json({ message: "Invalid OTP" })
    }

    const token = JWT.sign({ userId: result._id }, process.env.JWT_KEY, { expiresIn: "1d" })

    res.cookie('otp', token, {
        maxAge: 86400000,
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === "production"
    })
    res.json({
        message: "Login Success",
        result: {
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