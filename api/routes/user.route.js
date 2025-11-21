const router = require("express").Router();
const {
  getAllUsers,
  getUserProfile,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

// User
router.get(
  "/",
  authenticate,
  authorize(["ADMIN", "RESTAURANT_OWNER"]),
  getAllUsers
);
router.get("/:userId", authenticate, getUserProfile);
router.patch("/me", authenticate, updateUser);
router.delete("/me", authenticate, deleteUser);

module.exports = router;
