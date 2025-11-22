# 🍽️ Wolt-Clone — Full-Stack Food Delivery App

A production-ready **food delivery platform** inspired by Wolt, built with:

- **Express.js** + **Prisma ORM** + **PostgreSQL**
- **React.js** + **RTK Query** + **Styled-Components**
- **React-Native (Expo)** mobile app + **React-Query**

Supports **restaurants**, **products**, **categories**, **favorites**, **orders**, **authentication**, and an **admin panel**.

---

## 🚀 Tech Stack

### **Backend**

- **Express.js** (v5)
- **Prisma ORM** (v6)
- **PostgreSQL**
- **JWT Authentication**
- **BCrypt Password Hashing**
- **Node-Cron**
- **Helmet, CORS**
- **Cookie-based auth**

### **Frontend (Web)**

- **React.js 19**
- **Redux Toolkit + RTK Query**
- **Styled-Components**
- **React Router**
- **Modern UI + Fully Responsive**

### **Mobile App**

- **React-Native (Expo 54)**
- **Expo Router**
- **@expo/vector-icons**
- **React Navigation**
- **Expo Image**
- **Beautiful Native UI**

---

# 📦 Features Overview

## 🔐 Authentication & User Management

- Register / Login / Logout
- JWT + Cookies
- Protected routes
- Get profile
- Update & delete profile

---

## 🍔 Restaurants & Categories

- Fetch all restaurants
- Get restaurant by ID
- Get restaurants by category
- Favourite / unfavourite
- Admin CRUD operations

---

## 🛒 Product & Product Categories

- Fetch all products
- Get by restaurant
- Get by category
- Favourite products
- Admin CRUD operations
- Toggle favourite products

---

## 📦 Orders System

### User

- Create order
- Get my orders
- Get order by ID

### Admin

- Fetch all orders
- Update order status
- Role-based authorization

---

## 🧩 Database (Prisma + PostgreSQL)

Prisma models for:

- User
- Restaurant
- RestaurantCategory
- Product
- ProductCategory
- Order
- OrderItem
- FavouriteRestaurants
- FavouriteProducts
