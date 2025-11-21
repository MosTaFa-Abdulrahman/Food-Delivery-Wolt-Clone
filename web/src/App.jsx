import { useContext } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  ScrollRestoration,
} from "react-router-dom";

// Context
import { AuthContext } from "./context/AuthContext";

// Navbar & Footer
import Navbar from "./components/global/navbar/Navbar";
import Footer from "./components/global/footer/Footer";

// Pages ((ADMIN && RESTAURANT_OWNER))
import Home from "./pages/home/Home";
import Login from "./pages/auth/Login";
import NotFound from "./pages/notFound/NotFound";
import SingleRestaurant from "./pages/single-restaurant/SingleRestaurant";
import Favourites from "./pages/favourites/Favourites";
import Restaurants from "./pages/restaurants/Restaurants";
import Products from "./pages/products/Products";
import Orders from "./pages/orders/Orders";
import Users from "./pages/users/Users";
import SingleUser from "./pages/single-user/SingleUser";

// Dashboard layout
const DashboardLayout = () => {
  return (
    <>
      <Navbar />
      <ScrollRestoration />
      <Outlet />
      <Footer />
    </>
  );
};

// Simple layout for auth pages
const SimpleLayout = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

// Protected ((ADMIN && RESTAURANT_OWNER))
const AdminManagerRoute = ({ element }) => {
  const { currentUser } = useContext(AuthContext);

  if (
    !currentUser ||
    (currentUser?.role !== "ADMIN" && currentUser?.role !== "RESTAURANT_OWNER")
  ) {
    return <Navigate to="/" />;
  }

  return element;
};

// Protected ((Auth))
const AuthenticatedRoute = ({ element }) => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return element;
};

function App() {
  const { currentUser } = useContext(AuthContext);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <DashboardLayout />,
      children: [
        // Authenticated ((ADMIN && RESTAURANT_OWNER))
        {
          path: "/",
          element: <AdminManagerRoute element={<Home />} />,
        },
        {
          path: "/my-favourites",
          element: <AdminManagerRoute element={<Favourites />} />,
        },
        {
          path: "/admin/restaurants/:restaurantId",
          element: <AdminManagerRoute element={<SingleRestaurant />} />,
        },
        {
          path: "/admin/restaurants",
          element: <AdminManagerRoute element={<Restaurants />} />,
        },
        {
          path: "/admin/products",
          element: <AdminManagerRoute element={<Products />} />,
        },
        {
          path: "/admin/orders",
          element: <AdminManagerRoute element={<Orders />} />,
        },
        {
          path: "/admin/users",
          element: <AdminManagerRoute element={<Users />} />,
        },
        {
          path: "/admin/users/:userId",
          element: <AdminManagerRoute element={<SingleUser />} />,
        },
      ],
    },

    {
      path: "/",
      element: <SimpleLayout />,
      children: [
        {
          path: "/login",
          element: !currentUser ? <Login /> : <Navigate to="/" />,
        },

        { path: "*", element: <NotFound /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
