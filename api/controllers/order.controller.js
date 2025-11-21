const prisma = require("../config/db");

const orderController = {
  // Create order with transaction (includes location creation)
  createOrder: async (req, res) => {
    try {
      const userId = req.user.id;
      const {
        restaurantId,
        notes,
        items, // Array of { productId, quantity }
        location, // { label, address, city, phoneNumber }
      } = req.body;

      // Validation
      if (!restaurantId || !items || items.length === 0 || !location) {
        return res.status(400).json({
          error: "restaurantId, items, and location are required",
        });
      }

      if (
        !location.label ||
        !location.address ||
        !location.city ||
        !location.phoneNumber
      ) {
        return res.status(400).json({
          error: "Location must have label, address, city, and phoneNumber",
        });
      }

      // Use transaction to ensure data consistency
      const result = await prisma.$transaction(async (tx) => {
        // 1. Check if restaurant exists
        const restaurant = await tx.restaurant.findUnique({
          where: { id: restaurantId },
          select: { id: true, name: true, deliveryFee: true, isActive: true },
        });

        if (!restaurant) {
          throw new Error("Restaurant not found");
        }

        if (!restaurant.isActive) {
          throw new Error("Restaurant is not available");
        }

        // 2. Validate and get all products
        const productIds = items.map((item) => item.productId);
        const products = await tx.product.findMany({
          where: {
            id: { in: productIds },
            restaurantId: restaurantId,
          },
        });

        if (products.length !== items.length) {
          throw new Error(
            "Some products not found or don't belong to this restaurant"
          );
        }

        // 3. Check stock availability and calculate total
        let totalAmount = 0;
        const orderItemsData = [];

        for (const item of items) {
          const product = products.find((p) => p.id === item.productId);

          if (!product) {
            throw new Error(`Product ${item.productId} not found`);
          }

          if (!product.isAvailable) {
            throw new Error(`Product "${product.name}" is not available`);
          }

          if (product.quantity < item.quantity) {
            throw new Error(
              `Insufficient stock for "${product.name}". Available: ${product.quantity}`
            );
          }

          // Calculate item total
          const itemTotal = product.price * item.quantity;
          totalAmount += itemTotal;

          // Prepare order item data
          orderItemsData.push({
            productId: product.id,
            productName: product.name,
            productPrice: product.price,
            productQyantity: product.quantity,
            productImgUrl: product.imgUrl,
            quantity: item.quantity,
          });

          // 4. Update product quantity
          const newQuantity = product.quantity - item.quantity;
          await tx.product.update({
            where: { id: product.id },
            data: {
              quantity: newQuantity,
              // If quantity becomes 0, set isAvailable to false
              isAvailable: newQuantity > 0 ? product.isAvailable : false,
            },
          });
        }

        // 5. Create location
        const createdLocation = await tx.location.create({
          data: {
            label: location.label,
            address: location.address,
            city: location.city,
            phoneNumber: location.phoneNumber,
            userId,
          },
        });

        // 6. Generate unique order number
        const orderNumber = `ORD-${Date.now()}-${Math.floor(
          Math.random() * 1000
        )}`;

        // 7. Create order
        const order = await tx.order.create({
          data: {
            orderNumber,
            totalAmount,
            deliveryFee: restaurant.deliveryFee || 0,
            status: "PENDING",
            notes,
            userId,
            restaurantId,
            orderItems: {
              create: orderItemsData,
            },
          },
          include: {
            orderItems: true,
            restaurant: {
              select: {
                id: true,
                name: true,
                imgUrl: true,
                phoneNumber: true,
              },
            },
          },
        });

        return {
          order,
          location: createdLocation,
        };
      });

      res.status(201).json({
        message: "Order and location created successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get all orders (ADMIN & RESTAURANT_OWNER)
  getAllOrders: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const status = req.query.status;

      const where = {};
      if (status) {
        where.status = status;
      }

      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdDate: "desc" },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                phoneNumber: true,
              },
            },
            restaurant: {
              select: {
                id: true,
                name: true,
                imgUrl: true,
              },
            },
            orderItems: true,
          },
        }),
        prisma.order.count({ where }),
      ]);

      res.status(200).json({
        data: orders,
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

  // Get my orders (authenticated user)
  getMyOrders: async (req, res) => {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const status = req.query.status;

      const where = { userId };
      if (status) {
        where.status = status;
      }

      const [orders, total] = await Promise.all([
        prisma.order.findMany({
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
                phoneNumber: true,
              },
            },
            orderItems: true,
          },
        }),
        prisma.order.count({ where }),
      ]);

      res.status(200).json({
        data: orders,
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

  // Get order by ID
  getOrderById: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;

      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              phoneNumber: true,
            },
          },
          restaurant: {
            select: {
              id: true,
              name: true,
              imgUrl: true,
              address: true,
              phoneNumber: true,
            },
          },
          orderItems: true,
        },
      });

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      // Check if user owns this order (unless admin)
      if (userRole !== "ADMIN" && order.userId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update order status (ADMIN & RESTAURANT_OWNER)
  updateOrderStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = [
        "PENDING",
        "CONFIRMED",
        "PREPARING",
        "READY",
        "DELIVERING",
        "DELIVERED",
        "CANCELLED",
      ];

      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
          error: `Invalid status. Valid statuses: ${validStatuses.join(", ")}`,
        });
      }

      const order = await prisma.order.update({
        where: { id },
        data: { status },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
          restaurant: {
            select: {
              id: true,
              name: true,
            },
          },
          orderItems: true,
        },
      });

      res.status(200).json({
        message: "Order status updated successfully",
        data: order,
      });
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Order not found" });
      }
      res.status(500).json({ error: error.message });
    }
  },

  // Delete order (USER only if status is PENDING)
  deleteOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Use transaction to ensure data consistency
      await prisma.$transaction(async (tx) => {
        // 1. Find the order with its items
        const order = await tx.order.findUnique({
          where: { id },
          include: {
            orderItems: true,
          },
        });

        if (!order) {
          throw new Error("Order not found");
        }

        // 2. Check if user owns this order
        if (order.userId !== userId) {
          throw new Error("Access denied. You can only delete your own orders");
        }

        // 3. Check if order status is PENDING
        if (order.status !== "PENDING") {
          throw new Error(
            `Cannot delete order with status "${order.status}". Only PENDING orders can be deleted`
          );
        }

        // 4. Restore product quantities
        for (const item of order.orderItems) {
          // Only restore quantity if productId exists (product not deleted)
          if (item.productId) {
            const product = await tx.product.findUnique({
              where: { id: item.productId },
            });

            if (product) {
              const newQuantity = product.quantity + item.quantity;

              await tx.product.update({
                where: { id: item.productId },
                data: {
                  quantity: newQuantity,
                  // If product was unavailable due to stock, make it available again
                  isAvailable: true,
                },
              });
            }
          }
        }

        // 5. Delete the order (orderItems will be deleted automatically due to cascade)
        await tx.order.delete({
          where: { id },
        });
      });

      res.status(200).json({
        message: "Order deleted successfully and product quantities restored",
      });
    } catch (error) {
      // Handle specific error messages
      if (error.message === "Order not found") {
        return res.status(404).json({ error: error.message });
      }
      if (
        error.message.includes("Access denied") ||
        error.message.includes("Cannot delete")
      ) {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = orderController;
