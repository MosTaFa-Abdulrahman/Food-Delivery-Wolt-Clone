const prisma = require("../config/db");

const restaurantController = {
  // Get all with pagination and search
  getAll: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const search = req.query.search || "";
      const userId = req.user?.id; // Current logged-in user (optional)

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

      const [restaurants, total] = await Promise.all([
        prisma.restaurant.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdDate: "desc" },
          include: {
            _count: {
              select: {
                products: true,
                productCategories: true,
                orders: true,
              },
            },
            // Check if current user liked this restaurant
            ...(userId && {
              restaurantFavourites: {
                where: {
                  userId: userId,
                },
                select: {
                  id: true,
                },
              },
            }),
          },
        }),
        prisma.restaurant.count({ where }),
      ]);

      // Transform data to add isLiked field
      const restaurantsWithLikes = restaurants.map((restaurant) => {
        const { restaurantFavourites, ...restaurantData } = restaurant;
        return {
          ...restaurantData,
          isLiked: userId ? restaurantFavourites?.length > 0 : false,
        };
      });

      res.status(200).json({
        data: restaurantsWithLikes,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        filters: {
          search: search || null,
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
      const userId = req?.user?.userId || req?.user?.id;

      const restaurant = await prisma.restaurant.findUnique({
        where: { id },
        include: {
          productCategories: {
            select: {
              id: true,
              name: true,
              imgUrl: true,
              _count: {
                select: {
                  products: true,
                },
              },
            },
          },
          _count: {
            select: {
              products: true,
              orders: true,
              restaurantFavourites: true,
            },
          },
          // Check if current user liked this restaurant
          ...(userId && {
            restaurantFavourites: {
              where: {
                userId: userId,
              },
              select: {
                id: true,
              },
            },
          }),
        },
      });

      if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
      }

      // Add isLiked field
      const { restaurantFavourites, ...restaurantData } = restaurant;

      res.status(200).json({
        ...restaurantData,
        isLiked: userId ? restaurantFavourites?.length > 0 : false,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Create (ADMIN && RESTAURANT_OWNER)
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
      } = req.body;

      // Validate required fields
      if (!name || !address || !city) {
        return res.status(400).json({
          error: "Name, address, city are required",
        });
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
        },
      });

      res.status(201).json(restaurant);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update (ADMIN && RESTAURANT_OWNER)
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
      } = req.body;

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

  // Delete (ADMIN && RESTAURANT_OWNER)
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
      const userId = req?.user?.userId || req?.user?.id;
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
        // Remove from favourites (UNLIKE)
        await prisma.restaurantFavourite.delete({
          where: {
            id: existingFavourite.id,
          },
        });

        return res.status(200).json({
          message: "Restaurant removed from favourites",
          isLiked: false,
        });
      } else {
        // Add to favourites (LIKE)
        await prisma.restaurantFavourite.create({
          data: {
            userId,
            restaurantId,
          },
        });

        return res.status(201).json({
          message: "Restaurant added to favourites",
          isLiked: true,
        });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get user's favourite restaurants
  getMyFavourites: async (req, res) => {
    try {
      const userId = req?.user?.userId || req?.user?.id;
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

      // All restaurants in favourites are liked by definition
      const data = favourites.map((fav) => ({
        ...fav.restaurant,
        isLiked: true,
      }));

      res.status(200).json({
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = restaurantController;
