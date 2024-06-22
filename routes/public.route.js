const router = require("express").Router()
const publicController = require("./../controllers/public.controller")

router
    .get("/all-products", publicController.publicGetAllProducts)
    .get("/product-details/:id", publicController.publicGetProductDetails)

module.exports = router