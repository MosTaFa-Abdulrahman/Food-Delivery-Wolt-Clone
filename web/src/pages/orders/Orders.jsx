import * as S from "./orders.styles";
import { useState, useMemo, useCallback } from "react";
import {
  Search,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ChefHat,
  AlertCircle,
} from "lucide-react";
import { DataGrid } from "@mui/x-data-grid";
import toast from "react-hot-toast";

// Components
import OrderDetailsModal from "../../components/orders/OrderDetailsModal";

// RTKQ
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../../store/orders/ordersSlice";

// Status configuration
const ORDER_STATUSES = [
  { value: "PENDING", label: "Pending", color: "#f39c12", icon: Clock },
  {
    value: "CONFIRMED",
    label: "Confirmed",
    color: "#3498db",
    icon: CheckCircle,
  },
  { value: "PREPARING", label: "Preparing", color: "#9b59b6", icon: ChefHat },
  { value: "READY", label: "Ready", color: "#1abc9c", icon: Package },
  { value: "DELIVERING", label: "Delivering", color: "#e67e22", icon: Truck },
  {
    value: "DELIVERED",
    label: "Delivered",
    color: "#27ae60",
    icon: CheckCircle,
  },
  { value: "CANCELLED", label: "Cancelled", color: "#e74c3c", icon: XCircle },
];

// Status that can't be updated (terminal states)
const LOCKED_STATUSES = ["DELIVERED", "CANCELLED"];

