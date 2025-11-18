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

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Product Image */}
        <Image
          source={{ uri: product.imgUrl || "https://via.placeholder.com/100" }}
          style={styles.image}
          contentFit="cover"
        />

        {/* Product Info */}
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>

          {product.description && (
            <Text style={styles.description} numberOfLines={2}>
              {product.description}
            </Text>
          )}

          <View style={styles.footer}>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>€{product.price.toFixed(2)}</Text>
              {quantityInCart > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{quantityInCart}</Text>
                </View>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
              {/* Like Button */}
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

              {/* Add to Cart Button */}
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
  content: {
    flexDirection: "row",
    padding: 12,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
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
  description: {
    fontSize: 13,
    fontFamily: FONTS.brand,
    color: "#999",
    lineHeight: 18,
    marginBottom: 8,
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
});
