const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

// Config
const prisma = require("./config/db");

// Routes
const authRoute = require("./routes/auth.route");
const usersRoute = require("./routes/user.route");
const restaurantsRoute = require("./routes/restaurant.route");
const productCategoriesRoute = require("./routes/product-category.route");
const productsRoute = require("./routes/product.route");
const ordersRoute = require("./routes/order.route");

// Express Usages
dotenv.config();
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
const corsOptions = {
  origin: ["http://localhost:8081", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  exposedHeaders: ["Set-Cookie"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

// Database Config
app.get("/", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ message: "Server and database connected successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Database connection failed", details: error.message });
  }
});

// MiddleWares
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/restaurants", restaurantsRoute);
app.use("/api/product-categories", productCategoriesRoute);
app.use("/api/products", productsRoute);
app.use("/api/orders", ordersRoute);

app.listen(PORT, () => console.log(`Server Running on PORT ${PORT} 🥰`));
