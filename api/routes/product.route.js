const router = require("express").Router();
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const productController = require("../controllers/product.controller");

// Public routes
router.get("/", productController.getAll);
router.get("/:id", productController.getById);
router.get("/restaurant/:restaurantId", productController.getByRestaurant);
router.get("/category/:categoryId", productController.getByCategory);
router.post("/toggle", authenticate, productController.toggleFavourite);
router.get("/my-favourites", authenticate, productController.getMyFavourites);

// Admin only routes
router.post("/", authenticate, authorize(["ADMIN"]), productController.create);
router.put(
  "/:id",
  authenticate,
  authorize(["ADMIN"]),
  productController.update
);
router.delete(
  "/:id",
  authenticate,
  authorize(["ADMIN"]),
  productController.delete
);

module.exports = router;
