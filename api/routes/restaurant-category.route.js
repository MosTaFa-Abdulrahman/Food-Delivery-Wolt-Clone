const router = require("express").Router();
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const restaurantCategoryController = require("../controllers/restaurant-category.controller");

// Public routes
router.get("/", restaurantCategoryController.getAll);
router.get("/:id", restaurantCategoryController.getById);

// Admin only routes
router.post(
  "/",
  authenticate,
  authorize(["ADMIN"]),
  restaurantCategoryController.create
);
router.put(
  "/:id",
  authenticate,
  authorize(["ADMIN"]),
  restaurantCategoryController.update
);
router.delete(
  "/:id",
  authenticate,
  authorize(["ADMIN"]),
  restaurantCategoryController.delete
);

module.exports = router;
