const router = require("express").Router();
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const orderController = require("../controllers/order.controller");

// User routes (authenticated)
router.post("/", authenticate, orderController.createOrder);
router.get("/my-orders", authenticate, orderController.getMyOrders);
router.get("/:id", authenticate, orderController.getOrderById);
router.delete("/:id", authenticate, orderController.deleteOrder);

// ADMIN & RESTAURANT_OWNER routes
router.get(
  "/",
  authenticate,
  authorize(["ADMIN", "RESTAURANT_OWNER"]),
  orderController.getAllOrders
);
router.put(
  "/:id/status",
  authenticate,
  authorize(["ADMIN", "RESTAURANT_OWNER"]),
  orderController.updateOrderStatus
);

module.exports = router;
