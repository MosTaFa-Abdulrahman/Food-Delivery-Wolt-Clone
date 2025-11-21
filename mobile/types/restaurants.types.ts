export interface RestaurantMap {
  id: string;
  name: string;
  description: string | null;
  imgUrl: string | null;
  address: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  phoneNumber: string | null;
  rating: number;
  deliveryTime: string | null;
  deliveryFee: number | null;
  minOrder: number | null;
  isActive: boolean;
  createdDate: string;
  lastModifiedDate: string | null;
}
export interface GetAllForMapResponse {
  success: boolean;
  data: Restaurant[];
}

export interface Restaurant {
  id: string;
  name: string;
  description: string | null;
  imgUrl: string | null;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  phoneNumber: string | null;
  rating: number | null;
  deliveryTime: string | null;
  deliveryFee: number | null;
  minOrder: number | null;
  isActive: boolean;
  createdDate: string;
  lastModifiedDate: string | null;

  productCategories?: Array<{
    id: string;
    name: string;
    imgUrl: string | null;

    _count: {
      products: number;
    };
  }>;

  _count?: {
    products: number;
    orders: number;
    restaurantFavourites: number;
  };

  isLiked?: boolean;
}

export interface RestaurantFavourite {
  id: string;
  userId: string;
  restaurantId: string;
  createdDate: string;
  lastModifiedDate: string | null;
  restaurant?: Restaurant;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface CreateRestaurantResponse {
  message: string;
  restaurant: Restaurant;
}

export interface GetRestaurantResponse {
  restaurant: Restaurant;
}

export interface GetAllRestaurantsResponse
  extends PaginatedResponse<Restaurant> {}

export interface GetMyFavouriteRestaurantsResponse
  extends PaginatedResponse<Restaurant> {}

export interface UpdateRestaurantResponse {
  message: string;
  restaurant: Restaurant;
}

export interface DeleteRestaurantResponse {
  message: string;
}

export interface ToggleRestaurantFavouriteResponse {
  message: string;
  isLiked: boolean;
}

export interface CreateRestaurantRequest {
  name: string;
  description?: string;
  imgUrl?: string;
  address: string;
  city: string;
  phoneNumber?: string;
  rating?: number;
  deliveryTime?: string;
  deliveryFee?: number;
  minOrder?: number;
  isActive?: boolean;
}

export interface UpdateRestaurantRequest {
  name?: string;
  description?: string;
  imgUrl?: string;
  address?: string;
  city?: string;
  phoneNumber?: string;
  rating?: number;
  deliveryTime?: string;
  deliveryFee?: number;
  minOrder?: number;
  isActive?: boolean;
}

export interface GetAllRestaurantsParams {
  page?: number;
  size?: number;
  search?: string;
  city?: string;
  isActive?: boolean;
}

export interface GetMyFavouriteRestaurantsParams {
  page?: number;
  size?: number;
}

export interface ToggleRestaurantFavouriteRequest {
  restaurantId: string;
}

export type RestaurantQueryKey = ["restaurant", string];
export type AllRestaurantsQueryKey = ["restaurants", GetAllRestaurantsParams?];
export type FavouriteRestaurantsQueryKey = ["restaurants", "favourites"];
