const router = require("express").Router();
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const restaurantController = require("../controllers/restaurant.controller");

// Public routes
router.get("/", restaurantController.getAll);
router.get("/:id", restaurantController.getById);
router.get("/category/:categoryId", restaurantController.getByCategory);
router.post("/toggle", authenticate, restaurantController.toggleFavourite);
router.get(
  "/my-favourites",
  authenticate,
  restaurantController.getMyFavourites
);

// Admin only routes
router.post(
  "/",
  authenticate,
  authorize(["ADMIN"]),
  restaurantController.create
);
router.put(
  "/:id",
  authenticate,
  authorize(["ADMIN"]),
  restaurantController.update
);
router.delete(
  "/:id",
  authenticate,
  authorize(["ADMIN"]),
  restaurantController.delete
);

module.exports = router;
