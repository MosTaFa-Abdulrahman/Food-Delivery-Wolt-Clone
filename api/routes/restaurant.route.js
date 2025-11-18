const router = require("express").Router();
const {
  authenticate,
  authorize,
  optionalAuthenticate,
} = require("../middlewares/auth.middleware");
const restaurantController = require("../controllers/restaurant.controller");

// Public routes
router.get("/", optionalAuthenticate, restaurantController.getAll);

// ⚠️ IMPORTANT: Put specific routes BEFORE parameterized routes
router.get(
  "/my-favourites",
  authenticate,
  restaurantController.getMyFavourites
);

router.post("/toggle", authenticate, restaurantController.toggleFavourite);

// This should come AFTER /my-favourites
router.get("/:id", optionalAuthenticate, restaurantController.getById);

// ADMIN && RESTAURANT_OWNER routes
router.post(
  "/",
  authenticate,
  authorize(["ADMIN", "RESTAURANT_OWNER"]),
  restaurantController.create
);
router.put(
  "/:id",
  authenticate,
  authorize(["ADMIN", "RESTAURANT_OWNER"]),
  restaurantController.update
);
router.delete(
  "/:id",
  authenticate,
  authorize(["ADMIN", "RESTAURANT_OWNER"]),
  restaurantController.delete
);

module.exports = router;
