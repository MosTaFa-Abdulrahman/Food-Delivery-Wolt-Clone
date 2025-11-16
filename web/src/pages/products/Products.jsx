import * as S from "./products.styles";
import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Package,
  DollarSign,
  Heart,
  Store,
  Tag,
} from "lucide-react";
import { DataGrid } from "@mui/x-data-grid";

// Components
import CreateProduct from "../../components/products/create/CreateProduct";
import UpdateProduct from "../../components/products/update/UpdateProduct";

// RTKQ
import {
  useGetAllProductsQuery,
  useDeleteProductMutation,
} from "../../store/products/productsSlice";
import toast from "react-hot-toast";

function Products() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch products
  const {
    data: productsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllProductsQuery({
    page,
    limit: pageSize,
    search: debouncedSearch,
  });

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  // Handle delete
  const handleDelete = useCallback(
    async (id, name) => {
      if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
        try {
          await deleteProduct(id).unwrap();
          toast.success(`${name} deleted successfully!`);
        } catch (err) {
          const errorMessage = err?.data?.error || "Failed to delete product";
          toast.error(errorMessage);
        }
      }
    },
    [deleteProduct]
  );

  // Handle edit
  const handleEdit = useCallback((product) => {
    setSelectedProduct(product);
    setIsUpdateModalOpen(true);
  }, []);

  // Handle add new
  const handleAddNew = () => {
    setIsCreateModalOpen(true);
  };

  // Handle modal success
  const handleModalSuccess = () => {
    refetch();
  };

  // Define columns
  const columns = useMemo(
    () => [
      {
        field: "product",
        headerName: "Product",
        flex: 1,
        minWidth: 300,
        renderCell: (params) => (
          <S.ProductInfo>
            <S.ProductImage
              src={params.row.imgUrl || "/placeholder-product.png"}
              alt={params.row.name}
            />
            <S.ProductDetails>
              <S.ProductName>{params.row.name}</S.ProductName>
              <S.ProductDescription>
                {params.row.description
                  ? params.row.description.substring(0, 60) + "..."
                  : "No description"}
              </S.ProductDescription>
            </S.ProductDetails>
          </S.ProductInfo>
        ),
      },
      {
        field: "restaurant",
        headerName: "Restaurant",
        width: 180,
        renderCell: (params) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px",
            }}
          >
            <Store size={16} color="#667eea" />
            {params.row.restaurant.name}
          </div>
        ),
      },
      {
        field: "category",
        headerName: "Category",
        width: 150,
        renderCell: (params) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px",
            }}
          >
            <Tag size={16} color="#f39c12" />
            {params.row.category.name}
          </div>
        ),
      },
      {
        field: "price",
        headerName: "Price",
        width: 120,
        renderCell: (params) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "16px",
              fontWeight: 700,
              color: "#27ae60",
            }}
          >
            <DollarSign size={16} />
            {params.row.price.toFixed(2)}
          </div>
        ),
      },
      {
        field: "quantity",
        headerName: "Quantity",
        width: 110,
        renderCell: (params) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "14px",
            }}
          >
            <Package size={16} color="#7f8c8d" />
            {params.row.quantity}
          </div>
        ),
      },
      {
        field: "_count",
        headerName: "Favourites",
        width: 120,
        renderCell: (params) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "14px",
              color: "#e74c3c",
            }}
          >
            <Heart size={16} fill="#e74c3c" />
            {params.row._count.productFavourites}
          </div>
        ),
      },
      {
        field: "isAvailable",
        headerName: "Status",
        width: 130,
        renderCell: (params) => (
          <S.Badge $available={params.row.isAvailable}>
            {params.row.isAvailable ? "Available" : "Unavailable"}
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
  const rows = productsData?.data || [];
  const totalRows = productsData?.pagination?.total || 0;

  // Loading state
  if (isLoading && !productsData) {
    return (
      <S.Container>
        <S.StyledPaper>
          <S.LoadingContainer>
            <div>Loading products...</div>
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
              {error?.data?.message || "Failed to load products"}
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
        <S.Title>Products Management</S.Title>
        <S.Subtitle>
          Manage your products, track inventory, and monitor performance
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
              placeholder="Search products by name, description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </S.SearchWrapper>
          <S.AddButton onClick={handleAddNew}>
            <Plus size={20} />
            Add Product
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
      <CreateProduct
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleModalSuccess}
      />

      {/* Update Modal */}
      <UpdateProduct
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onSuccess={handleModalSuccess}
      />
    </S.Container>
  );
}

export default Products;
