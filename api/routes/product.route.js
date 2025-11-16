const router = require("express").Router();
const {
  authenticate,
  authorize,
  optionalAuthenticate,
} = require("../middlewares/auth.middleware");
const productController = require("../controllers/product.controller");

// Public routes
router.get("/", optionalAuthenticate, productController.getAll);

// ⚠️ IMPORTANT: Put specific routes BEFORE parameterized routes
router.get("/my-favourites", authenticate, productController.getMyFavourites);

router.get(
  "/restaurant/:restaurantId",
  optionalAuthenticate,
  productController.getByRestaurant
);
router.get(
  "/category/:categoryId",
  optionalAuthenticate,
  productController.getByCategory
);

router.post("/toggle", authenticate, productController.toggleFavourite);

// This should come AFTER all specific routes
router.get("/:id", optionalAuthenticate, productController.getById);

// ADMIN && RESTAURANT_OWNER routes
router.post(
  "/",
  authenticate,
  authorize(["ADMIN", "RESTAURANT_OWNER"]),
  productController.create
);
router.put(
  "/:id",
  authenticate,
  authorize(["ADMIN", "RESTAURANT_OWNER"]),
  productController.update
);
router.delete(
  "/:id",
  authenticate,
  authorize(["ADMIN", "RESTAURANT_OWNER"]),
  productController.delete
);

module.exports = router;
