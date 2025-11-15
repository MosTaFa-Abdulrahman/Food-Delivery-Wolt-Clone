const router = require("express").Router();
const {
  getAllUsers,
  getUserProfile,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");
const { authenticate } = require("../middlewares/auth.middleware");

// User Profile Operations
router.get("/", authenticate, getAllUsers);
router.get("/:userId", authenticate, getUserProfile);
router.patch("/me", authenticate, updateUser);
router.delete("/me", authenticate, deleteUser);

module.exports = router;
