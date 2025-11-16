// product.controller.js - FULL FILE WITH FAVOURITES
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
      const userId = req.user?.id; // Optional auth

      // Build where clause
      const where = {};

      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }

      if (restaurantId) where.restaurantId = restaurantId;
      if (categoryId) where.categoryId = categoryId;
      if (isAvailable !== undefined) where.isAvailable = isAvailable === "true";

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
                productFavourites: true,
              },
            },
            // Check if current user liked this product
            ...(userId && {
              productFavourites: {
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
        prisma.product.count({ where }),
      ]);

      // Transform data to add isLiked field
      const productsWithLikes = products.map((product) => {
        const { productFavourites, ...productData } = product;
        return {
          ...productData,
          isLiked: userId ? productFavourites?.length > 0 : false,
        };
      });

      res.status(200).json({
        data: productsWithLikes,
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
      const userId = req.user?.id; // Optional auth

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
              productFavourites: true,
            },
          },
          // Check if current user liked this product
          ...(userId && {
            productFavourites: {
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

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Add isLiked field
      const { productFavourites, ...productData } = product;
      const isLiked = userId && productFavourites?.length > 0;

      res.json({
        ...productData,
        isLiked: isLiked,
      });
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
      const userId = req.user?.id; // Optional auth

      const where = { restaurantId };

      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }

      if (categoryId) where.categoryId = categoryId;
      if (isAvailable !== undefined) where.isAvailable = isAvailable === "true";

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdDate: "desc" },
          include: {
            _count: {
              select: {
                productFavourites: true,
              },
            },
            // Check if current user liked this product
            ...(userId && {
              productFavourites: {
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
        prisma.product.count({ where }),
      ]);

      // Transform data to add isLiked field
      const productsWithLikes = products.map((product) => {
        const { productFavourites, ...productData } = product;
        return {
          ...productData,
          isLiked: userId ? productFavourites?.length > 0 : false,
        };
      });

      res.status(200).json({
        data: productsWithLikes,
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
      const userId = req.user?.id; // Optional auth

      const where = { categoryId };

      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }

      if (isAvailable !== undefined) where.isAvailable = isAvailable === "true";

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
                productFavourites: true,
              },
            },
            // Check if current user liked this product
            ...(userId && {
              productFavourites: {
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
        prisma.product.count({ where }),
      ]);

      // Transform data to add isLiked field
      const productsWithLikes = products.map((product) => {
        const { productFavourites, ...productData } = product;
        return {
          ...productData,
          isLiked: userId ? productFavourites?.length > 0 : false,
        };
      });

      res.status(200).json({
        data: productsWithLikes,
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

  // Create Product
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
        category,
      } = req.body;

      if (!name || quantity === undefined || !price || !restaurantId) {
        return res.status(400).json({
          error: "Name, quantity, price, and restaurantId are required",
        });
      }

      if (!categoryId && !category) {
        return res.status(400).json({
          error: "Either categoryId or category object is required",
        });
      }

      if (categoryId && category) {
        return res.status(400).json({
          error: "Provide either categoryId or category object, not both",
        });
      }

      if (quantity < 0 || price < 0) {
        return res.status(400).json({
          error: "Quantity and price must be positive numbers",
        });
      }

      if (category && !category.name) {
        return res.status(400).json({
          error: "Category name is required when creating a new category",
        });
      }

      const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId },
      });

      if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
      }

      let finalCategoryId = categoryId;

      if (categoryId) {
        const existingCategory = await prisma.productCategory.findUnique({
          where: { id: categoryId },
        });

        if (!existingCategory) {
          return res.status(404).json({ error: "Product category not found" });
        }

        if (existingCategory.restaurantId !== restaurantId) {
          return res.status(400).json({
            error: "Category does not belong to the specified restaurant",
          });
        }
      }

      const result = await prisma.$transaction(async (tx) => {
        let createdCategory = null;

        if (category) {
          createdCategory = await tx.productCategory.create({
            data: {
              name: category.name,
              description: category.description || null,
              imgUrl: category.imgUrl || null,
              restaurantId,
            },
          });

          finalCategoryId = createdCategory.id;
        }

        const product = await tx.product.create({
          data: {
            name,
            description,
            quantity,
            price,
            imgUrl,
            isAvailable: isAvailable !== undefined ? isAvailable : true,
            restaurantId,
            categoryId: finalCategoryId,
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
                description: true,
                imgUrl: true,
              },
            },
            _count: {
              select: {
                productFavourites: true,
              },
            },
          },
        });

        return {
          product,
          categoryCreated: !!createdCategory,
          category: createdCategory,
        };
      });

      res.status(201).json({
        message: result.categoryCreated
          ? "Product and category created successfully"
          : "Product created successfully",
        data: result.product,
        ...(result.categoryCreated && {
          newCategory: result.category,
        }),
      });
    } catch (error) {
      if (error.code === "P2002") {
        return res.status(409).json({
          error: "A category with this name already exists for this restaurant",
        });
      }
      res.status(500).json({ error: error.message });
    }
  },

  // Update
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

      const existingProduct = await prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
        },
      });

      if (!existingProduct) {
        return res.status(404).json({ error: "Product not found" });
      }

      if (
        (quantity !== undefined && quantity < 0) ||
        (price !== undefined && price < 0)
      ) {
        return res.status(400).json({
          error: "Quantity and price must be positive numbers",
        });
      }

      if (restaurantId && restaurantId !== existingProduct.restaurantId) {
        const restaurant = await prisma.restaurant.findUnique({
          where: { id: restaurantId },
        });

        if (!restaurant) {
          return res.status(404).json({ error: "Restaurant not found" });
        }

        if (!categoryId) {
          return res.status(400).json({
            error:
              "When changing restaurant, you must also select a new category",
          });
        }
      }

      const targetRestaurantId = restaurantId || existingProduct.restaurantId;

      if (categoryId) {
        const category = await prisma.productCategory.findUnique({
          where: { id: categoryId },
        });

        if (!category) {
          return res.status(404).json({ error: "Product category not found" });
        }

        if (category.restaurantId !== targetRestaurantId) {
          return res.status(400).json({
            error: "Category does not belong to the specified restaurant",
          });
        }
      }

      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (quantity !== undefined) updateData.quantity = quantity;
      if (price !== undefined) updateData.price = price;
      if (imgUrl !== undefined) updateData.imgUrl = imgUrl;
      if (isAvailable !== undefined) updateData.isAvailable = isAvailable;
      if (restaurantId !== undefined) updateData.restaurantId = restaurantId;
      if (categoryId !== undefined) updateData.categoryId = categoryId;

      const product = await prisma.product.update({
        where: { id },
        data: updateData,
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
              description: true,
              imgUrl: true,
            },
          },
          _count: {
            select: {
              productFavourites: true,
            },
          },
        },
      });

      res.status(200).json({
        message: "Product updated successfully",
        data: product,
      });
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Product not found" });
      }

      if (error.code === "P2002") {
        return res.status(409).json({
          error: "A product with this name already exists",
        });
      }

      res.status(500).json({ error: error.message });
    }
  },

  // Delete
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

  // Toggle favourite
  toggleFavourite: async (req, res) => {
    try {
      const userId = req.user.id;
      const { productId } = req.body;

      console.log("🔄 Toggle Product Favourite:", { userId, productId });

      if (!productId) {
        return res.status(400).json({ error: "productId is required" });
      }

      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const existingFavourite = await prisma.productFavourite.findUnique({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });

      if (existingFavourite) {
        await prisma.productFavourite.delete({
          where: {
            id: existingFavourite.id,
          },
        });

        console.log("❌ Removed from favourites");

        return res.status(200).json({
          message: "Product removed from favourites",
          isLiked: false,
        });
      } else {
        await prisma.productFavourite.create({
          data: {
            userId,
            productId,
          },
        });

        console.log("✅ Added to favourites");

        return res.status(201).json({
          message: "Product added to favourites",
          isLiked: true,
        });
      }
    } catch (error) {
      console.error("❌ Toggle Favourite Error:", error);
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

      // All products in favourites are liked by definition
      const data = favourites.map((fav) => ({
        ...fav.product,
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
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = productController;
