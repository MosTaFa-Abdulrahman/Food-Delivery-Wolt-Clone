import { View, Text, StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS } from "@/constants/theme";
import { Product } from "@/types/products.types";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleLike: (productId: string) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
  onToggleLike,
}: ProductCardProps) {
  // Optimistic UI state for like
  const [isLikedOptimistic, setIsLikedOptimistic] = useState(product.isLiked);

  const handleToggleLike = () => {
    // Optimistic update
    setIsLikedOptimistic(!isLikedOptimistic);
    // Call the actual mutation
    onToggleLike(product.id);
  };

  return (
    <View style={styles.card}>
      <View style={styles.contentRow}>
        {/* Left Side - Text Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={styles.description} numberOfLines={3}>
            {product.description}
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{product.price.toFixed(2)} €</Text>
          </View>
        </View>

        {/* Right Side - Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.imgUrl }}
            style={styles.image}
            contentFit="cover"
          />

          {/* Heart Button - Top right of image */}
          <Pressable style={styles.heartButton} onPress={handleToggleLike}>
            <Ionicons
              name={isLikedOptimistic ? "heart" : "heart-outline"}
              size={20}
              color={isLikedOptimistic ? "#FF0000" : "#fff"}
            />
          </Pressable>

          {/* Add Button - Bottom right of image - More Visible */}
          {product.isAvailable && (
            <Pressable
              style={styles.addButton}
              onPress={() => onAddToCart(product)}
            >
              <Ionicons name="add" size={24} color="#fff" />
            </Pressable>
          )}
        </View>
      </View>

      {!product.isAvailable && (
        <View style={styles.unavailableBadge}>
          <Text style={styles.unavailableText}>Unavailable</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background,
    marginBottom: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  contentRow: {
    flexDirection: "row",
    gap: 16,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  name: {
    fontSize: 17,
    fontFamily: FONTS.brandBold,
    color: COLORS.dark,
    marginBottom: 6,
    lineHeight: 22,
  },
  description: {
    fontSize: 14,
    fontFamily: FONTS.brand,
    color: "#999",
    marginBottom: 12,
    lineHeight: 20,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  price: {
    fontSize: 16,
    fontFamily: FONTS.brandBold,
    color: COLORS.dark,
  },
  imageContainer: {
    position: "relative",
    width: 100,
    height: 100,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
  },
  heartButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  addButton: {
    position: "absolute",
    bottom: -8,
    right: -8,
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  unavailableBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#E0E0E0",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 12,
  },
  unavailableText: {
    fontSize: 12,
    fontFamily: FONTS.brand,
    color: "#666",
  },
});
