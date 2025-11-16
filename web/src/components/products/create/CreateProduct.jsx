import * as S from "./createProduct.styles";
import { useState, useEffect } from "react";
import { Upload, Loader2, Search, Plus, X } from "lucide-react";

// Components
import Modal from "../../global/modal/Modal";
import upload from "../../../upload";

// Hook-Form && Zod
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProductSchema } from "../../../validation/product/product.validation";

// RTKQ
import { useGetAllRestaurantsQuery } from "../../../store/restaurants/restaurantsSlice";
import { useGetAllProductCategoriesQuery } from "../../../store/products-category/productsCategoriesSlice";
import { useCreateProductMutation } from "../../../store/products/productsSlice";
import toast from "react-hot-toast";

function CreateProduct({ isOpen, onClose, onSuccess }) {
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

  // Category options: 'existing' or 'new'
  const [categoryOption, setCategoryOption] = useState("existing");
  const [categorySearch, setCategorySearch] = useState("");
  const [debouncedCategorySearch, setDebouncedCategorySearch] = useState("");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // New category state
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState(null);
  const [newCategoryImagePreview, setNewCategoryImagePreview] = useState("");

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      description: "",
      quantity: 0,
      price: 0,
      imgUrl: "",
      isAvailable: true,
      restaurantId: "",
      categoryId: "",
    },
  });

  const watchRestaurantId = watch("restaurantId");

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
          debouncedCategorySearch.length < 2 ||
          categoryOption !== "existing",
      }
    );

  // Create product mutation
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle new category image upload
  const handleCategoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewCategoryImage(file);
      setNewCategoryImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle restaurant selection
  const handleRestaurantSelect = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setRestaurantSearch(""); // Clear search to hide dropdown
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
    setCategorySearch(""); // Clear search to hide dropdown
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

      // Upload product image if exists
      let productImageUrl = data.imgUrl;
      if (imageFile) {
        productImageUrl = await upload(imageFile);
        if (!productImageUrl) {
          toast.error("Failed to upload product image");
          setIsUploading(false);
          return;
        }
      }

      // Prepare product data based on category option
      let productData = {
        ...data,
        imgUrl: productImageUrl,
        quantity: Number(data.quantity),
        price: Number(data.price),
      };

      if (categoryOption === "new") {
        // Upload category image if exists
        let categoryImageUrl = "";
        if (newCategoryImage) {
          categoryImageUrl = await upload(newCategoryImage);
          if (!categoryImageUrl) {
            toast.error("Failed to upload category image");
            setIsUploading(false);
            return;
          }
        }

        // Add category object
        productData.category = {
          name: newCategoryName,
          description: newCategoryDescription,
          imgUrl: categoryImageUrl,
        };
        delete productData.categoryId;
      }

      setIsUploading(false);

      // Create product
      await createProduct(productData).unwrap();

      toast.success("Product created successfully! 🎉");
      handleClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      setIsUploading(false);
      const errorMessage = error?.data?.error || "Failed to create product";
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
    setCategoryOption("existing");
    setNewCategoryName("");
    setNewCategoryDescription("");
    setNewCategoryImage(null);
    setNewCategoryImagePreview("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal title="Create New Product" onClose={handleClose}>
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
          <S.Label>Restaurant *</S.Label>
          <div data-dropdown="restaurant">
            {/* Show selected restaurant badge above input */}
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

        {/* Category Options */}
        <S.FormGroup>
          <S.Label>Category *</S.Label>
          <S.RadioGroup>
            <S.RadioOption>
              <input
                type="radio"
                value="existing"
                checked={categoryOption === "existing"}
                onChange={() => setCategoryOption("existing")}
              />
              <span>Select Existing Category</span>
            </S.RadioOption>
            <S.RadioOption>
              <input
                type="radio"
                value="new"
                checked={categoryOption === "new"}
                onChange={() => setCategoryOption("new")}
              />
              <span>Create New Category</span>
            </S.RadioOption>
          </S.RadioGroup>
        </S.FormGroup>

        {/* Existing Category Search */}
        {categoryOption === "existing" && (
          <S.FormGroup>
            <div data-dropdown="category">
              {/* Show selected category badge above input */}
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

              {isCategoryDropdownOpen &&
                categorySearch &&
                watchRestaurantId && (
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
            {errors.categoryId && (
              <S.Error>{errors.categoryId.message}</S.Error>
            )}
          </S.FormGroup>
        )}

        {/* New Category Form */}
        {categoryOption === "new" && (
          <S.NewCategorySection>
            <S.SectionTitle>
              <Plus size={18} />
              New Category Details
            </S.SectionTitle>

            {/* Category Image */}
            <S.FormGroup>
              <S.Label>Category Image (Optional)</S.Label>
              <S.ImageUploadWrapper $small>
                {newCategoryImagePreview ? (
                  <S.ImagePreview $small>
                    <img src={newCategoryImagePreview} alt="Category Preview" />
                    <S.RemoveImageBtn
                      type="button"
                      onClick={() => {
                        setNewCategoryImage(null);
                        setNewCategoryImagePreview("");
                      }}
                    >
                      <X size={16} />
                    </S.RemoveImageBtn>
                  </S.ImagePreview>
                ) : (
                  <S.UploadBox $small>
                    <Upload size={24} />
                    <span>Category Image</span>
                    <S.FileInput
                      type="file"
                      accept="image/*"
                      onChange={handleCategoryImageChange}
                    />
                  </S.UploadBox>
                )}
              </S.ImageUploadWrapper>
            </S.FormGroup>

            <S.FormGroup>
              <S.Label>Category Name *</S.Label>
              <S.Input
                type="text"
                placeholder="e.g., Pizzas"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </S.FormGroup>

            <S.FormGroup>
              <S.Label>Category Description (Optional)</S.Label>
              <S.TextArea
                placeholder="Category description..."
                rows={2}
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
              />
            </S.FormGroup>
          </S.NewCategorySection>
        )}

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
          <S.SubmitButton type="submit" disabled={isCreating || isUploading}>
            {isCreating || isUploading ? (
              <>
                <Loader2 size={18} className="spin" />
                {isUploading ? "Uploading..." : "Creating..."}
              </>
            ) : (
              "Create Product"
            )}
          </S.SubmitButton>
        </S.Actions>
      </S.Form>
    </Modal>
  );
}

export default CreateProduct;
