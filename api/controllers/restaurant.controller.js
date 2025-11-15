const prisma = require("../config/db");

const restaurantController = {
  // Get all with pagination and search
  getAll: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const search = req.query.search || "";
      const categoryId = req.query.categoryId || "";

      // Build where clause for search and filter
      const where = {};

      // Search by name, city, or phone number
      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { city: { contains: search, mode: "insensitive" } },
          { phoneNumber: { contains: search, mode: "insensitive" } },
        ];
      }

      // Filter by category
      if (categoryId) {
        where.categoryId = categoryId;
      }

      const [restaurants, total] = await Promise.all([
        prisma.restaurant.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdDate: "desc" },
          include: {
            category: {
              select: {
                id: true,
                name: true,
                imgUrl: true,
              },
            },
            _count: {
              select: {
                products: true,
                productCategories: true,
                orders: true,
              },
            },
          },
        }),
        prisma.restaurant.count({ where }),
      ]);

      res.status(200).json({
        data: restaurants,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        filters: {
          search: search || null,
          categoryId: categoryId || null,
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

      const restaurant = await prisma.restaurant.findUnique({
        where: { id },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              description: true,
              imgUrl: true,
            },
          },
          productCategories: {
            include: {
              _count: {
                select: { products: true },
              },
            },
          },
          products: {
            take: 10,
            orderBy: { createdDate: "desc" },
          },
          _count: {
            select: {
              products: true,
              orders: true,
              restaurantFavourites: true,
            },
          },
        },
      });

      if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
      }

      res.json(restaurant);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get by category with pagination and search
  getByCategory: async (req, res) => {
    try {
      const { categoryId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const search = req.query.search || "";

      // Build where clause
      const where = { categoryId };

      // Add search if provided
      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { city: { contains: search, mode: "insensitive" } },
          { phoneNumber: { contains: search, mode: "insensitive" } },
        ];
      }

      const [restaurants, total] = await Promise.all([
        prisma.restaurant.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdDate: "desc" },
          include: {
            category: {
              select: {
                id: true,
                name: true,
                imgUrl: true,
              },
            },
            _count: {
              select: {
                products: true,
                orders: true,
              },
            },
          },
        }),
        prisma.restaurant.count({ where }),
      ]);

      res.status(200).json({
        data: restaurants,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        filters: {
          categoryId,
          search: search || null,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Create (ADMIN only)
  create: async (req, res) => {
    try {
      const {
        name,
        description,
        imgUrl,
        address,
        city,
        phoneNumber,
        rating,
        deliveryTime,
        deliveryFee,
        minOrder,
        isActive,
        categoryId,
      } = req.body;

      // Validate required fields
      if (!name || !address || !city || !categoryId) {
        return res.status(400).json({
          error: "Name, address, city, and categoryId are required",
        });
      }

      // Check if category exists
      const category = await prisma.restaurantCategory.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        return res.status(404).json({ error: "Restaurant category not found" });
      }

      const restaurant = await prisma.restaurant.create({
        data: {
          name,
          description,
          imgUrl,
          address,
          city,
          phoneNumber,
          rating: rating || 0,
          deliveryTime,
          deliveryFee,
          minOrder,
          isActive: isActive !== undefined ? isActive : true,
          categoryId,
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              imgUrl: true,
            },
          },
        },
      });

      res.status(201).json(restaurant);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update (ADMIN only)
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        name,
        description,
        imgUrl,
        address,
        city,
        phoneNumber,
        rating,
        deliveryTime,
        deliveryFee,
        minOrder,
        isActive,
        categoryId,
      } = req.body;

      // If categoryId is being updated, check if it exists
      if (categoryId) {
        const category = await prisma.restaurantCategory.findUnique({
          where: { id: categoryId },
        });

        if (!category) {
          return res
            .status(404)
            .json({ error: "Restaurant category not found" });
        }
      }

      const restaurant = await prisma.restaurant.update({
        where: { id },
        data: {
          name,
          description,
          imgUrl,
          address,
          city,
          phoneNumber,
          rating,
          deliveryTime,
          deliveryFee,
          minOrder,
          isActive,
          categoryId,
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              imgUrl: true,
            },
          },
        },
      });

      res.status(200).json(restaurant);
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Restaurant not found" });
      }
      res.status(500).json({ error: error.message });
    }
  },

  // Delete (ADMIN only)
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      await prisma.restaurant.delete({
        where: { id },
      });

      res.status(200).json({ message: "Restaurant deleted successfully" });
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Restaurant not found" });
      }
      res.status(500).json({ error: error.message });
    }
  },

  // Toggle favourite (add or remove)
  toggleFavourite: async (req, res) => {
    try {
      const userId = req.user.id;
      const { restaurantId } = req.body;

      if (!restaurantId) {
        return res.status(400).json({ error: "restaurantId is required" });
      }

      // Check if restaurant exists
      const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId },
      });

      if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
      }

      // Check if already favourited
      const existingFavourite = await prisma.restaurantFavourite.findUnique({
        where: {
          userId_restaurantId: {
            userId,
            restaurantId,
          },
        },
      });

      if (existingFavourite) {
        // Remove from favourites
        await prisma.restaurantFavourite.delete({
          where: {
            id: existingFavourite.id,
          },
        });

        return res.status(200).json({
          message: "Restaurant removed from favourites",
          isFavourite: false,
        });
      } else {
        // Add to favourites
        const favourite = await prisma.restaurantFavourite.create({
          data: {
            userId,
            restaurantId,
          },
          include: {
            restaurant: {
              select: {
                id: true,
                name: true,
                imgUrl: true,
                rating: true,
                deliveryTime: true,
                deliveryFee: true,
              },
            },
          },
        });

        return res.status(201).json({
          message: "Restaurant added to favourites",
          isFavourite: true,
          data: favourite,
        });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get user's favourite restaurants
  getMyFavourites: async (req, res) => {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const [favourites, total] = await Promise.all([
        prisma.restaurantFavourite.findMany({
          where: { userId },
          skip,
          take: limit,
          orderBy: { createdDate: "desc" },
          include: {
            restaurant: {
              include: {
                category: {
                  select: {
                    id: true,
                    name: true,
                    imgUrl: true,
                  },
                },
                _count: {
                  select: {
                    products: true,
                  },
                },
              },
            },
          },
        }),
        prisma.restaurantFavourite.count({ where: { userId } }),
      ]);

      res.status(200).json({
        data: favourites,
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
};

module.exports = restaurantController;
