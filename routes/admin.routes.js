const router = require("express").Router()
const adminController = require("./../controllers/admin.controller")

router
    //product
    .get("/products", adminController.adminGetAllProducts)
    .post("/add-product", adminController.adminAddProduct)
    .put("/update-product/:updateId", adminController.adminUpdateProduct)
    .delete("/delete-product/:deleteId", adminController.adminDeleteProduct)
    .put("/deactivate-product/:deactiveId", adminController.deactivateProduct)
    .put("/activate-product/:activeId", adminController.activateProduct)
    .get("/product-details/:productDetailId", adminController.getProductDetails)

    // order
    .get("/orders", adminController.getAllOrder)
    .get("/orders-details/:orderDetailId", adminController.getOrderDetails)
    .put("/cancel-order/:cancelOrderId", adminController.cancelOrder)
    .put("/update-order-status/:orderStatusId", adminController.updateOrderStatus)

    //user
    .get("/users", adminController.getAllUsers)
    .get("/user-details/:userDetailsId", adminController.getUserDetails)
    .put("/block-user/:userBlockId", adminController.blockUsers)
    .put("/unblock-user/:userUnlockId", adminController.unBlockUsers)
    .get("/user-order/:userOrderId", adminController.getUserOrders)

module.exports = router
