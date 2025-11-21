import * as S from "./singleUser.styles";
import { useState, useMemo } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  ShoppingBag,
  Heart,
  UtensilsCrossed,
  ArrowLeft,
} from "lucide-react";
import { DataGrid } from "@mui/x-data-grid";
import { useParams, useNavigate } from "react-router-dom";

// RTKQ
import { useGetUserByIdQuery } from "../../store/users/usersSlice";
import { useGetMyOrdersQuery } from "../../store/orders/ordersSlice";
import { useGetMyFavouritesQuery } from "../../store/restaurants/restaurantsSlice";
import { useGetMyFavouritesQuery as useGetFavouriteProductsQuery } from "../../store/products/productsSlice";

function SingleUser() {
  const { userId } = useParams();
  const navigate = useNavigate();

  // States
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersPageSize, setOrdersPageSize] = useState(5);

  // Fetch user data
  const {
    data: userData,
    isLoading: userLoading,
    isError: userError,
    error: userErrorData,
  } = useGetUserByIdQuery(userId);

  // Fetch user's orders
  const {
    data: ordersData,
    isLoading: ordersLoading,
    isError: ordersError,
  } = useGetMyOrdersQuery({
    page: ordersPage,
    limit: ordersPageSize,
  });

  // Fetch user's favourite restaurants
  const { data: favouriteRestaurants, isLoading: restaurantsLoading } =
    useGetMyFavouritesQuery();

  // Fetch user's favourite products
  const { data: favouriteProducts, isLoading: productsLoading } =
    useGetFavouriteProductsQuery({ page: 1, limit: 100 });

  // Handle back navigation
  const handleBack = () => {
    navigate("/admin/users");
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const colors = {
      PENDING: "#f39c12",
      CONFIRMED: "#3498db",
      PREPARING: "#9b59b6",
      READY: "#1abc9c",
      DELIVERING: "#3498db",
      DELIVERED: "#27ae60",
      CANCELLED: "#e74c3c",
    };
    return colors[status] || "#95a5a6";
  };

  // Orders columns
  const ordersColumns = useMemo(
    () => [
      {
        field: "orderNumber",
        headerName: "Order #",
        width: 150,
        renderCell: (params) => <S.OrderNumber>#{params.value}</S.OrderNumber>,
      },
      {
        field: "restaurant",
        headerName: "Restaurant",
        flex: 1,
        minWidth: 200,
        renderCell: (params) => (
          <S.RestaurantName>
            <UtensilsCrossed size={14} />
            {params.row.restaurant?.name || "N/A"}
          </S.RestaurantName>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        width: 140,
        renderCell: (params) => (
          <S.StatusBadge $color={getStatusColor(params.value)}>
            {params.value}
          </S.StatusBadge>
        ),
      },
      {
        field: "totalAmount",
        headerName: "Total",
        width: 120,
        renderCell: (params) => (
          <S.PriceText>${params.value.toFixed(2)}</S.PriceText>
        ),
      },
      {
        field: "createdDate",
        headerName: "Order Date",
        width: 160,
        renderCell: (params) => (
          <S.DateText>{new Date(params.value).toLocaleDateString()}</S.DateText>
        ),
      },
    ],
    []
  );

  // Loading state
  if (userLoading) {
    return (
      <S.Container>
        <S.LoadingContainer>
          <S.Spinner />
          <div>Loading user details...</div>
        </S.LoadingContainer>
      </S.Container>
    );
  }

  // Error state
  if (userError) {
    return (
      <S.Container>
        <S.ErrorContainer>
          <S.ErrorText>
            {userErrorData?.data?.message || "Failed to load user details"}
          </S.ErrorText>
          <S.BackButton onClick={handleBack}>
            <ArrowLeft size={20} />
            Back to Users
          </S.BackButton>
        </S.ErrorContainer>
      </S.Container>
    );
  }

  const user = userData?.user;
  const orders = ordersData?.data || [];
  const totalOrders = ordersData?.pagination?.total || 0;

  return (
    <S.Container>
      {/* Header with Back Button */}
      <S.HeaderSection>
        <S.BackButton onClick={handleBack}>
          <ArrowLeft size={20} />
          Back to Users
        </S.BackButton>
      </S.HeaderSection>

      {/* User Profile Card */}
      <S.ProfileCard>
        <S.ProfileHeader>
          <S.AvatarSection>
            <S.Avatar>
              {user?.imgUrl ? (
                <S.AvatarImage src={user.imgUrl} alt={user.username} />
              ) : (
                <S.AvatarPlaceholder>
                  {user?.username?.charAt(0).toUpperCase()}
                </S.AvatarPlaceholder>
              )}
            </S.Avatar>
            <S.UserMainInfo>
              <S.UserName>{user?.username}</S.UserName>
              <S.UserEmail>
                <Mail size={16} />
                {user?.email}
              </S.UserEmail>
              <S.RoleBadge
                $color={user?.role === "ADMIN" ? "#e74c3c" : "#3498db"}
              >
                <Shield size={14} />
                {user?.role}
              </S.RoleBadge>
            </S.UserMainInfo>
          </S.AvatarSection>
        </S.ProfileHeader>

        <S.ProfileBody>
          <S.InfoGrid>
            <S.InfoItem>
              <S.InfoLabel>
                <User size={16} />
                Full Name
              </S.InfoLabel>
              <S.InfoValue>
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : "Not provided"}
              </S.InfoValue>
            </S.InfoItem>

            <S.InfoItem>
              <S.InfoLabel>
                <Phone size={16} />
                Phone Number
              </S.InfoLabel>
              <S.InfoValue>
                {user?.phoneNumber?.replace(/"/g, "") || "Not provided"}
              </S.InfoValue>
            </S.InfoItem>

            <S.InfoItem>
              <S.InfoLabel>
                <MapPin size={16} />
                City
              </S.InfoLabel>
              <S.InfoValue>{user?.city || "Not provided"}</S.InfoValue>
            </S.InfoItem>

            <S.InfoItem>
              <S.InfoLabel>
                <Calendar size={16} />
                Joined Date
              </S.InfoLabel>
              <S.InfoValue>
                {new Date(user?.createdDate).toLocaleDateString()}
              </S.InfoValue>
            </S.InfoItem>
          </S.InfoGrid>
        </S.ProfileBody>
      </S.ProfileCard>

      {/* Statistics Grid */}
      <S.StatsGrid>
        <S.StatCard>
          <S.StatIcon $color="#3498db">
            <ShoppingBag size={28} />
          </S.StatIcon>
          <S.StatContent>
            <S.StatLabel>Total Orders</S.StatLabel>
            <S.StatValue>{totalOrders}</S.StatValue>
          </S.StatContent>
        </S.StatCard>

        <S.StatCard>
          <S.StatIcon $color="#e74c3c">
            <Heart size={28} />
          </S.StatIcon>
          <S.StatContent>
            <S.StatLabel>Favourite Restaurants</S.StatLabel>
            <S.StatValue>
              {restaurantsLoading
                ? "..."
                : favouriteRestaurants?.data?.length || 0}
            </S.StatValue>
          </S.StatContent>
        </S.StatCard>

        <S.StatCard>
          <S.StatIcon $color="#f39c12">
            <UtensilsCrossed size={28} />
          </S.StatIcon>
          <S.StatContent>
            <S.StatLabel>Favourite Products</S.StatLabel>
            <S.StatValue>
              {productsLoading ? "..." : favouriteProducts?.data?.length || 0}
            </S.StatValue>
          </S.StatContent>
        </S.StatCard>
      </S.StatsGrid>

      {/* Orders Section */}
      <S.Section>
        <S.SectionHeader>
          <S.SectionTitle>
            <ShoppingBag size={24} />
            Order History
          </S.SectionTitle>
        </S.SectionHeader>

        <S.TableWrapper>
          {ordersLoading ? (
            <S.LoadingContainer>
              <S.Spinner />
              <div>Loading orders...</div>
            </S.LoadingContainer>
          ) : ordersError || orders.length === 0 ? (
            <S.EmptyState>
              <ShoppingBag size={48} />
              <S.EmptyStateText>No orders found</S.EmptyStateText>
              <S.EmptyStateSubtext>
                This user hasn't placed any orders yet
              </S.EmptyStateSubtext>
            </S.EmptyState>
          ) : (
            <DataGrid
              rows={orders}
              columns={ordersColumns}
              rowCount={totalOrders}
              loading={ordersLoading}
              pageSizeOptions={[5, 10, 25]}
              paginationModel={{
                page: ordersPage - 1,
                pageSize: ordersPageSize,
              }}
              onPaginationModelChange={(model) => {
                setOrdersPage(model.page + 1);
                setOrdersPageSize(model.pageSize);
              }}
              paginationMode="server"
              disableRowSelectionOnClick
              autoHeight
              sx={{
                border: "none",
                "& .MuiDataGrid-cell": {
                  py: 2,
                },
              }}
            />
          )}
        </S.TableWrapper>
      </S.Section>

      {/* Favourites Section */}
      <S.FavouritesGrid>
        {/* Favourite Restaurants */}
        <S.FavouriteSection>
          <S.SectionHeader>
            <S.SectionTitle>
              <Heart size={20} />
              Favourite Restaurants
            </S.SectionTitle>
          </S.SectionHeader>
          <S.FavouriteList>
            {restaurantsLoading ? (
              <S.LoadingText>Loading...</S.LoadingText>
            ) : favouriteRestaurants?.data?.length > 0 ? (
              favouriteRestaurants?.data?.map((fav) => (
                <S.FavouriteItem key={fav.id}>
                  <S.FavouriteIcon>
                    {fav.imgUrl ? (
                      <img
                        src={fav.imgUrl}
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "10%",
                        }}
                      />
                    ) : (
                      <UtensilsCrossed size={20} />
                    )}
                  </S.FavouriteIcon>
                  <S.FavouriteInfo>
                    <S.FavouriteName>
                      {fav?.name || "Restaurant"}
                    </S.FavouriteName>
                    <S.FavouriteDetail>{fav?.city || "City"}</S.FavouriteDetail>
                  </S.FavouriteInfo>
                </S.FavouriteItem>
              ))
            ) : (
              <S.EmptyFavourite>No favourite restaurants</S.EmptyFavourite>
            )}
          </S.FavouriteList>
        </S.FavouriteSection>

        {/* Favourite Products */}
        <S.FavouriteSection>
          <S.SectionHeader>
            <S.SectionTitle>
              <Heart size={20} />
              Favourite Products
            </S.SectionTitle>
          </S.SectionHeader>
          <S.FavouriteList>
            {productsLoading ? (
              <S.LoadingText>Loading...</S.LoadingText>
            ) : favouriteProducts?.data?.length > 0 ? (
              favouriteProducts.data.slice(0, 10).map((fav) => (
                <S.FavouriteItem key={fav.id}>
                  <S.FavouriteIcon>
                    {fav?.imgUrl ? (
                      <img
                        src={fav.imgUrl}
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "10%",
                        }}
                      />
                    ) : (
                      <UtensilsCrossed size={20} />
                    )}
                  </S.FavouriteIcon>
                  <S.FavouriteInfo>
                    <S.FavouriteName>{fav?.name || "Product"}</S.FavouriteName>
                    <S.FavouriteDetail>
                      ${fav?.price?.toFixed(2) || "0.00"}
                    </S.FavouriteDetail>
                  </S.FavouriteInfo>
                </S.FavouriteItem>
              ))
            ) : (
              <S.EmptyFavourite>No favourite products</S.EmptyFavourite>
            )}
          </S.FavouriteList>
        </S.FavouriteSection>
      </S.FavouritesGrid>
    </S.Container>
  );
}

export default SingleUser;
