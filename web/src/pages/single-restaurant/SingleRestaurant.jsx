import * as S from "./singleRestaurant.styles";
import { useState, useEffect } from "react";
import {
  MapPin,
  Phone,
  Clock,
  Star,
  DollarSign,
  Truck,
  Heart,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Package,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

// RTKQ
import {
  useGetRestaurantByIdQuery,
  useToggleFavouriteMutation,
} from "../../store/restaurants/restaurantsSlice";
import {
  useGetProductsByRestaurantQuery,
  useToggleFavouriteMutation as useToggleProductFavouriteMutation,
} from "../../store/products/productsSlice";
import toast from "react-hot-toast";

function SingleRestaurant() {
  const { restaurantId: id } = useParams();
  const navigate = useNavigate();

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const productsPerPage = 8;

  // Fetch restaurant data
  const {
    data: restaurant,
    isLoading: isRestaurantLoading,
    isError: isRestaurantError,
    error: restaurantError,
    refetch: refetchRestaurant,
  } = useGetRestaurantByIdQuery(id, {
    skip: !id,
  });

  // Fetch products with pagination
  const {
    data: productsData,
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useGetProductsByRestaurantQuery(
    {
      restaurantId: id,
      page: currentPage,
      limit: productsPerPage,
      search: searchTerm,
      categoryId: selectedCategory === "all" ? "" : selectedCategory,
    },
    {
      skip: !id,
    }
  );

  // Toggle favourite mutation
  const [toggleFavourite, { isLoading: isTogglingFavourite }] =
    useToggleFavouriteMutation();

  // Toggle product favourite mutation
  const [toggleProductFavourite] = useToggleProductFavouriteMutation();

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  // Handle toggle favourite
  const handleToggleFavourite = async () => {
    try {
      const res = await toggleFavourite(id).unwrap();
      toast.success(`${res.message} ✅`);
      refetchRestaurant();
    } catch (error) {
      toast.error(error?.data?.error || "Failed to toggle favourite");
    }
  };

  // Handle toggle product favourite
  const handleToggleProductFavourite = async (productId, isLiked) => {
    try {
      const res = await toggleProductFavourite(productId).unwrap();
      toast.success(`${res.message} ✅`);
    } catch (error) {
      toast.error(error?.data?.error || "Failed to toggle product favourite");
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 600, behavior: "smooth" });
  };

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  // Loading state
  if (isRestaurantLoading) {
    return (
      <S.LoadingContainer>
        <Loader2 size={48} className="spin" />
        <p>Loading restaurant...</p>
      </S.LoadingContainer>
    );
  }

  // Error state
  if (isRestaurantError || !restaurant) {
    return (
      <S.ErrorContainer>
        <AlertCircle size={64} />
        <h2>Restaurant Not Found</h2>
        <p>
          {restaurantError?.data?.error ||
            "The restaurant you're looking for doesn't exist or has been removed."}
        </p>
        <S.BackButton onClick={() => navigate("/admin/restaurants")}>
          <ArrowLeft size={20} />
          Back to Restaurants
        </S.BackButton>
      </S.ErrorContainer>
    );
  }

  const products = productsData?.data || [];
  const pagination = productsData?.pagination || {
    page: 1,
    limit: productsPerPage,
    total: 0,
    totalPages: 1,
  };

  return (
    <S.Container>
      {/* Header Section */}
      <S.Header>
        <S.BackButton onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Back
        </S.BackButton>

        <S.FavouriteButton
          onClick={handleToggleFavourite}
          disabled={isTogglingFavourite}
          $isFavourite={restaurant.isLiked}
        >
          <Heart
            size={20}
            fill={restaurant.isLiked ? "currentColor" : "none"}
          />
          {restaurant.isLiked ? "Remove from Favourites" : "Add to Favourites"}
        </S.FavouriteButton>
      </S.Header>

      {/* Restaurant Hero */}
      <S.Hero>
        <S.HeroImage src={restaurant.imgUrl} alt={restaurant.name} />
        <S.HeroOverlay />
        <S.HeroContent>
          <S.RestaurantName>{restaurant.name}</S.RestaurantName>
          <S.RestaurantDescription>
            {restaurant.description}
          </S.RestaurantDescription>
          <S.RatingBadge>
            <Star size={18} fill="currentColor" />
            {restaurant.rating}
          </S.RatingBadge>
        </S.HeroContent>
      </S.Hero>

      {/* Restaurant Info Cards */}
      <S.InfoSection>
        <S.InfoCard>
          <MapPin size={24} />
          <div>
            <S.InfoLabel>Address</S.InfoLabel>
            <S.InfoValue>{restaurant.address}</S.InfoValue>
            <S.InfoSubValue>{restaurant.city}</S.InfoSubValue>
          </div>
        </S.InfoCard>

        <S.InfoCard>
          <Phone size={24} />
          <div>
            <S.InfoLabel>Phone</S.InfoLabel>
            <S.InfoValue>{restaurant.phoneNumber}</S.InfoValue>
          </div>
        </S.InfoCard>

        <S.InfoCard>
          <Clock size={24} />
          <div>
            <S.InfoLabel>Delivery Time</S.InfoLabel>
            <S.InfoValue>{restaurant.deliveryTime}</S.InfoValue>
          </div>
        </S.InfoCard>

        <S.InfoCard>
          <Truck size={24} />
          <div>
            <S.InfoLabel>Delivery Fee</S.InfoLabel>
            <S.InfoValue>${restaurant.deliveryFee}</S.InfoValue>
          </div>
        </S.InfoCard>

        <S.InfoCard>
          <DollarSign size={24} />
          <div>
            <S.InfoLabel>Minimum Order</S.InfoLabel>
            <S.InfoValue>${restaurant.minOrder}</S.InfoValue>
          </div>
        </S.InfoCard>

        <S.InfoCard>
          <Package size={24} />
          <div>
            <S.InfoLabel>Total Products</S.InfoLabel>
            <S.InfoValue>{restaurant._count?.products || 0}</S.InfoValue>
          </div>
        </S.InfoCard>
      </S.InfoSection>

      {/* Categories Section */}
      {restaurant.productCategories?.length > 0 && (
        <S.CategoriesSection>
          <S.SectionTitle>Categories</S.SectionTitle>
          <S.CategoriesGrid>
            <S.CategoryCard
              $active={selectedCategory === "all"}
              onClick={() => handleCategoryChange("all")}
            >
              <S.CategoryIcon>🍽️</S.CategoryIcon>
              <S.CategoryName>All Products</S.CategoryName>
              <S.CategoryCount>
                {restaurant._count?.products || 0}
              </S.CategoryCount>
            </S.CategoryCard>

            {restaurant.productCategories.map((category) => (
              <S.CategoryCard
                key={category.id}
                $active={selectedCategory === category.id}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.imgUrl ? (
                  <S.CategoryImage src={category.imgUrl} alt={category.name} />
                ) : (
                  <S.CategoryIcon>📦</S.CategoryIcon>
                )}
                <S.CategoryName>{category.name}</S.CategoryName>
                <S.CategoryCount>
                  {category._count?.products || 0}
                </S.CategoryCount>
              </S.CategoryCard>
            ))}
          </S.CategoriesGrid>
        </S.CategoriesSection>
      )}

      {/* Products Section */}
      <S.ProductsSection>
        <S.SectionTitle>
          {selectedCategory === "all"
            ? "All Products"
            : restaurant.productCategories?.find(
                (c) => c.id === selectedCategory
              )?.name || "Products"}
          <S.ProductCount>({pagination.total})</S.ProductCount>
        </S.SectionTitle>

        {isProductsLoading ? (
          <S.LoadingContainer>
            <Loader2 size={48} className="spin" />
            <p>Loading products...</p>
          </S.LoadingContainer>
        ) : isProductsError ? (
          <S.ErrorContainer>
            <AlertCircle size={48} />
            <p>Failed to load products. Please try again.</p>
          </S.ErrorContainer>
        ) : products.length > 0 ? (
          <>
            <S.ProductsGrid>
              {products.map((product) => (
                <S.ProductCard key={product.id}>
                  <S.ProductImageContainer>
                    <S.ProductImage src={product.imgUrl} alt={product.name} />
                    {!product.isAvailable && (
                      <S.UnavailableBadge>Out of Stock</S.UnavailableBadge>
                    )}
                    <S.ProductFavouriteButton
                      onClick={() =>
                        handleToggleProductFavourite(
                          product.id,
                          product.isLiked
                        )
                      }
                      $isFavourite={product.isLiked}
                    >
                      <Heart
                        size={20}
                        fill={product.isLiked ? "currentColor" : "none"}
                      />
                    </S.ProductFavouriteButton>
                  </S.ProductImageContainer>
                  <S.ProductContent>
                    <S.ProductName>{product.name}</S.ProductName>
                    {product.description && (
                      <S.ProductDescription>
                        {product.description}
                      </S.ProductDescription>
                    )}
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

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <S.PaginationContainer>
                <S.PaginationButton
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={20} />
                  Previous
                </S.PaginationButton>

                <S.PaginationInfo>
                  Page {pagination.page} of {pagination.totalPages}
                  <S.TotalItems>
                    ({pagination.total} total products)
                  </S.TotalItems>
                </S.PaginationInfo>

                <S.PaginationButton
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                >
                  Next
                  <ChevronRight size={20} />
                </S.PaginationButton>
              </S.PaginationContainer>
            )}
          </>
        ) : (
          <S.EmptyState>
            <Package size={64} />
            <h3>No Products Found</h3>
            <p>
              {selectedCategory === "all"
                ? "This restaurant doesn't have any products yet."
                : "No products in this category."}
            </p>
          </S.EmptyState>
        )}
      </S.ProductsSection>
    </S.Container>
  );
}

export default SingleRestaurant;
