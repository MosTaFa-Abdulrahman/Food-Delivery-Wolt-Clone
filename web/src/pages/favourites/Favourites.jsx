import * as S from "./favourites.styles";
import { useState } from "react";
import {
  Heart,
  Loader2,
  AlertCircle,
  Star,
  MapPin,
  Clock,
  Truck,
  Package,
  ShoppingCart,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// RTKQ
import {
  useGetMyFavouritesQuery as useGetFavouriteRestaurantsQuery,
  useToggleFavouriteMutation,
} from "../../store/restaurants/restaurantsSlice";
import {
  useGetMyFavouritesQuery as useGetFavouriteProductsQuery,
  useToggleFavouriteMutation as useToggleProductFavouriteMutation,
} from "../../store/products/productsSlice";
import toast from "react-hot-toast";

function Favourites() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("restaurants"); // 'restaurants' or 'products'

  // Fetch favourite restaurants
  const {
    data: restaurantsData,
    isLoading: isRestaurantsLoading,
    isError: isRestaurantsError,
  } = useGetFavouriteRestaurantsQuery();

  // Fetch favourite products
  const {
    data: productsData,
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useGetFavouriteProductsQuery();

  // Toggle mutations
  const [toggleRestaurantFavourite] = useToggleFavouriteMutation();
  const [toggleProductFavourite] = useToggleProductFavouriteMutation();

  // Handle toggle restaurant favourite
  const handleToggleRestaurantFavourite = async (restaurantId) => {
    try {
      const res = await toggleRestaurantFavourite(restaurantId).unwrap();
      toast.success(`${res.message} ✅`);
    } catch (error) {
      toast.error(
        error?.data?.error || "Failed to remove restaurant from favourites"
      );
    }
  };

  // Handle toggle product favourite
  const handleToggleProductFavourite = async (productId) => {
    try {
      const res = await toggleProductFavourite(productId).unwrap();
      toast.success(`${res.message} ✅`);
    } catch (error) {
      toast.error(
        error?.data?.error || "Failed to remove product from favourites"
      );
    }
  };

  const favouriteRestaurants = restaurantsData?.data || [];
  const favouriteProducts = productsData?.data || [];

  return (
    <S.Container>
      {/* Header */}
      <S.PageHeader>
        <S.HeaderContent>
          <S.HeaderIcon>
            <Heart size={40} fill="currentColor" />
          </S.HeaderIcon>
          <div>
            <S.PageTitle>My Favourites</S.PageTitle>
            <S.PageSubtitle>
              All your favourite restaurants and products in one place
            </S.PageSubtitle>
          </div>
        </S.HeaderContent>
        <S.StatsContainer>
          <S.StatCard>
            <S.StatNumber>{favouriteRestaurants.length}</S.StatNumber>
            <S.StatLabel>Restaurants</S.StatLabel>
          </S.StatCard>
          <S.StatCard>
            <S.StatNumber>{favouriteProducts.length}</S.StatNumber>
            <S.StatLabel>Products</S.StatLabel>
          </S.StatCard>
        </S.StatsContainer>
      </S.PageHeader>

      {/* Tabs */}
      <S.TabsContainer>
        <S.Tab
          $active={activeTab === "restaurants"}
          onClick={() => setActiveTab("restaurants")}
        >
          <Heart size={20} />
          Favourite Restaurants
          <S.TabBadge>{favouriteRestaurants.length}</S.TabBadge>
        </S.Tab>
        <S.Tab
          $active={activeTab === "products"}
          onClick={() => setActiveTab("products")}
        >
          <Sparkles size={20} />
          Favourite Products
          <S.TabBadge>{favouriteProducts.length}</S.TabBadge>
        </S.Tab>
      </S.TabsContainer>

      {/* Restaurants Section */}
      {activeTab === "restaurants" && (
        <S.Section>
          <S.SectionHeader>
            <S.SectionTitle>Favourite Restaurants</S.SectionTitle>
            <S.SectionCount>{favouriteRestaurants.length} total</S.SectionCount>
          </S.SectionHeader>

          {isRestaurantsLoading ? (
            <S.LoadingContainer>
              <Loader2 size={48} className="spin" />
              <p>Loading favourite restaurants...</p>
            </S.LoadingContainer>
          ) : isRestaurantsError ? (
            <S.ErrorContainer>
              <AlertCircle size={48} />
              <p>Failed to load favourite restaurants. Please try again.</p>
            </S.ErrorContainer>
          ) : favouriteRestaurants.length > 0 ? (
            <S.RestaurantsGrid>
              {favouriteRestaurants.map((restaurant) => (
                <S.RestaurantCard key={restaurant.id}>
                  <S.RestaurantImageContainer
                    onClick={() =>
                      navigate(`/admin/restaurants/${restaurant.id}`)
                    }
                  >
                    <S.RestaurantImage
                      src={restaurant.imgUrl}
                      alt={restaurant.name}
                    />
                    <S.RestaurantOverlay />
                    <S.RatingBadge>
                      <Star size={16} fill="currentColor" />
                      {restaurant.rating}
                    </S.RatingBadge>
                    <S.FavouriteButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleRestaurantFavourite(restaurant.id);
                      }}
                      $isFavourite={true}
                    >
                      <Heart size={20} fill="currentColor" />
                    </S.FavouriteButton>
                  </S.RestaurantImageContainer>

                  <S.RestaurantContent>
                    <S.RestaurantName
                      onClick={() =>
                        navigate(`/admin/restaurants/${restaurant.id}`)
                      }
                    >
                      {restaurant.name}
                    </S.RestaurantName>
                    <S.RestaurantDescription>
                      {restaurant.description}
                    </S.RestaurantDescription>

                    <S.RestaurantInfo>
                      <S.InfoItem>
                        <MapPin size={16} />
                        {restaurant.city}
                      </S.InfoItem>
                      <S.InfoItem>
                        <Clock size={16} />
                        {restaurant.deliveryTime}
                      </S.InfoItem>
                    </S.RestaurantInfo>

                    <S.RestaurantFooter>
                      <S.DeliveryInfo>
                        <Truck size={16} />${restaurant.deliveryFee}
                      </S.DeliveryInfo>
                      <S.ViewButton
                        onClick={() =>
                          navigate(`/admin/restaurants/${restaurant.id}`)
                        }
                      >
                        View Menu
                      </S.ViewButton>
                    </S.RestaurantFooter>
                  </S.RestaurantContent>
                </S.RestaurantCard>
              ))}
            </S.RestaurantsGrid>
          ) : (
            <S.EmptyState>
              <Heart size={64} />
              <h3>No Favourite Restaurants</h3>
              <p>
                You haven't added any restaurants to your favourites yet. Start
                exploring and save your favourites!
              </p>
              <S.ExploreButton onClick={() => navigate("/admin/restaurants")}>
                Explore Restaurants
              </S.ExploreButton>
            </S.EmptyState>
          )}
        </S.Section>
      )}

      {/* Products Section */}
      {activeTab === "products" && (
        <S.Section>
          <S.SectionHeader>
            <S.SectionTitle>Favourite Products</S.SectionTitle>
            <S.SectionCount>{favouriteProducts.length} total</S.SectionCount>
          </S.SectionHeader>

          {isProductsLoading ? (
            <S.LoadingContainer>
              <Loader2 size={48} className="spin" />
              <p>Loading favourite products...</p>
            </S.LoadingContainer>
          ) : isProductsError ? (
            <S.ErrorContainer>
              <AlertCircle size={48} />
              <p>Failed to load favourite products. Please try again.</p>
            </S.ErrorContainer>
          ) : favouriteProducts.length > 0 ? (
            <S.ProductsGrid>
              {favouriteProducts.map((product) => (
                <S.ProductCard key={product.id}>
                  <S.ProductImageContainer>
                    <S.ProductImage src={product.imgUrl} alt={product.name} />
                    {!product.isAvailable && (
                      <S.UnavailableBadge>Out of Stock</S.UnavailableBadge>
                    )}
                    <S.ProductFavouriteButton
                      onClick={() => handleToggleProductFavourite(product.id)}
                      $isFavourite={true}
                    >
                      <Heart size={20} fill="currentColor" />
                    </S.ProductFavouriteButton>
                  </S.ProductImageContainer>

                  <S.ProductContent>
                    <S.ProductName>{product.name}</S.ProductName>
                    {product.description && (
                      <S.ProductDescription>
                        {product.description}
                      </S.ProductDescription>
                    )}

                    <S.ProductCategory>
                      <Package size={14} />
                      {product.category?.name || "Uncategorized"}
                    </S.ProductCategory>

                    <S.ProductFooter>
                      <S.ProductPrice>${product.price}</S.ProductPrice>
                      <S.ProductQuantity>
                        <Package size={16} />
                        Qty: {product.quantity}
                      </S.ProductQuantity>
                    </S.ProductFooter>

                    <S.AddToCartButton disabled={!product.isAvailable}>
                      <ShoppingCart size={18} />
                      {product.isAvailable ? "Add to Cart" : "Unavailable"}
                    </S.AddToCartButton>
                  </S.ProductContent>
                </S.ProductCard>
              ))}
            </S.ProductsGrid>
          ) : (
            <S.EmptyState>
              <Sparkles size={64} />
              <h3>No Favourite Products</h3>
              <p>
                You haven't added any products to your favourites yet. Browse
                through menus and save your favourite dishes!
              </p>
              <S.ExploreButton onClick={() => navigate("/restaurants")}>
                Browse Products
              </S.ExploreButton>
            </S.EmptyState>
          )}
        </S.Section>
      )}
    </S.Container>
  );
}

export default Favourites;
