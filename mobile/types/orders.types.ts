// =============================
// Order Status
// =============================
export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PREPARING = "PREPARING",
  READY = "READY",
  DELIVERING = "DELIVERING",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

// =============================
// OrderItem
// =============================
export interface OrderItem {
  id: string;
  productId: string | null;
  productName: string;
  productPrice: number;
  productQyantity: number;
  productImgUrl: string | null;
  quantity: number;
  createdDate: string;
  lastModifiedDate: string | null;
  orderId: string;
}

// =============================
// Order (Matching Post format)
// =============================
export interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  deliveryFee: number;
  status: OrderStatus;
  deliveryAddress: string;
  phoneNumber: string;
  notes: string | null;
  createdDate: string;
  lastModifiedDate: string | null;

  userId: string;
  restaurantId: string;

  orderItems?: OrderItem[];

  user?: {
    id: string;
    username: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    imgUrl?: string | null;
  };

  restaurant?: {
    id: string;
    name: string;
    imgUrl: string | null;
  };

  _count?: {
    orderItems: number;
  };
}

// =============================
// Paginated Response (generic)
// =============================
export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// =============================
// API Response Types
// =============================
export interface CreateOrderResponse {
  message: string;
  order: Order;
}

export interface GetOrderResponse {
  order: Order;
}

export interface GetMyOrdersResponse extends PaginatedResponse<Order> {}

export interface GetAllOrdersResponse extends PaginatedResponse<Order> {}

export interface UpdateOrderStatusResponse {
  message: string;
  order: Order;
}

// =============================
// Request Types
// =============================
export interface CreateOrderRequest {
  restaurantId: string;
  deliveryAddress: string;
  phoneNumber: string;
  notes?: string;
  orderItems: Array<{
    productId: string;
    quantity: number;
  }>;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export interface GetMyOrdersParams {
  page?: number;
  size?: number;
  status?: OrderStatus;
}

export interface GetAllOrdersParams {
  page?: number;
  size?: number;
  status?: OrderStatus;
  userId?: string;
  restaurantId?: string;
}

// =============================
// Query Key Types (like posts)
// =============================
export type OrderQueryKey = ["order", string];
export type MyOrdersQueryKey = ["orders", "my", GetMyOrdersParams?];
export type AllOrdersQueryKey = ["orders", GetAllOrdersParams?];
