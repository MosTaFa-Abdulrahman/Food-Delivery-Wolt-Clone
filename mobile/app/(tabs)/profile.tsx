import { useContext, useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS } from "@/constants/theme";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import upload from "../../uplaod";

// Context && React-Query
import { AuthContext } from "@/context/AuthContext";
import {
  useInfiniteMyFavouriteRestaurants,
  useToggleRestaurantFavourite,
} from "@/store/restaurants/restaurantsSlice";
import {
  useInfiniteMyLikedProducts,
  useToggleProductLike,
} from "@/store/products/productsSlice";
import { useUpdateUser } from "@/store/users/usersSlice";

type FavoriteTab = "restaurants" | "products";

export default function Profile() {
  const { currentUser, logout } = useContext(AuthContext);
  const router = useRouter();

  // States
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<FavoriteTab>("restaurants");
  const [uploadingImage, setUploadingImage] = useState(false);

  // Edit Form State
  const [editForm, setEditForm] = useState({
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    imgUrl: currentUser?.imgUrl || "",
    city: currentUser?.city || "",
    phoneNumber: currentUser?.phoneNumber || "",
  });

  // Fetch Favorites
  const {
    data: restaurantsData,
    fetchNextPage: fetchNextRestaurants,
    hasNextPage: hasMoreRestaurants,
    isFetchingNextPage: loadingMoreRestaurants,
    isLoading: restaurantsLoading,
  } = useInfiniteMyFavouriteRestaurants();

  const {
    data: productsData,
    fetchNextPage: fetchNextProducts,
    hasNextPage: hasMoreProducts,
    isFetchingNextPage: loadingMoreProducts,
    isLoading: productsLoading,
  } = useInfiniteMyLikedProducts();

  // Mutations
  const { mutate: updateUser, isPending: updatingUser } = useUpdateUser();
  const { mutate: toggleRestaurantLike } = useToggleRestaurantFavourite();
  const { mutate: toggleProductLike } = useToggleProductLike();

  // Flatten data - Handle both API structures
  const restaurants =
    restaurantsData?.pages.flatMap((page) => page.content || page.data || []) ||
    [];
  const products = productsData?.pages.flatMap((page) => page.data || []) || [];

  // Initialize optimistic states from fetched data
  const [optimisticRestaurants, setOptimisticRestaurants] = useState<
    Set<string>
  >(new Set());
  const [optimisticProducts, setOptimisticProducts] = useState<Set<string>>(
    new Set()
  );

  // Update optimistic states when data loads
  useEffect(() => {
    if (restaurants.length > 0) {
      setOptimisticRestaurants(
        new Set(restaurants.filter((r) => r.isLiked).map((r) => r.id))
      );
    }
  }, [restaurants.length]);

  useEffect(() => {
    if (products.length > 0) {
      setOptimisticProducts(
        new Set(products.filter((p) => p.isLiked).map((p) => p.id))
      );
    }
  }, [products.length]);

  // Handle Image Upload
  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setUploadingImage(true);
        const file = {
          uri: result.assets[0].uri,
          type: "image/jpeg",
          name: "profile.jpg",
        };

        const uploadedUrl = await upload(file);
        if (uploadedUrl) {
          setEditForm((prev) => ({ ...prev, imgUrl: uploadedUrl }));
        }
        setUploadingImage(false);
      }
    } catch (error) {
      console.error("Image upload error:", error);
      setUploadingImage(false);
      Alert.alert("Error", "Failed to upload image");
    }
  };

  // Handle Update Profile
  const handleUpdateProfile = () => {
    if (!editForm.firstName || !editForm.lastName) {
      Alert.alert("Error", "First name and last name are required");
      return;
    }

    updateUser(
      {
        userId: currentUser?.id!,
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        imgUrl: editForm.imgUrl,
        city: editForm.city,
        phoneNumber: JSON.stringify(editForm.phoneNumber),
      },
      {
        onSuccess: (data) => {
          setEditModalVisible(false);
          Alert.alert("Success", "Profile updated successfully");
        },
        onError: (error) => {
          Alert.alert("Error", "Failed to update profile");
        },
      }
    );
  };

  // Handle Logout
  const handleLogout = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.push("/(auth)/login");
        },
      },
    ]);
  };

  // Toggle Favorites with Optimistic UI
  const handleToggleRestaurant = (restaurantId: string) => {
    setOptimisticRestaurants((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(restaurantId)) {
        newSet.delete(restaurantId);
      } else {
        newSet.add(restaurantId);
      }
      return newSet;
    });

    toggleRestaurantLike(restaurantId, {
      onSuccess: (data) => {
        console.log("✅ Restaurant like toggled:", data);
      },
      onError: () => {
        // Revert on error
        setOptimisticRestaurants((prev) => {
          const newSet = new Set(prev);
          if (newSet.has(restaurantId)) {
            newSet.delete(restaurantId);
          } else {
            newSet.add(restaurantId);
          }
          return newSet;
        });
      },
    });
  };

  const handleToggleProduct = (productId: string) => {
    setOptimisticProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });

    toggleProductLike(
      { productId },
      {
        onSuccess: (data) => {
          console.log("✅ Product like toggled:", data);
        },
        onError: () => {
          // Revert on error
          setOptimisticProducts((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(productId)) {
              newSet.delete(productId);
            } else {
              newSet.add(productId);
            }
            return newSet;
          });
        },
      }
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image
            source={{
              uri:
                currentUser?.imgUrl ||
                "https://via.placeholder.com/100/01BEE5/FFFFFF?text=User",
            }}
            style={styles.profileImage}
            contentFit="cover"
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {currentUser?.firstName} {currentUser?.lastName}
            </Text>
            <Text style={styles.profileEmail}>{currentUser?.email}</Text>
            {currentUser?.city && (
              <Text style={styles.profileCity}>📍 {currentUser.city}</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditModalVisible(true)}
          >
            <Ionicons name="pencil" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="receipt-outline" size={24} color={COLORS.dark} />
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemTitle}>Order history</Text>
                <Text style={styles.menuItemSubtitle}>No orders</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <View style={styles.separator} />
        </View>

        {/* Favorites Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your favorites</Text>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "restaurants" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("restaurants")}
            >
              <Ionicons
                name="restaurant"
                size={20}
                color={
                  activeTab === "restaurants" ? COLORS.primary : COLORS.muted
                }
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === "restaurants" && styles.activeTabText,
                ]}
              >
                Restaurants ({restaurants.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === "products" && styles.activeTab]}
              onPress={() => setActiveTab("products")}
            >
              <Ionicons
                name="fast-food"
                size={20}
                color={activeTab === "products" ? COLORS.primary : COLORS.muted}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === "products" && styles.activeTabText,
                ]}
              >
                Products ({products.length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Restaurants List */}
          {activeTab === "restaurants" && (
            <View style={styles.favoritesList}>
              {restaurantsLoading ? (
                <ActivityIndicator
                  size="large"
                  color={COLORS.primary}
                  style={{ marginVertical: 40 }}
                />
              ) : restaurants.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="heart-outline" size={64} color="#E0E0E0" />
                  <Text style={styles.emptyText}>
                    No favorite restaurants yet
                  </Text>
                  <Text style={styles.emptySubtext}>
                    Tap the heart icon on restaurants to save them here
                  </Text>
                </View>
              ) : (
                <>
                  {restaurants.map((restaurant) => (
                    <View key={restaurant.id} style={styles.favoriteCard}>
                      <Image
                        source={{ uri: restaurant.imgUrl }}
                        style={styles.favoriteImage}
                        contentFit="cover"
                      />
                      <View style={styles.favoriteContent}>
                        <Text style={styles.favoriteName} numberOfLines={1}>
                          {restaurant.name}
                        </Text>
                        <Text style={styles.favoriteDesc} numberOfLines={2}>
                          {restaurant.description}
                        </Text>
                        <View style={styles.favoriteMetaRow}>
                          <Ionicons name="star" size={14} color="#FFD700" />
                          <Text style={styles.favoriteRating}>
                            {restaurant.rating}
                          </Text>
                          <Text style={styles.favoriteDivider}>•</Text>
                          <Text style={styles.favoriteMeta}>
                            {restaurant.deliveryTime}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.favoriteHeart}
                        onPress={() => handleToggleRestaurant(restaurant.id)}
                      >
                        <Ionicons
                          name={
                            optimisticRestaurants.has(restaurant.id)
                              ? "heart"
                              : "heart-outline"
                          }
                          size={24}
                          color={
                            optimisticRestaurants.has(restaurant.id)
                              ? "#FF0000"
                              : COLORS.muted
                          }
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                  {hasMoreRestaurants && (
                    <TouchableOpacity
                      style={styles.loadMoreButton}
                      onPress={() => fetchNextRestaurants()}
                      disabled={loadingMoreRestaurants}
                    >
                      {loadingMoreRestaurants ? (
                        <ActivityIndicator
                          size="small"
                          color={COLORS.primary}
                        />
                      ) : (
                        <Text style={styles.loadMoreText}>Load More</Text>
                      )}
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
          )}

          {/* Products List */}
          {activeTab === "products" && (
            <View style={styles.favoritesList}>
              {productsLoading ? (
                <ActivityIndicator
                  size="large"
                  color={COLORS.primary}
                  style={{ marginVertical: 40 }}
                />
              ) : products.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="heart-outline" size={64} color="#E0E0E0" />
                  <Text style={styles.emptyText}>No favorite products yet</Text>
                  <Text style={styles.emptySubtext}>
                    Tap the heart icon on products to save them here
                  </Text>
                </View>
              ) : (
                <>
                  {products.map((product) => (
                    <View key={product.id} style={styles.favoriteCard}>
                      <Image
                        source={{ uri: product.imgUrl }}
                        style={styles.favoriteImage}
                        contentFit="cover"
                      />
                      <View style={styles.favoriteContent}>
                        <Text style={styles.favoriteName} numberOfLines={1}>
                          {product.name}
                        </Text>
                        <Text style={styles.favoriteDesc} numberOfLines={2}>
                          {product.description}
                        </Text>
                        <Text style={styles.favoritePrice}>
                          {product.price.toFixed(2)} €
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.favoriteHeart}
                        onPress={() => handleToggleProduct(product.id)}
                      >
                        <Ionicons
                          name={
                            optimisticProducts.has(product.id)
                              ? "heart"
                              : "heart-outline"
                          }
                          size={24}
                          color={
                            optimisticProducts.has(product.id)
                              ? "#FF0000"
                              : COLORS.muted
                          }
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                  {hasMoreProducts && (
                    <TouchableOpacity
                      style={styles.loadMoreButton}
                      onPress={() => fetchNextProducts()}
                      disabled={loadingMoreProducts}
                    >
                      {loadingMoreProducts ? (
                        <ActivityIndicator
                          size="small"
                          color={COLORS.primary}
                        />
                      ) : (
                        <Text style={styles.loadMoreText}>Load More</Text>
                      )}
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
          )}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ff4646" />
          <Text style={styles.logoutButtonText}>Sign out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={28} color={COLORS.dark} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Profile Image */}
              <View style={styles.imageUploadContainer}>
                <Image
                  source={{
                    uri:
                      editForm.imgUrl ||
                      "https://via.placeholder.com/100/01BEE5/FFFFFF?text=User",
                  }}
                  style={styles.editProfileImage}
                  contentFit="cover"
                />
                <TouchableOpacity
                  style={styles.changeImageButton}
                  onPress={handleImagePick}
                  disabled={uploadingImage}
                >
                  {uploadingImage ? (
                    <ActivityIndicator size="small" color={COLORS.primary} />
                  ) : (
                    <>
                      <Ionicons
                        name="camera"
                        size={20}
                        color={COLORS.primary}
                      />
                      <Text style={styles.changeImageText}>Change Photo</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {/* Form Fields */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>First Name *</Text>
                <TextInput
                  style={styles.input}
                  value={editForm.firstName}
                  onChangeText={(text) =>
                    setEditForm((prev) => ({ ...prev, firstName: text }))
                  }
                  placeholder="Enter first name"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Last Name *</Text>
                <TextInput
                  style={styles.input}
                  value={editForm.lastName}
                  onChangeText={(text) =>
                    setEditForm((prev) => ({ ...prev, lastName: text }))
                  }
                  placeholder="Enter last name"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>City</Text>
                <TextInput
                  style={styles.input}
                  value={editForm.city}
                  onChangeText={(text) =>
                    setEditForm((prev) => ({ ...prev, city: text }))
                  }
                  placeholder="Enter city"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={editForm.phoneNumber}
                  onChangeText={(text) =>
                    setEditForm((prev) => ({ ...prev, phoneNumber: text }))
                  }
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                />
              </View>

              {/* Save Button */}
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  updatingUser && styles.saveButtonDisabled,
                ]}
                onPress={handleUpdateProfile}
                disabled={updatingUser}
              >
                {updatingUser ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingBottom: 32,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.primaryLight,
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E0E0E0",
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 20,
    fontFamily: FONTS.brandBold,
    color: COLORS.dark,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: FONTS.brand,
    color: COLORS.muted,
    marginBottom: 4,
  },
  profileCity: {
    fontSize: 14,
    fontFamily: FONTS.brand,
    color: COLORS.muted,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: FONTS.brandBold,
    color: COLORS.dark,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuItemText: {
    marginLeft: 12,
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontFamily: FONTS.brandBold,
    color: COLORS.dark,
    marginBottom: 4,
  },
  menuItemSubtitle: {
    fontSize: 14,
    fontFamily: FONTS.brand,
    color: COLORS.muted,
  },
  separator: {
    height: 1,
    backgroundColor: "#F0F0F0",
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  activeTab: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontFamily: FONTS.brand,
    color: COLORS.muted,
  },
  activeTabText: {
    fontFamily: FONTS.brandBold,
    color: COLORS.primary,
  },
  favoritesList: {
    gap: 16,
  },
  favoriteCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    gap: 12,
  },
  favoriteImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#E0E0E0",
  },
  favoriteContent: {
    flex: 1,
    justifyContent: "center",
  },
  favoriteName: {
    fontSize: 16,
    fontFamily: FONTS.brandBold,
    color: COLORS.dark,
    marginBottom: 4,
  },
  favoriteDesc: {
    fontSize: 13,
    fontFamily: FONTS.brand,
    color: COLORS.muted,
    marginBottom: 6,
  },
  favoriteMetaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  favoriteRating: {
    fontSize: 13,
    fontFamily: FONTS.brand,
    color: COLORS.dark,
    marginLeft: 4,
  },
  favoriteDivider: {
    fontSize: 13,
    color: COLORS.muted,
    marginHorizontal: 6,
  },
  favoriteMeta: {
    fontSize: 13,
    fontFamily: FONTS.brand,
    color: COLORS.muted,
  },
  favoritePrice: {
    fontSize: 16,
    fontFamily: FONTS.brandBold,
    color: COLORS.primary,
  },
  favoriteHeart: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: FONTS.brandBold,
    color: COLORS.muted,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: FONTS.brand,
    color: COLORS.muted,
    marginTop: 8,
    textAlign: "center",
  },
  loadMoreButton: {
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: COLORS.primaryLight,
  },
  loadMoreText: {
    fontSize: 14,
    fontFamily: FONTS.brandBold,
    color: COLORS.primary,
  },
  linkItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    gap: 12,
  },
  linkText: {
    flex: 1,
    fontSize: 16,
    fontFamily: FONTS.brandBold,
    color: COLORS.dark,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fbe9e9",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    gap: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontFamily: FONTS.brandBold,
    color: "#ff4646",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: FONTS.brandBold,
    color: COLORS.dark,
  },
  imageUploadContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  editProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E0E0E0",
    borderWidth: 3,
    borderColor: COLORS.primary,
    marginBottom: 12,
  },
  changeImageButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
  },
  changeImageText: {
    fontSize: 14,
    fontFamily: FONTS.brandBold,
    color: COLORS.primary,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: FONTS.brandBold,
    color: COLORS.dark,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: FONTS.brand,
    color: COLORS.dark,
    backgroundColor: "#F9F9F9",
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: FONTS.brandBold,
    color: "#fff",
  },
});
