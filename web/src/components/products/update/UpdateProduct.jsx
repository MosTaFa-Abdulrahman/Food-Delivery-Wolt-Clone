import * as S from "./updateProduct.styles";
import { useState, useEffect } from "react";
import { Upload, Loader2, Search, X } from "lucide-react";

// Components
import Modal from "../../global/modal/Modal";
import upload from "../../../upload";

// Hook-Form && Zod
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProductSchema } from "../../../validation/product/product.validation";

// RTKQ
import { useGetAllRestaurantsQuery } from "../../../store/restaurants/restaurantsSlice";
import { useGetAllProductCategoriesQuery } from "../../../store/products-category/productsCategoriesSlice";
import { useUpdateProductMutation } from "../../../store/products/productsSlice";
import toast from "react-hot-toast";

function UpdateProduct({ isOpen, onClose, onSuccess, product }) {
  // Image upload state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Restaurant search
  const [restaurantSearch, setRestaurantSearch] = useState("");
  const [debouncedRestaurantSearch, setDebouncedRestaurantSearch] =
    useState("");
  const [isRestaurantDropdownOpen, setIsRestaurantDropdownOpen] =
    useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  // Category search
  const [categorySearch, setCategorySearch] = useState("");
  const [debouncedCategorySearch, setDebouncedCategorySearch] = useState("");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(updateProductSchema),
  });

  const watchRestaurantId = watch("restaurantId");

  // Initialize form with product data
  useEffect(() => {
    if (product && isOpen) {
      reset({
        name: product.name || "",
        description: product.description || "",
        quantity: product.quantity || 0,
        price: product.price || 0,
        imgUrl: product.imgUrl || "",
        isAvailable:
          product.isAvailable !== undefined ? product.isAvailable : true,
        restaurantId: product.restaurantId || "",
        categoryId: product.categoryId || "",
      });

      // Set image preview
      if (product.imgUrl) {
        setImagePreview(product.imgUrl);
      }

      // Set selected restaurant
      if (product.restaurant) {
        setSelectedRestaurant(product.restaurant);
      }

      // Set selected category
      if (product.category) {
        setSelectedCategory(product.category);
      }
    }
  }, [product, isOpen, reset]);

  // Debounce restaurant search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedRestaurantSearch(restaurantSearch);
    }, 500);
    return () => clearTimeout(timer);
  }, [restaurantSearch]);

  // Debounce category search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCategorySearch(categorySearch);
    }, 500);
    return () => clearTimeout(timer);
  }, [categorySearch]);

  // Fetch restaurants (only when searching)
  const { data: restaurantsData, isLoading: isLoadingRestaurants } =
    useGetAllRestaurantsQuery(
      {
        page: 1,
        limit: 10,
        search: debouncedRestaurantSearch,
      },
      {
        skip:
          !debouncedRestaurantSearch || debouncedRestaurantSearch.length < 2,
      }
    );

  // Fetch categories (only when searching and restaurant is selected)
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useGetAllProductCategoriesQuery(
      {
        page: 1,
        limit: 10,
        search: debouncedCategorySearch,
        restaurantId: watchRestaurantId,
      },
      {
        skip:
          !watchRestaurantId ||
          !debouncedCategorySearch ||
          debouncedCategorySearch.length < 2,
      }
    );

  // Update product mutation
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle restaurant selection
  const handleRestaurantSelect = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setRestaurantSearch("");
    setValue("restaurantId", restaurant.id);
    setIsRestaurantDropdownOpen(false);

    // Reset category when restaurant changes
    setSelectedCategory(null);
    setCategorySearch("");
    setValue("categoryId", "");
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCategorySearch("");
    setValue("categoryId", category.id);
    setIsCategoryDropdownOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest("[data-dropdown='restaurant']")) {
        setIsRestaurantDropdownOpen(false);
      }
      if (!e.target.closest("[data-dropdown='category']")) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle form submit
  const onSubmit = async (data) => {
    try {
      setIsUploading(true);

      // Upload new image if changed
      let productImageUrl = data.imgUrl;
      if (imageFile) {
        productImageUrl = await upload(imageFile);
        if (!productImageUrl) {
          toast.error("Failed to upload product image");
          setIsUploading(false);
          return;
        }
      }

      // Prepare update data (only include changed fields)
      const updateData = {
        id: product.id,
      };

      // Only include fields that have changed
      if (data.name !== product.name) updateData.name = data.name;
      if (data.description !== product.description)
        updateData.description = data.description;
      if (Number(data.quantity) !== product.quantity)
        updateData.quantity = Number(data.quantity);
      if (Number(data.price) !== product.price)
        updateData.price = Number(data.price);
      if (productImageUrl !== product.imgUrl)
        updateData.imgUrl = productImageUrl;
      if (data.isAvailable !== product.isAvailable)
        updateData.isAvailable = data.isAvailable;
      if (data.restaurantId !== product.restaurantId)
        updateData.restaurantId = data.restaurantId;
      if (data.categoryId !== product.categoryId)
        updateData.categoryId = data.categoryId;

      setIsUploading(false);

      // Update product
      await updateProduct(updateData).unwrap();

      toast.success("Product updated successfully! 🎉");
      handleClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      setIsUploading(false);
      const errorMessage = error?.data?.error || "Failed to update product";
      toast.error(errorMessage);
    }
  };

  // Handle close
  const handleClose = () => {
    reset();
    setImageFile(null);
    setImagePreview("");
    setRestaurantSearch("");
    setSelectedRestaurant(null);
    setCategorySearch("");
    setSelectedCategory(null);
    onClose();
  };

  if (!isOpen || !product) return null;

  return (
    <Modal title="Update Product" onClose={handleClose}>
      <S.Form onSubmit={handleSubmit(onSubmit)}>
        {/* Product Image */}
        <S.FormGroup>
          <S.Label>Product Image</S.Label>
          <S.ImageUploadWrapper>
            {imagePreview ? (
              <S.ImagePreview>
                <img src={imagePreview} alt="Preview" />
                <S.RemoveImageBtn
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview("");
                    setValue("imgUrl", "");
                  }}
                >
                  <X size={16} />
                </S.RemoveImageBtn>
              </S.ImagePreview>
            ) : (
              <S.UploadBox>
                <Upload size={32} />
                <span>Upload Product Image</span>
                <S.FileInput
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </S.UploadBox>
            )}
          </S.ImageUploadWrapper>
          {errors.imgUrl && <S.Error>{errors.imgUrl.message}</S.Error>}
        </S.FormGroup>

        {/* Product Name */}
        <S.FormGroup>
          <S.Label>Product Name *</S.Label>
          <S.Input {...register("name")} placeholder="e.g., Margherita Pizza" />
          {errors.name && <S.Error>{errors.name.message}</S.Error>}
        </S.FormGroup>

        {/* Description */}
        <S.FormGroup>
          <S.Label>Description</S.Label>
          <S.TextArea
            {...register("description")}
            placeholder="Product description..."
            rows={3}
          />
          {errors.description && (
            <S.Error>{errors.description.message}</S.Error>
          )}
        </S.FormGroup>

        {/* Quantity & Price */}
        <S.Row>
          <S.FormGroup>
            <S.Label>Quantity *</S.Label>
            <S.Input
              type="number"
              step="0.01"
              {...register("quantity", { valueAsNumber: true })}
              placeholder="e.g., 1"
            />
            {errors.quantity && <S.Error>{errors.quantity.message}</S.Error>}
          </S.FormGroup>

          <S.FormGroup>
            <S.Label>Price *</S.Label>
            <S.Input
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
              placeholder="e.g., 12.99"
            />
            {errors.price && <S.Error>{errors.price.message}</S.Error>}
          </S.FormGroup>
        </S.Row>

        {/* Restaurant Search */}
        <S.FormGroup>
          <S.Label>Restaurant</S.Label>
          <div data-dropdown="restaurant">
            {selectedRestaurant && (
              <S.SelectedBadgeTop>
                <span>{selectedRestaurant.name}</span>
                <X
                  size={14}
                  onClick={() => {
                    setSelectedRestaurant(null);
                    setRestaurantSearch("");
                    setValue("restaurantId", "");
                  }}
                />
              </S.SelectedBadgeTop>
            )}

            <S.SearchWrapper>
              <S.SearchIcon>
                <Search size={18} />
              </S.SearchIcon>
              <S.SearchInput
                type="text"
                placeholder={
                  selectedRestaurant
                    ? "Search to change restaurant..."
                    : "Search restaurants..."
                }
                value={restaurantSearch}
                onChange={(e) => setRestaurantSearch(e.target.value)}
                onFocus={() => setIsRestaurantDropdownOpen(true)}
              />
            </S.SearchWrapper>

            {isRestaurantDropdownOpen && restaurantSearch && (
              <S.Dropdown>
                {isLoadingRestaurants ? (
                  <S.DropdownItem>
                    <Loader2 size={16} className="spin" />
                    Searching...
                  </S.DropdownItem>
                ) : restaurantsData?.data?.length > 0 ? (
                  restaurantsData.data.map((restaurant) => (
                    <S.DropdownItem
                      key={restaurant.id}
                      onClick={() => handleRestaurantSelect(restaurant)}
                    >
                      <img src={restaurant.imgUrl} alt={restaurant.name} />
                      <div>
                        <div>{restaurant.name}</div>
                        <small>{restaurant.city}</small>
                      </div>
                    </S.DropdownItem>
                  ))
                ) : (
                  <S.DropdownItem>No restaurants found</S.DropdownItem>
                )}
              </S.Dropdown>
            )}
          </div>
          {errors.restaurantId && (
            <S.Error>{errors.restaurantId.message}</S.Error>
          )}
        </S.FormGroup>

        {/* Category Search */}
        <S.FormGroup>
          <S.Label>Category</S.Label>
          <div data-dropdown="category">
            {selectedCategory && (
              <S.SelectedBadgeTop>
                <span>{selectedCategory.name}</span>
                <X
                  size={14}
                  onClick={() => {
                    setSelectedCategory(null);
                    setCategorySearch("");
                    setValue("categoryId", "");
                  }}
                />
              </S.SelectedBadgeTop>
            )}

            <S.SearchWrapper>
              <S.SearchIcon>
                <Search size={18} />
              </S.SearchIcon>
              <S.SearchInput
                type="text"
                placeholder={
                  selectedCategory
                    ? "Search to change category..."
                    : "Search categories..."
                }
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                onFocus={() => setIsCategoryDropdownOpen(true)}
                disabled={!watchRestaurantId}
              />
            </S.SearchWrapper>

            {isCategoryDropdownOpen && categorySearch && watchRestaurantId && (
              <S.Dropdown>
                {isLoadingCategories ? (
                  <S.DropdownItem>
                    <Loader2 size={16} className="spin" />
                    Searching...
                  </S.DropdownItem>
                ) : categoriesData?.data?.length > 0 ? (
                  categoriesData.data.map((category) => (
                    <S.DropdownItem
                      key={category.id}
                      onClick={() => handleCategorySelect(category)}
                    >
                      {category.imgUrl && (
                        <img src={category.imgUrl} alt={category.name} />
                      )}
                      <div>
                        <div>{category.name}</div>
                        {category.description && (
                          <small>{category.description}</small>
                        )}
                      </div>
                    </S.DropdownItem>
                  ))
                ) : (
                  <S.DropdownItem>No categories found</S.DropdownItem>
                )}
              </S.Dropdown>
            )}
          </div>
          {!watchRestaurantId && (
            <S.Info>Please select a restaurant first</S.Info>
          )}
          {errors.categoryId && <S.Error>{errors.categoryId.message}</S.Error>}
        </S.FormGroup>

        {/* Availability */}
        <S.FormGroup>
          <S.CheckboxWrapper>
            <input type="checkbox" {...register("isAvailable")} />
            <S.Label>Product is available</S.Label>
          </S.CheckboxWrapper>
        </S.FormGroup>

        {/* Actions */}
        <S.Actions>
          <S.CancelButton type="button" onClick={handleClose}>
            Cancel
          </S.CancelButton>
          <S.SubmitButton type="submit" disabled={isUpdating || isUploading}>
            {isUpdating || isUploading ? (
              <>
                <Loader2 size={18} className="spin" />
                {isUploading ? "Uploading..." : "Updating..."}
              </>
            ) : (
              "Update Product"
            )}
          </S.SubmitButton>
        </S.Actions>
      </S.Form>
    </Modal>
  );
}

export default UpdateProduct;
