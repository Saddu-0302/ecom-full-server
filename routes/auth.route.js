const router = require("express").Router()

const authController = require("./../controllers/auth.controller")


router
    .post("/registerAdmin", authController.registerAdmin)
    .post("/loginAdmin", authController.loginAdmin)
    .post("/logoutAdmin", authController.logout)
    .post("/registerUser", authController.registerUser)
    .post("/loginUser", authController.loginUser)

module.exports = router