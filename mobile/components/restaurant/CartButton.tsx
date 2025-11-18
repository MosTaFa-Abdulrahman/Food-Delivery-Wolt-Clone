import { Pressable, Text, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { COLORS, FONTS } from "@/constants/theme";

interface CartButtonProps {
  itemCount: number;
  totalPrice: number;
  onPress?: () => void; // Made optional since we'll handle navigation internally
}

export default function CartButton({
  itemCount,
  totalPrice,
  onPress,
}: CartButtonProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Navigate to cart modal
      router.push("/(modal)/cart");
    }
  };

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      {/* Badge */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{itemCount}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.text}>View Order</Text>
      </View>

      {/* Price */}
      <Text style={styles.price}>€{totalPrice.toFixed(2)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  badge: {
    position: "absolute",
    top: -10,
    left: 16,
    backgroundColor: "#fff",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  badgeText: {
    fontSize: 14,
    fontFamily: FONTS.brandBold,
    color: COLORS.primary,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  text: {
    fontSize: 17,
    fontFamily: FONTS.brandBold,
    color: "#fff",
  },
  price: {
    fontSize: 17,
    fontFamily: FONTS.brandBold,
    color: "#fff",
  },
});
