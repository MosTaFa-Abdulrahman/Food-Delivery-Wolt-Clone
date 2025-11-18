import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { COLORS, FONTS } from "@/constants/theme";

// Zustand Cart Store
import { useCartStore } from "@/store/useCartStore";

export default function Cart() {
  const {
    items,
    restaurantName,
    restaurantDeliveryFee,
    incrementQuantity,
    decrementQuantity,
    removeItem,
    clearCart,
    getTotalItems,
    getTotalPrice,
  } = useCartStore();

  const subtotal = getTotalPrice();
  const deliveryFee = restaurantDeliveryFee || 0;
  const serviceFee = 1.5;
  const total = subtotal + deliveryFee + serviceFee;
  const totalItems = getTotalItems();

  // Handle Clear Cart
  const handleClearCart = () => {
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to remove all items from your cart?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            clearCart();
            router.back();
          },
        },
      ]
    );
  };

  // Handle Remove Product
  const handleRemoveItem = (itemId: string, itemName: string) => {
    Alert.alert("Remove Item", `Remove ${itemName} from cart?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => removeItem(itemId),
      },
    ]);
  };

  const handleCreateOrder = () => {
    if (items.length === 0) {
      Alert.alert("Empty Cart", "Your cart is empty. Add some items first!");
      return;
    }

    // Navigate to Order or show success
    Alert.alert(
      "Order Placed! 🎉",
      `Total: €${total.toFixed(
        2
      )}\n\nYour order from ${restaurantName} has been placed successfully!`,
      [
        {
          text: "OK",
          onPress: () => {
            clearCart();
            router.back();
          },
        },
      ]
    );
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.closeButton} onPress={() => router.back()}>
            <Ionicons name="close" size={28} color={COLORS.dark} />
          </Pressable>
          <Text style={styles.headerTitle}>Your Cart</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#CCC" />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Add items from a restaurant to get started
          </Text>
          <Pressable style={styles.browseButton} onPress={() => router.back()}>
            <Text style={styles.browseButtonText}>Browse Menu</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close" size={28} color={COLORS.dark} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Your Order</Text>
          <Text style={styles.headerSubtitle}>{restaurantName}</Text>
        </View>
        <Pressable style={styles.clearButton} onPress={handleClearCart}>
          <Ionicons name="trash-outline" size={22} color="#FF3B30" />
        </Pressable>
      </View>

      {/* Cart Items */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.itemsContainer}>
          {items.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <Image
                source={{
                  uri: item.imgUrl || "https://via.placeholder.com/80",
                }}
                style={styles.itemImage}
                contentFit="cover"
              />

              <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.itemPrice}>€{item.price.toFixed(2)}</Text>
              </View>

              {/* Quantity Controls */}
              <View style={styles.quantityContainer}>
                <Pressable
                  style={styles.quantityButton}
                  onPress={() => decrementQuantity(item.id)}
                >
                  <Ionicons
                    name={item.quantity === 1 ? "trash-outline" : "remove"}
                    size={18}
                    color={item.quantity === 1 ? "#FF3B30" : COLORS.primary}
                  />
                </Pressable>

                <Text style={styles.quantityText}>{item.quantity}</Text>

                <Pressable
                  style={styles.quantityButton}
                  onPress={() => incrementQuantity(item.id)}
                >
                  <Ionicons name="add" size={20} color={COLORS.primary} />
                </Pressable>
              </View>

              {/* Remove Button */}
              <Pressable
                style={styles.removeButton}
                onPress={() => handleRemoveItem(item.id, item.name)}
              >
                <Ionicons name="close-circle" size={24} color="#CCC" />
              </Pressable>
            </View>
          ))}
        </View>

        {/* Order Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Order Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
            </Text>
            <Text style={styles.summaryValue}>€{subtotal.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>€{deliveryFee.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Service Fee</Text>
            <Text style={styles.summaryValue}>€{serviceFee.toFixed(2)}</Text>
          </View>

          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>€{total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Delivery Instructions */}
        <View style={styles.instructionsContainer}>
          <View style={styles.instructionsHeader}>
            <Ionicons
              name="information-circle"
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.instructionsTitle}>Delivery Info</Text>
          </View>
          <Text style={styles.instructionsText}>
            Estimated delivery: 25-35 minutes
          </Text>
          <Text style={styles.instructionsText}>
            🚴 Your order will be delivered by our partner
          </Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Checkout Button */}
      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <Text style={styles.footerLabel}>Total ({totalItems} items)</Text>
          <Text style={styles.footerPrice}>€{total.toFixed(2)}</Text>
        </View>
        <Pressable style={styles.checkoutButton} onPress={handleCreateOrder}>
          <Text style={styles.checkoutButtonText}>Proceed to Create Order</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  clearButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: FONTS.brandBold,
    color: COLORS.dark,
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: FONTS.brand,
    color: "#666",
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  itemsContainer: {
    padding: 16,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  itemName: {
    fontSize: 16,
    fontFamily: FONTS.brandBold,
    color: COLORS.dark,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 15,
    fontFamily: FONTS.brand,
    color: COLORS.primary,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 4,
    marginRight: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 16,
    fontFamily: FONTS.brandBold,
    color: COLORS.dark,
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: "center",
  },
  removeButton: {
    padding: 4,
  },
  summaryContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: FONTS.brandBold,
    color: COLORS.dark,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    fontFamily: FONTS.brand,
    color: "#666",
  },
  summaryValue: {
    fontSize: 15,
    fontFamily: FONTS.brand,
    color: COLORS.dark,
  },
  totalRow: {
    marginTop: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: FONTS.brandBold,
    color: COLORS.dark,
  },
  totalValue: {
    fontSize: 20,
    fontFamily: FONTS.brandBold,
    color: COLORS.primary,
  },
  instructionsContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: "#F0F8FF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D0E8FF",
  },
  instructionsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  instructionsTitle: {
    fontSize: 16,
    fontFamily: FONTS.brandBold,
    color: COLORS.dark,
  },
  instructionsText: {
    fontSize: 14,
    fontFamily: FONTS.brand,
    color: "#666",
    marginTop: 4,
  },
  footer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  footerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  footerLabel: {
    fontSize: 14,
    fontFamily: FONTS.brand,
    color: "#666",
  },
  footerPrice: {
    fontSize: 20,
    fontFamily: FONTS.brandBold,
    color: COLORS.dark,
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  checkoutButtonText: {
    fontSize: 17,
    fontFamily: FONTS.brandBold,
    color: "#fff",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 22,
    fontFamily: FONTS.brandBold,
    color: COLORS.dark,
    marginTop: 24,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    fontFamily: FONTS.brand,
    color: "#999",
    textAlign: "center",
    marginBottom: 32,
  },
  browseButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  browseButtonText: {
    fontSize: 16,
    fontFamily: FONTS.brandBold,
    color: "#fff",
  },
});
