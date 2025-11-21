import { View, Text, StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS } from "@/constants/theme";

// Zustand Cart Store
import { useCartStore } from "@/store/useCartStore";

interface ProductCardProps {
  product: any;
  onAddToCart: (product: any) => void;
  onToggleLike: (productId: string) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
  onToggleLike,
}: ProductCardProps) {
  const { getItemQuantity } = useCartStore();
  const quantityInCart = getItemQuantity(product.id);

  // Check availability and stock
  const isOutOfStock = product.quantity <= 0;
  const isUnavailable = !product.isAvailable;
  const isDisabled = isOutOfStock || isUnavailable;
  const stockReached = quantityInCart >= product.quantity;

  return (
    <View style={[styles.container, isDisabled && styles.containerDisabled]}>
      <View style={styles.content}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: product.imgUrl || "https://via.placeholder.com/100",
            }}
            style={[styles.image, isDisabled && styles.imageDisabled]}
            contentFit="cover"
          />

          {/* Out of Stock Badge */}
          {isOutOfStock && (
            <View style={styles.stockBadge}>
              <Text style={styles.stockBadgeText}>Out of Stock</Text>
            </View>
          )}

          {/* Unavailable Badge */}
          {!isOutOfStock && isUnavailable && (
            <View style={styles.unavailableBadge}>
              <Text style={styles.unavailableBadgeText}>Unavailable</Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.info}>
          <Text
            style={[styles.name, isDisabled && styles.nameDisabled]}
            numberOfLines={2}
          >
            {product.name}
          </Text>

          {product.description && (
            <Text style={styles.description} numberOfLines={2}>
              {product.description}
            </Text>
          )}

          {/* Stock Info - Show only when available */}
          {!isDisabled && product.quantity <= 10 && (
            <Text style={styles.stockWarning}>
              Only {product.quantity} left in stock!
            </Text>
          )}

          <View style={styles.footer}>
            <View style={styles.priceContainer}>
              <Text style={[styles.price, isDisabled && styles.priceDisabled]}>
                €{product.price.toFixed(2)}
              </Text>
              {quantityInCart > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{quantityInCart}</Text>
                </View>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
              {/* Like Button - Always enabled */}
              <Pressable
                style={styles.likeButton}
                onPress={() => onToggleLike(product.id)}
              >
                <Ionicons
                  name={product.isLiked ? "heart" : "heart-outline"}
                  size={20}
                  color={product.isLiked ? "#FF3B30" : "#999"}
                />
              </Pressable>

              {/* Add to Cart Button - Disabled when out of stock or unavailable or stock reached */}
              {!isDisabled && !stockReached ? (
                <Pressable
                  style={[
                    styles.addButton,
                    quantityInCart > 0 && styles.addButtonActive,
                  ]}
                  onPress={() => onAddToCart(product)}
                >
                  <Ionicons
                    name={quantityInCart > 0 ? "checkmark" : "add"}
                    size={20}
                    color="#fff"
                  />
                </Pressable>
              ) : !isDisabled && stockReached ? (
                // Show "Max" badge when stock limit reached
                <View style={styles.maxBadge}>
                  <Text style={styles.maxBadgeText}>Max</Text>
                </View>
              ) : (
                // Show disabled button for out of stock/unavailable
                <View style={styles.addButtonDisabled}>
                  <Ionicons name="close" size={20} color="#999" />
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  containerDisabled: {
    opacity: 0.6,
  },
  content: {
    flexDirection: "row",
    padding: 12,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
  },
  imageDisabled: {
    opacity: 0.5,
  },
  stockBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    backgroundColor: "#FF3B30",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  stockBadgeText: {
    fontSize: 10,
    fontFamily: FONTS.brandBold,
    color: "#fff",
  },
  unavailableBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    backgroundColor: "#FF9800",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  unavailableBadgeText: {
    fontSize: 10,
    fontFamily: FONTS.brandBold,
    color: "#fff",
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    fontFamily: FONTS.brandBold,
    color: COLORS.dark,
    marginBottom: 4,
  },
  nameDisabled: {
    color: "#999",
  },
  description: {
    fontSize: 13,
    fontFamily: FONTS.brand,
    color: "#999",
    lineHeight: 18,
    marginBottom: 8,
  },
  stockWarning: {
    fontSize: 11,
    fontFamily: FONTS.brand,
    color: "#FF9800",
    marginBottom: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  price: {
    fontSize: 18,
    fontFamily: FONTS.brandBold,
    color: COLORS.primary,
  },
  priceDisabled: {
    color: "#999",
  },
  cartBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: "center",
  },
  cartBadgeText: {
    fontSize: 12,
    fontFamily: FONTS.brandBold,
    color: "#fff",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  likeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonActive: {
    backgroundColor: "#4CAF50",
  },
  addButtonDisabled: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  maxBadge: {
    backgroundColor: "#FF9800",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 18,
    minWidth: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  maxBadgeText: {
    fontSize: 11,
    fontFamily: FONTS.brandBold,
    color: "#fff",
  },
});
