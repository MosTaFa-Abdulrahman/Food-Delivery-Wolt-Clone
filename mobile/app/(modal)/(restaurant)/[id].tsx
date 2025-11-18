import { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

// Components
import SearchBar from "@/components/restaurant/SearchBar";
import CategoryTabs from "@/components/restaurant/CategoryTabs";
import ProductCard from "@/components/restaurant/ProductCard";
import CartButton from "@/components/restaurant/CartButton";

// React-Query
import { useRestaurant } from "@/store/restaurants/restaurantsSlice";
import {
  useInfiniteProductsByRestaurant,
  useToggleProductLike,
} from "@/store/products/productsSlice";

import { COLORS, FONTS } from "@/constants/theme";
import { Loader } from "@/components/global/Loader";

const HEADER_MAX_HEIGHT = 350;
const HEADER_MIN_HEIGHT = 120;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function SingleRestaurant() {
  const { id } = useLocalSearchParams();
  const scrollY = useRef(new Animated.Value(0)).current;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);

  // Fetch restaurant data
  const { data: restaurant, isLoading: restaurantLoading } = useRestaurant(
    id as string
  );

  // Fetch products with filters
  const {
    data: productsData,
    isLoading: productsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteProductsByRestaurant(id as string, {
    search: searchQuery || undefined,
    categoryId: selectedCategory || undefined,
  });

  // Toggle Product Like - FIXED
  const { mutate: toggleLike } = useToggleProductLike();

  // Flatten products from all pages
  const products = productsData?.pages.flatMap((page) => page.data) || [];

  // Get categories from restaurant data
  const categories = [
    { id: null, name: "All" },
    ...(restaurant?.productCategories || [])
      .filter((cat) => cat._count.products > 0)
      .map((cat) => ({
        id: cat.id,
        name: cat.name,
      })),
  ];

  // Header Animations
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });
  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.3, 0],
    extrapolate: "clamp",
  });
  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0, HEADER_SCROLL_DISTANCE],
    outputRange: [1.3, 1, 0.8],
    extrapolate: "clamp",
  });
  const titleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0, 0],
    extrapolate: "clamp",
  });
  const miniTitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE - 50, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, 1],
    extrapolate: "clamp",
  });

  // Toggle like handler - FIXED
  const handleToggleLike = (productId: string) => {
    toggleLike(
      { productId },
      {
        onSuccess: (data) => {
          // console.log("✅ Like toggled successfully:", data);
        },
        onError: (error) => {
          // console.error("❌ Like toggle failed:", error);
        },
      }
    );
  };

  // Handle Cart
  const handleAddToCart = (product: any) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Loading
  if (restaurantLoading) {
    return <Loader text="Loading... " />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Animated Header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.View
          style={[
            styles.headerBackground,
            {
              opacity: imageOpacity,
              transform: [{ scale: imageScale }],
            },
          ]}
        >
          <Image
            source={{ uri: restaurant?.imgUrl || "" }}
            style={styles.headerImage}
            contentFit="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.9)"]}
            style={styles.gradient}
          />
        </Animated.View>

        {/* Top Bar - Back & Search & Menu */}
        <View style={styles.topBar}>
          <Pressable style={styles.iconButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </Pressable>

          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search"
          />
        </View>

        {/* Restaurant Info - Large */}
        <Animated.View
          style={[styles.restaurantInfo, { opacity: titleOpacity }]}
        >
          <Text style={styles.restaurantName}>{restaurant?.name}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.metaText}>{restaurant?.rating || "N/A"}</Text>
            <Text style={styles.metaDivider}>•</Text>
            <Text style={styles.metaText}>
              Min. order {restaurant?.minOrder || 0}.00 €
            </Text>
          </View>
          <Text style={styles.deliveryFee}>
            🚴 {restaurant?.deliveryFee || 0} € •{" "}
          </Text>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Pressable style={styles.deliveryButton}>
              <Ionicons name="bicycle" size={16} color={COLORS.primary} />
              <Text style={styles.deliveryButtonText}>Delivery 25-35 min</Text>
              <Ionicons name="chevron-down" size={16} color={COLORS.primary} />
            </Pressable>

            <Pressable style={styles.actionIconButton}>
              <Ionicons
                name="people-outline"
                size={20}
                color={COLORS.primary}
              />
            </Pressable>

            <Pressable style={styles.actionIconButton}>
              <Ionicons
                name="share-social-outline"
                size={20}
                color={COLORS.primary}
              />
            </Pressable>
          </View>
        </Animated.View>

        {/* Mini Title - Appears on scroll */}
        <Animated.View
          style={[styles.miniTitleContainer, { opacity: miniTitleOpacity }]}
        >
          <Text style={styles.miniTitle} numberOfLines={1}>
            {restaurant?.name}
          </Text>
        </Animated.View>
      </Animated.View>

      {/* Scrollable Content */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => {
          const offsetY = e.nativeEvent.contentOffset.y;
          const contentHeight = e.nativeEvent.contentSize.height;
          const scrollViewHeight = e.nativeEvent.layoutMeasurement.height;

          if (offsetY + scrollViewHeight >= contentHeight - 50) {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }
        }}
      >
        {/* Spacer for header */}
        <View style={{ height: HEADER_MAX_HEIGHT - 60 }} />

        {/* Section Headers */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionSubtitle}>All</Text>
        </View>

        {/* Category Tabs */}
        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Products List */}
        <View style={styles.productsContainer}>
          {productsLoading && products.length === 0 ? (
            <ActivityIndicator
              size="large"
              color={COLORS.primary}
              style={{ marginTop: 40 }}
            />
          ) : products.length === 0 ? (
            <Text style={styles.emptyText}>No products found</Text>
          ) : (
            products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onToggleLike={handleToggleLike}
              />
            ))
          )}

          {isFetchingNextPage && (
            <ActivityIndicator
              size="small"
              color={COLORS.primary}
              style={{ marginVertical: 20 }}
            />
          )}
        </View>

        {/* Bottom Spacer for Cart Button */}
        <View style={{ height: 120 }} />
      </Animated.ScrollView>

      {/* Fixed Cart Button */}
      {totalItems > 0 && (
        <CartButton itemCount={totalItems} totalPrice={totalPrice} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: "hidden",
    backgroundColor: COLORS.background,
  },
  headerBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_MAX_HEIGHT,
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "60%",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    gap: 12,
    zIndex: 20,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  restaurantInfo: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  restaurantLogo: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  restaurantName: {
    fontSize: 24,
    fontFamily: FONTS.brandBold,
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  metaText: {
    fontSize: 13,
    color: "#fff",
    fontFamily: FONTS.brand,
    marginLeft: 4,
  },
  metaDivider: {
    fontSize: 13,
    color: "#fff",
    marginHorizontal: 6,
  },
  deliveryFee: {
    fontSize: 13,
    color: "#fff",
    fontFamily: FONTS.brand,
    marginBottom: 16,
  },
  moreLink: {
    color: COLORS.primary,
    fontFamily: FONTS.brandBold,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  deliveryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  deliveryButtonText: {
    fontSize: 14,
    fontFamily: FONTS.brandBold,
    color: COLORS.primary,
  },
  actionIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  miniTitleContainer: {
    position: "absolute",
    bottom: 30,
    left: 60,
    right: 60,
    alignItems: "center",
  },
  miniTitle: {
    fontSize: 18,
    fontFamily: FONTS.brandBold,
    color: COLORS.dark,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
    backgroundColor: COLORS.background,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: FONTS.brandBold,
    color: COLORS.dark,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: FONTS.brand,
    color: "#999",
  },
  productsContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: COLORS.muted,
    fontFamily: FONTS.brand,
    marginTop: 40,
  },
});
