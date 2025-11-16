import * as S from "./createRestaurant.styles";
import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";

// Components
import Modal from "../../../components/global/modal/Modal";
import upload from "../../../upload";

// Hook-Form && Zod
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRestaurantSchema } from "../../../validation/restaurant/restaurant.validation";

// RTKQ
import { useCreateRestaurantMutation } from "../../../store/restaurants/restaurantsSlice";
import toast from "react-hot-toast";

function CreateRestaurant({ isOpen, onClose, onSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [createRestaurant, { isLoading }] = useCreateRestaurantMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(createRestaurantSchema),
    defaultValues: {
      name: "",
      description: "",
      imgUrl: "",
      address: "",
      city: "",
      phoneNumber: "",
      rating: 0,
      deliveryTime: "20-30 min",
      deliveryFee: 0,
      minOrder: 0,
      isActive: true,
    },
  });

  const imgUrl = watch("imgUrl");

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    try {
      setUploading(true);
      const url = await upload(file);
      if (url) {
        setValue("imgUrl", url);
        setImagePreview(url);
        toast.success("Image uploaded successfully!");
      }
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      await createRestaurant(data).unwrap();
      toast.success("Restaurant created successfully!");
      reset();
      setImagePreview(null);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      const errorMessage = error?.data?.error || "Failed to create restaurant";
      toast.error(errorMessage);
      console.error("Create restaurant error:", error);
    }
  };

  // Handle modal close
  const handleClose = () => {
    reset();
    setImagePreview(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal title="Create New Restaurant" onClose={handleClose}>
      <S.Form onSubmit={handleSubmit(onSubmit)}>
        {/* Image Upload Section */}
        <S.ImageUploadSection>
          <S.Label>Restaurant Image</S.Label>
          <S.ImageUploadWrapper>
            {imagePreview || imgUrl ? (
              <S.ImagePreview>
                <S.PreviewImage src={imagePreview || imgUrl} alt="Preview" />
                <S.ChangeImageButton
                  type="button"
                  onClick={() =>
                    document.getElementById("image-upload").click()
                  }
                  disabled={uploading}
                >
                  Change Image
                </S.ChangeImageButton>
              </S.ImagePreview>
            ) : (
              <S.UploadPlaceholder
                onClick={() => document.getElementById("image-upload").click()}
              >
                {uploading ? (
                  <>
                    <Loader2 size={40} className="animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload size={40} />
                    <span>Click to upload image</span>
                    <S.UploadHint>PNG, JPG up to 5MB</S.UploadHint>
                  </>
                )}
              </S.UploadPlaceholder>
            )}
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
          </S.ImageUploadWrapper>
          {errors.imgUrl && <S.ErrorText>{errors.imgUrl.message}</S.ErrorText>}
        </S.ImageUploadSection>

        <S.FormGrid>
          {/* Name */}
          <S.FormGroup>
            <S.Label>
              Restaurant Name <S.Required>*</S.Required>
            </S.Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <S.Input
                  {...field}
                  placeholder="Enter restaurant name"
                  $hasError={!!errors.name}
                />
              )}
            />
            {errors.name && <S.ErrorText>{errors.name.message}</S.ErrorText>}
          </S.FormGroup>

          {/* City */}
          <S.FormGroup>
            <S.Label>
              City <S.Required>*</S.Required>
            </S.Label>
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <S.Input
                  {...field}
                  placeholder="Enter city"
                  $hasError={!!errors.city}
                />
              )}
            />
            {errors.city && <S.ErrorText>{errors.city.message}</S.ErrorText>}
          </S.FormGroup>

          {/* Address */}
          <S.FormGroup $fullWidth>
            <S.Label>
              Address <S.Required>*</S.Required>
            </S.Label>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <S.Input
                  {...field}
                  placeholder="Enter full address"
                  $hasError={!!errors.address}
                />
              )}
            />
            {errors.address && (
              <S.ErrorText>{errors.address.message}</S.ErrorText>
            )}
          </S.FormGroup>

          {/* Phone Number */}
          <S.FormGroup>
            <S.Label>Phone Number</S.Label>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <S.Input {...field} placeholder="+1-555-0100" />
              )}
            />
          </S.FormGroup>

          {/* Rating */}
          <S.FormGroup>
            <S.Label>Rating (0-5)</S.Label>
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <S.Input
                  {...field}
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                  $hasError={!!errors.rating}
                />
              )}
            />
            {errors.rating && (
              <S.ErrorText>{errors.rating.message}</S.ErrorText>
            )}
          </S.FormGroup>

          {/* Delivery Time - Changed to string */}
          <S.FormGroup>
            <S.Label>
              Delivery Time <S.Required>*</S.Required>
            </S.Label>
            <Controller
              name="deliveryTime"
              control={control}
              render={({ field }) => (
                <S.Input
                  {...field}
                  type="text"
                  placeholder="15-25 min"
                  $hasError={!!errors.deliveryTime}
                />
              )}
            />
            {errors.deliveryTime && (
              <S.ErrorText>{errors.deliveryTime.message}</S.ErrorText>
            )}
            <S.HintText>Format: "15-25 min"</S.HintText>
          </S.FormGroup>

          {/* Delivery Fee */}
          <S.FormGroup>
            <S.Label>Delivery Fee ($)</S.Label>
            <Controller
              name="deliveryFee"
              control={control}
              render={({ field }) => (
                <S.Input
                  {...field}
                  type="number"
                  step="0.01"
                  placeholder="2.49"
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                  $hasError={!!errors.deliveryFee}
                />
              )}
            />
            {errors.deliveryFee && (
              <S.ErrorText>{errors.deliveryFee.message}</S.ErrorText>
            )}
          </S.FormGroup>

          {/* Min Order */}
          <S.FormGroup>
            <S.Label>Minimum Order ($)</S.Label>
            <Controller
              name="minOrder"
              control={control}
              render={({ field }) => (
                <S.Input
                  {...field}
                  type="number"
                  step="0.01"
                  placeholder="10.00"
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                  $hasError={!!errors.minOrder}
                />
              )}
            />
            {errors.minOrder && (
              <S.ErrorText>{errors.minOrder.message}</S.ErrorText>
            )}
          </S.FormGroup>

          {/* Description */}
          <S.FormGroup $fullWidth>
            <S.Label>Description</S.Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <S.TextArea
                  {...field}
                  placeholder="Enter restaurant description"
                  rows={3}
                />
              )}
            />
          </S.FormGroup>

          {/* Is Active */}
          <S.FormGroup $fullWidth>
            <S.CheckboxWrapper>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <S.Checkbox
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <S.CheckboxLabel>Set restaurant as active</S.CheckboxLabel>
            </S.CheckboxWrapper>
          </S.FormGroup>
        </S.FormGrid>

        {/* Action Buttons */}
        <S.ButtonGroup>
          <S.CancelButton type="button" onClick={handleClose}>
            Cancel
          </S.CancelButton>
          <S.SubmitButton type="submit" disabled={isLoading || uploading}>
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating...
              </>
            ) : (
              "Create Restaurant"
            )}
          </S.SubmitButton>
        </S.ButtonGroup>
      </S.Form>
    </Modal>
  );
}
export default CreateRestaurant;
