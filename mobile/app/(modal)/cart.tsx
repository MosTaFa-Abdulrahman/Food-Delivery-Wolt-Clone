import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { COLORS, FONTS } from "@/constants/theme";
import { useState, useRef } from "react";
import ConfettiCannon from "react-native-confetti-cannon";

// React Query && Zustand Cart Store
import { useCartStore } from "@/store/useCartStore";
import { useCreateOrder } from "@/store/orders/ordersSlice";

export default function Cart() {
  const {
    items,
    restaurantId,
    restaurantName,
    restaurantDeliveryTime,
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

  // Modal States
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Form States
  const [notes, setNotes] = useState("");
  const [locationLabel, setLocationLabel] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Confetti Ref
  const confettiRef = useRef<any>(null);

  // React Query Mutation
  const { mutate: createOrder, isPending } = useCreateOrder();

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

  // Open Order Modal
  const handleOpenOrderModal = () => {
    if (items.length === 0) {
      Alert.alert("Empty Cart", "Your cart is empty. Add some items first!");
      return;
    }
    setShowOrderModal(true);
  };

  // Submit Order
  const handleSubmitOrder = () => {
    // Validation
    if (!locationLabel.trim()) {
      Alert.alert("Error", "Please enter location label (Home, Work, etc.)");
      return;
    }
    if (!address.trim()) {
      Alert.alert("Error", "Please enter delivery address");
      return;
    }
    if (!city.trim()) {
      Alert.alert("Error", "Please enter city");
      return;
    }
    if (!phoneNumber.trim()) {
      Alert.alert("Error", "Please enter phone number");
      return;
    }

    // Prepare order data
    const orderData = {
      restaurantId: restaurantId,
      notes: notes.trim() || undefined,
      items: items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      location: {
        label: locationLabel.trim(),
        address: address.trim(),
        city: city.trim(),
        phoneNumber: JSON.stringify(phoneNumber.trim()),
      },
    };

    // Call API
    createOrder(orderData, {
      onSuccess: (response) => {
        // Close modal
        setShowOrderModal(false);

        // Reset form
        setNotes("");
        setLocationLabel("");
        setAddress("");
        setCity("");
        setPhoneNumber("");

        // Show success modal with confetti
        setShowSuccessModal(true);
        confettiRef.current?.start();

        // Clear cart after 3 seconds
        setTimeout(() => {
          clearCart();
          setShowSuccessModal(false);
          router.back();
        }, 3000);
      },
      onError: (error: any) => {
        Alert.alert(
          "Order Failed",
          error?.response?.data?.error ||
            error?.message ||
            "Something went wrong. Please try again."
        );
      },
    });
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
                  style={[
                    styles.quantityButton,
                    item.quantity >= item.stock &&
                      styles.quantityButtonDisabled,
                  ]}
                  onPress={() => incrementQuantity(item.id)}
                  disabled={item.quantity >= item.stock}
                >
                  <Ionicons
                    name="add"
                    size={20}
                    color={
                      item.quantity >= item.stock ? "#CCC" : COLORS.primary
                    }
                  />
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
            Estimated delivery: {restaurantDeliveryTime}
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
        <Pressable style={styles.checkoutButton} onPress={handleOpenOrderModal}>
          <Text style={styles.checkoutButtonText}>Proceed to Create Order</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </Pressable>
      </View>

      {/* Order Details Modal */}
      <Modal
        visible={showOrderModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => !isPending && setShowOrderModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Order Details</Text>
              <Pressable
                onPress={() => setShowOrderModal(false)}
                disabled={isPending}
              >
                <Ionicons name="close" size={28} color={COLORS.dark} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Notes */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  Notes <Text style={styles.optional}>(Optional)</Text>
                </Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Add delivery instructions..."
                  placeholderTextColor="#999"
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={3}
                  editable={!isPending}
                />
              </View>

              {/* Location Label */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Location Label *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Home, Work, Other"
                  placeholderTextColor="#999"
                  value={locationLabel}
                  onChangeText={setLocationLabel}
                  editable={!isPending}
                />
              </View>

              {/* Address */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Delivery Address *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Street address, building, apartment..."
                  placeholderTextColor="#999"
                  value={address}
                  onChangeText={setAddress}
                  multiline
                  numberOfLines={2}
                  editable={!isPending}
                />
              </View>

              {/* City */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>City *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your city"
                  placeholderTextColor="#999"
                  value={city}
                  onChangeText={setCity}
                  editable={!isPending}
                />
              </View>

              {/* Phone Number */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+20 123 456 7890"
                  placeholderTextColor="#999"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  editable={!isPending}
                />
              </View>

              {/* Submit Button */}
              <Pressable
                style={[
                  styles.submitButton,
                  isPending && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmitOrder}
                disabled={isPending}
              >
                {isPending ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Text style={styles.submitButtonText}>Create Order</Text>
                    <Text style={styles.submitButtonPrice}>
                      €{total.toFixed(2)}
                    </Text>
                  </>
                )}
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Success Modal with Confetti */}
      <Modal visible={showSuccessModal} animationType="fade" transparent={true}>
        <View style={styles.successOverlay}>
          <ConfettiCannon
            count={200}
            origin={{ x: -10, y: 0 }}
            autoStart={false}
            ref={confettiRef}
            fadeOut={true}
          />
          <View style={styles.successContent}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
            </View>
            <Text style={styles.successTitle}>Order Placed! 🎉</Text>
            <Text style={styles.successMessage}>
              Your order from {restaurantName} has been placed successfully!
            </Text>
            <Text style={styles.successTotal}>Total: €{total.toFixed(2)}</Text>
            <Text style={styles.successSubtext}>
              Estimated delivery: {restaurantDeliveryTime}
            </Text>
          </View>
        </View>
      </Modal>
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
  quantityButtonDisabled: {
    opacity: 0.5,
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: FONTS.brandBold,
    color: COLORS.dark,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: FONTS.brandBold,
    color: COLORS.dark,
    marginBottom: 8,
  },
  optional: {
    fontSize: 12,
    fontFamily: FONTS.brand,
    color: "#999",
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: FONTS.brand,
    color: COLORS.dark,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  submitButtonDisabled: {
    backgroundColor: "#CCC",
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 18,
    fontFamily: FONTS.brandBold,
    color: "#fff",
  },
  submitButtonPrice: {
    fontSize: 20,
    fontFamily: FONTS.brandBold,
    color: "#fff",
  },
  // Success Modal Styles
  successOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  successContent: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    width: "85%",
  },
  successIconContainer: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 28,
    fontFamily: FONTS.brandBold,
    color: COLORS.dark,
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    fontFamily: FONTS.brand,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  successTotal: {
    fontSize: 24,
    fontFamily: FONTS.brandBold,
    color: COLORS.primary,
    marginBottom: 8,
  },
  successSubtext: {
    fontSize: 14,
    fontFamily: FONTS.brand,
    color: "#999",
  },
});
