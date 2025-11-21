const prisma = require("../config/db");

// Get All Users (with pagination)
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const skip = (page - 1) * size;
    const search = req.query.search || "";

    const whereClause = search
      ? {
          OR: [
            { username: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const [users, totalElements] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        skip,
        take: size,
        orderBy: {
          createdDate: "desc",
        },
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          imgUrl: true,
          city: true,
          role: true,
          phoneNumber: true,
          createdDate: true,
        },
      }),
      prisma.user.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalElements / size);

    res.status(200).json({
      content: users,
      page,
      size,
      totalElements,
      totalPages,
      first: page === 1,
      last: page === totalPages,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Get User Profile by ID
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        imgUrl: true,
        city: true,
        role: true,
        phoneNumber: true,
        createdDate: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      user: {
        ...user,
      },
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
};

// Update User Profile
const updateUser = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { firstName, lastName, imgUrl, city, phoneNumber } = req.body;

    const updateData = {
      ...(firstName !== undefined && { firstName }),
      ...(lastName !== undefined && { lastName }),
      ...(imgUrl !== undefined && { imgUrl }),
      ...(city !== undefined && { city }),
      ...(phoneNumber !== undefined && { phoneNumber }),
    };

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        imgUrl: true,
        city: true,
        role: true,
        phoneNumber: true,
        createdDate: true,
        lastModifiedDate: true,
      },
    });

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

// Delete User Account
const deleteUser = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(200).json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Failed to delete account" });
  }
};

module.exports = {
  getAllUsers,
  getUserProfile,
  updateUser,
  deleteUser,
};