function Orders() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch orders
  const {
    data: ordersData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllOrdersQuery({
    page,
    limit: pageSize,
    status: selectedStatus === "ALL" ? "" : selectedStatus,
  });

  const [updateOrderStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();

  // Handle order number click
  const handleOrderClick = useCallback((order) => {
    setSelectedOrder(order);
  }, []);

  // Handle close modal
  const handleCloseModal = useCallback(() => {
    setSelectedOrder(null);
  }, []);

  // Handle status update
  const handleStatusUpdate = useCallback(
    async (orderId, currentStatus, newStatus) => {
      // Check if order is in locked state
      if (LOCKED_STATUSES.includes(currentStatus)) {
        toast.error(
          `Cannot update ${currentStatus.toLowerCase()} orders. This order is finalized.`
        );
        return;
      }

      if (
        window.confirm(
          `Are you sure you want to change status to ${newStatus}?`
        )
      ) {
        try {
          await updateOrderStatus({ id: orderId, status: newStatus }).unwrap();
          toast.success(`Order status updated to ${newStatus}!`);
        } catch (err) {
          const errorMessage =
            err?.data?.error || "Failed to update order status";
          toast.error(errorMessage);
        }
      }
    },
    [updateOrderStatus]
  );

  // Get status config
  const getStatusConfig = (status) => {
    return ORDER_STATUSES.find((s) => s.value === status) || ORDER_STATUSES[0];
  };

  // Define columns
  const columns = useMemo(
    () => [
      {
        field: "orderNumber",
        headerName: "Order #",
        width: 180,
        renderCell: (params) => (
          <S.OrderNumber onClick={() => handleOrderClick(params.row)}>
            {params.row.orderNumber}
          </S.OrderNumber>
        ),
      },
      {
        field: "user",
        headerName: "Customer",
        flex: 1,
        minWidth: 200,
        renderCell: (params) => (
          <S.CustomerInfo>
            <S.CustomerName>{params.row.user.username}</S.CustomerName>
            <S.CustomerEmail>{params.row.user.email}</S.CustomerEmail>
          </S.CustomerInfo>
        ),
      },
      {
        field: "restaurant",
        headerName: "Restaurant",
        flex: 1,
        minWidth: 200,
        renderCell: (params) => (
          <S.RestaurantInfo>
            <S.RestaurantImage
              src={params.row.restaurant.imgUrl}
              alt={params.row.restaurant.name}
            />
            <S.RestaurantName>{params.row.restaurant.name}</S.RestaurantName>
          </S.RestaurantInfo>
        ),
      },
      {
        field: "items",
        headerName: "Items",
        width: 100,
        renderCell: (params) => (
          <S.ItemsCount>{params.row.orderItems.length} items</S.ItemsCount>
        ),
      },
      {
        field: "totalAmount",
        headerName: "Total",
        width: 120,
        renderCell: (params) => (
          <S.TotalAmount>${params.row.totalAmount.toFixed(2)}</S.TotalAmount>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        width: 160,
        renderCell: (params) => {
          const statusConfig = getStatusConfig(params.row.status);
          const StatusIcon = statusConfig.icon;
          const isLocked = LOCKED_STATUSES.includes(params.row.status);

          return (
            <S.StatusBadge $color={statusConfig.color} $locked={isLocked}>
              <StatusIcon size={14} />
              {statusConfig.label}
              {isLocked && <S.LockedIcon>🔒</S.LockedIcon>}
            </S.StatusBadge>
          );
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 180,
        sortable: false,
        renderCell: (params) => {
          const isLocked = LOCKED_STATUSES.includes(params.row.status);

          return (
            <S.ActionsCell>
              <S.StatusSelect
                value={params.row.status}
                onChange={(e) =>
                  handleStatusUpdate(
                    params.row.id,
                    params.row.status,
                    e.target.value
                  )
                }
                disabled={isUpdating || isLocked}
                $locked={isLocked}
              >
                {ORDER_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </S.StatusSelect>
            </S.ActionsCell>
          );
        },
      },
      {
        field: "createdDate",
        headerName: "Order Date",
        width: 180,
        renderCell: (params) => (
          <S.DateText>
            {new Date(params.row.createdDate).toLocaleString()}
          </S.DateText>
        ),
      },
    ],
    [isUpdating, handleStatusUpdate, handleOrderClick]
  );

  // Prepare rows
  const rows = ordersData?.data || [];
  const totalRows = ordersData?.pagination?.total || 0;

  // Calculate statistics
  const stats = useMemo(() => {
    const allOrders = rows;
    return {
      total: allOrders.length,
      pending: allOrders.filter((o) => o.status === "PENDING").length,
      confirmed: allOrders.filter((o) => o.status === "CONFIRMED").length,
      preparing: allOrders.filter((o) => o.status === "PREPARING").length,
      delivering: allOrders.filter((o) => o.status === "DELIVERING").length,
      delivered: allOrders.filter((o) => o.status === "DELIVERED").length,
      cancelled: allOrders.filter((o) => o.status === "CANCELLED").length,
    };
  }, [rows]);

  // Loading state
  if (isLoading && !ordersData) {
    return (
      <S.Container>
        <S.StyledPaper>
          <S.LoadingContainer>
            <div>Loading orders...</div>
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
              {error?.data?.message || "Failed to load orders"}
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
        <S.Title>Orders Management</S.Title>
        <S.Subtitle>
          Track and manage all customer orders in real-time
        </S.Subtitle>
      </S.Header>

      {/* Statistics Cards */}
      <S.StatsGrid>
        <S.StatCard>
          <S.StatIcon $color="#3498db">
            <Package size={24} />
          </S.StatIcon>
          <S.StatContent>
            <S.StatLabel>Total Orders</S.StatLabel>
            <S.StatValue>{stats.total}</S.StatValue>
          </S.StatContent>
        </S.StatCard>

        <S.StatCard>
          <S.StatIcon $color="#f39c12">
            <Clock size={24} />
          </S.StatIcon>
          <S.StatContent>
            <S.StatLabel>Pending</S.StatLabel>
            <S.StatValue>{stats.pending}</S.StatValue>
          </S.StatContent>
        </S.StatCard>

        <S.StatCard>
          <S.StatIcon $color="#9b59b6">
            <ChefHat size={24} />
          </S.StatIcon>
          <S.StatContent>
            <S.StatLabel>Preparing</S.StatLabel>
            <S.StatValue>{stats.preparing}</S.StatValue>
          </S.StatContent>
        </S.StatCard>

        <S.StatCard>
          <S.StatIcon $color="#e67e22">
            <Truck size={24} />
          </S.StatIcon>
          <S.StatContent>
            <S.StatLabel>Delivering</S.StatLabel>
            <S.StatValue>{stats.delivering}</S.StatValue>
          </S.StatContent>
        </S.StatCard>

        <S.StatCard>
          <S.StatIcon $color="#27ae60">
            <CheckCircle size={24} />
          </S.StatIcon>
          <S.StatContent>
            <S.StatLabel>Delivered</S.StatLabel>
            <S.StatValue>{stats.delivered}</S.StatValue>
          </S.StatContent>
        </S.StatCard>

        <S.StatCard>
          <S.StatIcon $color="#e74c3c">
            <XCircle size={24} />
          </S.StatIcon>
          <S.StatContent>
            <S.StatLabel>Cancelled</S.StatLabel>
            <S.StatValue>{stats.cancelled}</S.StatValue>
          </S.StatContent>
        </S.StatCard>
      </S.StatsGrid>

      <S.StyledPaper>
        <S.ToolBar>
          <S.FilterWrapper>
            <S.FilterLabel>Filter by Status:</S.FilterLabel>
            <S.FilterSelect
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="ALL">All Orders</option>
              {ORDER_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </S.FilterSelect>
          </S.FilterWrapper>
        </S.ToolBar>

        {/* Warning for locked orders */}
        <S.InfoBanner>
          <AlertCircle size={18} />
          <span>
            Orders marked as <strong>DELIVERED</strong> or{" "}
            <strong>CANCELLED</strong> cannot be modified (indicated by 🔒)
          </span>
        </S.InfoBanner>

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

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal order={selectedOrder} onClose={handleCloseModal} />
      )}
    </S.Container>
  );
}

export default Orders;
