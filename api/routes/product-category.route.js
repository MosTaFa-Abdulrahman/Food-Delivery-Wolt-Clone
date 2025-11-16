const router = require("express").Router();
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const productCategoryController = require("../controllers/product-category.controller");

// Public routes
router.get("/", productCategoryController.getAll);
router.get("/:id", productCategoryController.getById);
router.get(
  "/restaurant/:restaurantId",
  productCategoryController.getByRestaurant
);

// ADMIN && RESTAURANT_OWNER routes
router.post(
  "/",
  authenticate,
  authorize(["ADMIN", "RESTAURANT_OWNER"]),
  productCategoryController.create
);
router.put(
  "/:id",
  authenticate,
  authorize(["ADMIN", "RESTAURANT_OWNER"]),
  productCategoryController.update
);
router.delete(
  "/:id",
  authenticate,
  authorize(["ADMIN", "RESTAURANT_OWNER"]),
  productCategoryController.delete
);

module.exports = router;
