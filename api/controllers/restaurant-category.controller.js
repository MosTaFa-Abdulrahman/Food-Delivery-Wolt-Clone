const prisma = require("../config/db");

const restaurantCategoryController = {
  // Get all with pagination
  getAll: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const [categories, total] = await Promise.all([
        prisma.restaurantCategory.findMany({
          skip,
          take: limit,
          orderBy: { createdDate: "desc" },
          include: {
            _count: {
              select: { restaurants: true },
            },
          },
        }),
        prisma.restaurantCategory.count(),
      ]);

      res.status(200).json({
        data: categories,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get by ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;

      const category = await prisma.restaurantCategory.findUnique({
        where: { id },
        include: {
          restaurants: {
            select: {
              id: true,
              name: true,
              imgUrl: true,
            },
          },
        },
      });

      if (!category) {
        return res.status(404).json({ error: "Restaurant category not found" });
      }

      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Create (ADMIN only)
  create: async (req, res) => {
    try {
      const { name, description, imgUrl } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Name is required" });
      }

      const category = await prisma.restaurantCategory.create({
        data: {
          name,
          description,
          imgUrl,
        },
      });

      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update (ADMIN only)
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, imgUrl } = req.body;

      const category = await prisma.restaurantCategory.update({
        where: { id },
        data: {
          name,
          description,
          imgUrl,
        },
      });

      res.status(200).json(category);
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Restaurant category not found" });
      }
      res.status(500).json({ error: error.message });
    }
  },

  // Delete (ADMIN only)
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      await prisma.restaurantCategory.delete({
        where: { id },
      });

      res
        .status(200)
        .json({ message: "Restaurant category deleted successfully" });
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Restaurant category not found" });
      }
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = restaurantCategoryController;
