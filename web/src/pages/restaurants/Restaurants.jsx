import * as S from "./restaurants.styles";
import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Star,
  MapPin,
  Clock,
  DollarSign,
} from "lucide-react";
import { DataGrid } from "@mui/x-data-grid";
import { NavLink } from "react-router-dom";

// Components
import CreateRestaurant from "../../components/restaurants/create/CreateRestaurant";
import UpdateRestaurant from "../../components/restaurants/update/UpdateRestaurant";

// RTKQ
import {
  useGetAllRestaurantsQuery,
  useDeleteRestaurantMutation,
} from "../../store/restaurants/restaurantsSlice";
import toast from "react-hot-toast";

function Restaurants() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch restaurants
  const {
    data: restaurantsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllRestaurantsQuery({
    page,
    limit: pageSize,
    search: debouncedSearch,
  });

  const [deleteRestaurant, { isLoading: isDeleting }] =
    useDeleteRestaurantMutation();

  // Handle delete - wrapped with useCallback
  const handleDelete = useCallback(
    async (id, name) => {
      if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
        try {
          await deleteRestaurant(id).unwrap();
          toast.success(`${name} deleted successfully!`);
        } catch (err) {
          const errorMessage =
            err?.data?.error || "Failed to delete restaurant";
          toast.error(errorMessage);
        }
      }
    },
    [deleteRestaurant]
  );

  // Handle edit - wrapped with useCallback
  const handleEdit = useCallback((restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsUpdateModalOpen(true);
  }, []);

  // Handle add new
  const handleAddNew = () => {
    setIsCreateModalOpen(true);
  };

  // Handle modal success (refresh data)
  const handleModalSuccess = () => {
    refetch();
  };

  // Define columns
  const columns = useMemo(
    () => [
      {
        field: "restaurant",
        headerName: "Restaurant",
        flex: 1,
        minWidth: 300,
        renderCell: (params) => (
          <S.RestaurantInfo>
            <S.RestaurantImage src={params.row.imgUrl} alt={params.row.name} />
            <NavLink
              to={`/admin/restaurants/${params.row.id}`}
              className="link"
            >
              <S.RestaurantDetails>
                <S.RestaurantName>{params.row.name}</S.RestaurantName>
                <S.RestaurantAddress>
                  <MapPin
                    size={12}
                    style={{ display: "inline", marginRight: "4px" }}
                  />
                  {params.row.address}, {params.row.city}
                </S.RestaurantAddress>
              </S.RestaurantDetails>
            </NavLink>
          </S.RestaurantInfo>
        ),
      },
      {
        field: "rating",
        headerName: "Rating",
        width: 120,
        renderCell: (params) => (
          <S.Rating>
            <Star size={16} fill="#f39c12" />
            {params.row.rating}
          </S.Rating>
        ),
      },
      {
        field: "deliveryTime",
        headerName: "Delivery",
        width: 130,
        renderCell: (params) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "14px",
            }}
          >
            <Clock size={14} color="#7f8c8d" />
            {params.row.deliveryTime}
          </div>
        ),
      },
      {
        field: "deliveryFee",
        headerName: "Fee",
        width: 100,
        renderCell: (params) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            <DollarSign size={14} color="#27ae60" />
            {params.row.deliveryFee.toFixed(2)}
          </div>
        ),
      },
      {
        field: "minOrder",
        headerName: "Min Order",
        width: 110,
        renderCell: (params) => (
          <div style={{ fontSize: "14px", fontWeight: 600, color: "#34495e" }}>
            ${params.row.minOrder}
          </div>
        ),
      },
      {
        field: "isActive",
        headerName: "Status",
        width: 120,
        renderCell: (params) => (
          <S.Badge $active={params.row.isActive}>
            {params.row.isActive ? "Active" : "Inactive"}
          </S.Badge>
        ),
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 120,
        sortable: false,
        renderCell: (params) => (
          <S.ActionButtons>
            <S.IconButton
              $variant="edit"
              onClick={() => handleEdit(params.row)}
              title="Edit"
            >
              <Edit size={18} />
            </S.IconButton>
            <S.IconButton
              $variant="delete"
              onClick={() => handleDelete(params.row.id, params.row.name)}
              disabled={isDeleting}
              title="Delete"
            >
              <Trash2 size={18} />
            </S.IconButton>
          </S.ActionButtons>
        ),
      },
    ],
    [isDeleting, handleDelete, handleEdit]
  );

  // Prepare rows
  const rows = restaurantsData?.data || [];
  const totalRows = restaurantsData?.pagination?.total || 0;

  // Loading state
  if (isLoading && !restaurantsData) {
    return (
      <S.Container>
        <S.StyledPaper>
          <S.LoadingContainer>
            <div>Loading restaurants...</div>
          </S.LoadingContainer>
        </S.StyledPaper>
      </S.Container>
    );
  }

  // Error state
  if (isError) {
    return (
      <S.Container>
        <S.StyledPaper>
          <S.ErrorContainer>
            <S.ErrorText>
              {error?.data?.message || "Failed to load restaurants"}
            </S.ErrorText>
            <S.RetryButton onClick={refetch}>Retry</S.RetryButton>
          </S.ErrorContainer>
        </S.StyledPaper>
      </S.Container>
    );
  }

  return (
    <S.Container>
      <S.Header>
        <S.Title>Restaurants Management</S.Title>
        <S.Subtitle>
          Manage your restaurants, view details, and track performance
        </S.Subtitle>
      </S.Header>

      <S.StyledPaper>
        <S.ToolBar>
          <S.SearchWrapper>
            <S.SearchIcon>
              <Search size={20} />
            </S.SearchIcon>
            <S.SearchInput
              type="text"
              placeholder="Search restaurants by name, city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </S.SearchWrapper>
          <S.AddButton onClick={handleAddNew}>
            <Plus size={20} />
            Add Restaurant
          </S.AddButton>
        </S.ToolBar>

        <S.TableWrapper>
          <DataGrid
            rows={rows}
            columns={columns}
            rowCount={totalRows}
            loading={isLoading}
            pageSizeOptions={[5, 10, 25, 50]}
            paginationModel={{
              page: page - 1,
              pageSize: pageSize,
            }}
            onPaginationModelChange={(model) => {
              setPage(model.page + 1);
              setPageSize(model.pageSize);
            }}
            paginationMode="server"
            disableRowSelectionOnClick
            autoHeight
            getRowHeight={() => "auto"}
            sx={{
              "& .MuiDataGrid-cell": {
                py: 2,
              },
            }}
          />
        </S.TableWrapper>
      </S.StyledPaper>

      {/* Create Modal */}
      <CreateRestaurant
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleModalSuccess}
      />

      {/* Update Modal */}
      <UpdateRestaurant
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedRestaurant(null);
        }}
        restaurant={selectedRestaurant}
        onSuccess={handleModalSuccess}
      />
    </S.Container>
  );
}

export default Restaurants;
