const prisma = require("../config/db");

const productCategoryController = {
  // Get all with pagination
  getAll: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const [categories, total] = await Promise.all([
        prisma.productCategory.findMany({
          skip,
          take: limit,
          orderBy: { createdDate: "desc" },
          include: {
            restaurant: {
              select: {
                id: true,
                name: true,
              },
            },
            _count: {
              select: { products: true },
            },
          },
        }),
        prisma.productCategory.count(),
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

      const category = await prisma.productCategory.findUnique({
        where: { id },
        include: {
          restaurant: {
            select: {
              id: true,
              name: true,
            },
          },
          products: {
            select: {
              id: true,
              name: true,
              price: true,
              imgUrl: true,
            },
          },
        },
      });

      if (!category) {
        return res.status(404).json({ error: "Product category not found" });
      }

      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get by restaurant
  getByRestaurant: async (req, res) => {
    try {
      const { restaurantId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const [categories, total] = await Promise.all([
        prisma.productCategory.findMany({
          where: { restaurantId },
          skip,
          take: limit,
          orderBy: { createdDate: "desc" },
          include: {
            _count: {
              select: { products: true },
            },
          },
        }),
        prisma.productCategory.count({
          where: { restaurantId },
        }),
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

  // Create (ADMIN only)
  create: async (req, res) => {
    try {
      const { name, description, imgUrl, restaurantId } = req.body;

      if (!name || !restaurantId) {
        return res
          .status(400)
          .json({ error: "Name and restaurantId are required" });
      }

      // Check if restaurant exists
      const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId },
      });

      if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
      }

      const category = await prisma.productCategory.create({
        data: {
          name,
          description,
          imgUrl,
          restaurantId,
        },
        include: {
          restaurant: {
            select: {
              id: true,
              name: true,
            },
          },
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
      const { name, description, imgUrl, restaurantId } = req.body;

      // If restaurantId is being updated, check if it exists
      if (restaurantId) {
        const restaurant = await prisma.restaurant.findUnique({
          where: { id: restaurantId },
        });

        if (!restaurant) {
          return res.status(404).json({ error: "Restaurant not found" });
        }
      }

      const category = await prisma.productCategory.update({
        where: { id },
        data: {
          name,
          description,
          imgUrl,
          restaurantId,
        },
        include: {
          restaurant: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      res.status(200).json(category);
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Product category not found" });
      }
      res.status(500).json({ error: error.message });
    }
  },

  // Delete (ADMIN only)
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      await prisma.productCategory.delete({
        where: { id },
      });

      res
        .status(200)
        .json({ message: "Product category deleted successfully" });
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Product category not found" });
      }
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = productCategoryController;
