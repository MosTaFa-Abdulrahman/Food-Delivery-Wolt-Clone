const prisma = require("../config/db");

const productController = {
  // Get all with pagination and search
  getAll: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const search = req.query.search || "";
      const restaurantId = req.query.restaurantId || "";
      const categoryId = req.query.categoryId || "";
      const isAvailable = req.query.isAvailable;

      // Build where clause
      const where = {};

      // Search by name or description
      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }

      // Filter by restaurant
      if (restaurantId) {
        where.restaurantId = restaurantId;
      }

      // Filter by category
      if (categoryId) {
        where.categoryId = categoryId;
      }

      // Filter by availability
      if (isAvailable !== undefined) {
        where.isAvailable = isAvailable === "true";
      }

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdDate: "desc" },
          include: {
            restaurant: {
              select: {
                id: true,
                name: true,
                imgUrl: true,
              },
            },
            category: {
              select: {
                id: true,
                name: true,
                imgUrl: true,
              },
            },
            _count: {
              select: {
                cartItems: true,
                productFavourites: true,
              },
            },
          },
        }),
        prisma.product.count({ where }),
      ]);

      res.status(200).json({
        data: products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        filters: {
          search: search || null,
          restaurantId: restaurantId || null,
          categoryId: categoryId || null,
          isAvailable: isAvailable || null,
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

      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          restaurant: {
            select: {
              id: true,
              name: true,
              imgUrl: true,
              address: true,
              city: true,
              phoneNumber: true,
              rating: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              description: true,
              imgUrl: true,
            },
          },
          _count: {
            select: {
              cartItems: true,
              productFavourites: true,
            },
          },
        },
      });

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get by restaurant with pagination and search
  getByRestaurant: async (req, res) => {
    try {
      const { restaurantId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const search = req.query.search || "";
      const categoryId = req.query.categoryId || "";
      const isAvailable = req.query.isAvailable;

      // Build where clause
      const where = { restaurantId };

      // Add search
      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }

      // Filter by category
      if (categoryId) {
        where.categoryId = categoryId;
      }

      // Filter by availability
      if (isAvailable !== undefined) {
        where.isAvailable = isAvailable === "true";
      }

      const [products, total] = await Promise.all([
        prisma.product.findMany({
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
                cartItems: true,
                productFavourites: true,
              },
            },
          },
        }),
        prisma.product.count({ where }),
      ]);

      res.status(200).json({
        data: products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        filters: {
          restaurantId,
          search: search || null,
          categoryId: categoryId || null,
          isAvailable: isAvailable || null,
        },
      });
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
      const isAvailable = req.query.isAvailable;

      // Build where clause
      const where = { categoryId };

      // Add search
      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }

      // Filter by availability
      if (isAvailable !== undefined) {
        where.isAvailable = isAvailable === "true";
      }

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdDate: "desc" },
          include: {
            restaurant: {
              select: {
                id: true,
                name: true,
                imgUrl: true,
              },
            },
            category: {
              select: {
                id: true,
                name: true,
                imgUrl: true,
              },
            },
            _count: {
              select: {
                cartItems: true,
                productFavourites: true,
              },
            },
          },
        }),
        prisma.product.count({ where }),
      ]);

      res.status(200).json({
        data: products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        filters: {
          categoryId,
          search: search || null,
          isAvailable: isAvailable || null,
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
        quantity,
        price,
        imgUrl,
        isAvailable,
        restaurantId,
        categoryId,
      } = req.body;

      // Validate required fields
      if (
        !name ||
        quantity === undefined ||
        !price ||
        !restaurantId ||
        !categoryId
      ) {
        return res.status(400).json({
          error:
            "Name, quantity, price, restaurantId, and categoryId are required",
        });
      }

      // Validate numeric fields
      if (quantity < 0 || price < 0) {
        return res.status(400).json({
          error: "Quantity and price must be positive numbers",
        });
      }

      // Check if restaurant exists
      const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId },
      });

      if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
      }

      // Check if category exists and belongs to the restaurant
      const category = await prisma.productCategory.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        return res.status(404).json({ error: "Product category not found" });
      }

      if (category.restaurantId !== restaurantId) {
        return res.status(400).json({
          error: "Category does not belong to the specified restaurant",
        });
      }

      const product = await prisma.product.create({
        data: {
          name,
          description,
          quantity,
          price,
          imgUrl,
          isAvailable: isAvailable !== undefined ? isAvailable : true,
          restaurantId,
          categoryId,
        },
        include: {
          restaurant: {
            select: {
              id: true,
              name: true,
              imgUrl: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              imgUrl: true,
            },
          },
        },
      });

      res.status(201).json(product);
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
        quantity,
        price,
        imgUrl,
        isAvailable,
        restaurantId,
        categoryId,
      } = req.body;

      // Validate numeric fields if provided
      if (
        (quantity !== undefined && quantity < 0) ||
        (price !== undefined && price < 0)
      ) {
        return res.status(400).json({
          error: "Quantity and price must be positive numbers",
        });
      }

      // If restaurantId is being updated, check if it exists
      if (restaurantId) {
        const restaurant = await prisma.restaurant.findUnique({
          where: { id: restaurantId },
        });

        if (!restaurant) {
          return res.status(404).json({ error: "Restaurant not found" });
        }
      }

      // If categoryId is being updated, check if it exists
      if (categoryId) {
        const category = await prisma.productCategory.findUnique({
          where: { id: categoryId },
        });

        if (!category) {
          return res.status(404).json({ error: "Product category not found" });
        }

        // If both restaurantId and categoryId are provided, verify they match
        if (restaurantId && category.restaurantId !== restaurantId) {
          return res.status(400).json({
            error: "Category does not belong to the specified restaurant",
          });
        }
      }

      const product = await prisma.product.update({
        where: { id },
        data: {
          name,
          description,
          quantity,
          price,
          imgUrl,
          isAvailable,
          restaurantId,
          categoryId,
        },
        include: {
          restaurant: {
            select: {
              id: true,
              name: true,
              imgUrl: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              imgUrl: true,
            },
          },
        },
      });

      res.status(200).json(product);
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(500).json({ error: error.message });
    }
  },

  // Delete (ADMIN only)
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      await prisma.product.delete({
        where: { id },
      });

      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(500).json({ error: error.message });
    }
  },

  // Toggle favourite (add or remove)
  toggleFavourite: async (req, res) => {
    try {
      const userId = req.user.id;
      const { productId } = req.body;

      if (!productId) {
        return res.status(400).json({ error: "productId is required" });
      }

      // Check if product exists
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Check if already favourited
      const existingFavourite = await prisma.productFavourite.findUnique({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });

      if (existingFavourite) {
        // Remove from favourites
        await prisma.productFavourite.delete({
          where: {
            id: existingFavourite.id,
          },
        });

        return res.status(200).json({
          message: "Product removed from favourites",
          isFavourite: false,
        });
      } else {
        // Add to favourites
        const favourite = await prisma.productFavourite.create({
          data: {
            userId,
            productId,
          },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                price: true,
                imgUrl: true,
                quantity: true,
                isAvailable: true,
                restaurant: {
                  select: {
                    id: true,
                    name: true,
                    imgUrl: true,
                  },
                },
                category: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        });

        return res.status(201).json({
          message: "Product added to favourites",
          isFavourite: true,
          data: favourite,
        });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get user's favourite products
  getMyFavourites: async (req, res) => {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const [favourites, total] = await Promise.all([
        prisma.productFavourite.findMany({
          where: { userId },
          skip,
          take: limit,
          orderBy: { createdDate: "desc" },
          include: {
            product: {
              include: {
                restaurant: {
                  select: {
                    id: true,
                    name: true,
                    imgUrl: true,
                    rating: true,
                  },
                },
                category: {
                  select: {
                    id: true,
                    name: true,
                    imgUrl: true,
                  },
                },
              },
            },
          },
        }),
        prisma.productFavourite.count({ where: { userId } }),
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

module.exports = productController;
