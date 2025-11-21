import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { COLORS, FONTS } from "@/constants/theme";

// React-Query
import {
  useInfiniteMyOrders,
  useDeleteOrder,
} from "@/store/orders/ordersSlice";

// Types
interface OrderHistoryModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function OrderHistoryModal({
  visible,
  onClose,
}: OrderHistoryModalProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteMyOrders();

  // Delete mutation
  const deleteOrderMutation = useDeleteOrder();

  // Track expanded orders
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  // Flatten orders from all pages
  const orders = data?.pages.flatMap((page) => page.data || []) || [];
  const totalOrders = data?.pages[0]?.pagination?.total || 0;

  // Toggle order expansion
  const toggleOrderExpanded = (orderId: string) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  // Handle delete order
  const handleDeleteOrder = (
    orderId: string,
    orderNumber: string,
    status: string
  ) => {
    if (status !== "PENDING") {
      Alert.alert(
        "Cannot Delete",
        `Orders with status "${status}" cannot be deleted. Only PENDING orders can be deleted.`,
        [{ text: "OK" }]
      );
      return;
    }

    Alert.alert(
      "Delete Order",
      `Are you sure you want to delete order #${orderNumber}? This action cannot be undone and product quantities will be restored.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteOrderMutation.mutate(orderId, {
              onSuccess: () => {
                Alert.alert("Success", "Order deleted successfully");
              },
              onError: (error: any) => {
                Alert.alert(
                  "Error",
                  error.response?.data?.error || "Failed to delete order"
                );
              },
            });
          },
        },
      ]
    );
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "#FF9800";
      case "CONFIRMED":
        return "#2196F3";
      case "PREPARING":
        return "#9C27B0";
      case "OUT_FOR_DELIVERY":
        return "#FF5722";
      case "DELIVERED":
        return "#4CAF50";
      case "CANCELLED":
        return "#F44336";
      default:
        return "#999";
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return "time-outline";
      case "CONFIRMED":
        return "checkmark-circle-outline";
      case "PREPARING":
        return "restaurant-outline";
      case "OUT_FOR_DELIVERY":
        return "bicycle-outline";
      case "DELIVERED":
        return "checkmark-done-circle";
      case "CANCELLED":
        return "close-circle-outline";
      default:
        return "help-circle-outline";
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Render order item
  const renderOrderItem = ({ item }: any) => {
    const isExpanded = expandedOrders.has(item.id);
    const canDelete = item.status === "PENDING";

    return (
      <View style={styles.orderCard}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => toggleOrderExpanded(item.id)}
        >
          {/* Restaurant Info */}
          <View style={styles.orderHeader}>
            <Image
              source={{ uri: item.restaurant.imgUrl }}
              style={styles.restaurantImage}
              contentFit="cover"
            />
            <View style={styles.orderHeaderInfo}>
              <Text style={styles.restaurantName} numberOfLines={1}>
                {item.restaurant.name}
              </Text>
              <Text style={styles.orderNumber}>#{item.orderNumber}</Text>
              <Text style={styles.orderDate}>
                {formatDate(item.createdDate)}
              </Text>
            </View>

            {/* Delete Button - Only for PENDING orders */}
            {canDelete && (
              <TouchableOpacity
                onPress={() =>
                  handleDeleteOrder(item.id, item.orderNumber, item.status)
                }
                style={styles.deleteButton}
                disabled={deleteOrderMutation.isPending}
              >
                {deleteOrderMutation.isPending ? (
                  <ActivityIndicator size="small" color="#F44336" />
                ) : (
                  <Ionicons name="trash-outline" size={22} color="#F44336" />
                )}
              </TouchableOpacity>
            )}

            <View style={styles.expandButton}>
              <Ionicons
                name={isExpanded ? "chevron-up" : "chevron-down"}
                size={24}
                color="#999"
              />
            </View>
          </View>

          {/* Order Items Preview */}
          <View style={styles.itemsPreview}>
            <Text style={styles.itemsPreviewText}>
              {item.orderItems.length}{" "}
              {item.orderItems.length === 1 ? "item" : "items"}
            </Text>
            <Text style={styles.itemsList} numberOfLines={1}>
              {item.orderItems.map((i: any) => i.productName).join(", ")}
            </Text>
          </View>

          {/* Order Footer */}
          <View style={styles.orderFooter}>
            <View style={styles.statusContainer}>
              <Ionicons
                name={getStatusIcon(item.status) as any}
                size={16}
                color={getStatusColor(item.status)}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(item.status) },
                ]}
              >
                {item.status.replace("_", " ")}
              </Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmount}>
                €{(item.totalAmount + item.deliveryFee).toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Notes */}
          {item.notes && (
            <View style={styles.notesContainer}>
              <Ionicons name="chatbox-outline" size={14} color="#999" />
              <Text style={styles.notesText} numberOfLines={1}>
                {item.notes}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Expanded Order Items Details */}
        {isExpanded && (
          <View style={styles.expandedSection}>
            <View style={styles.expandedHeader}>
              <Text style={styles.expandedTitle}>Order Items</Text>
            </View>

            {item.orderItems.map((orderItem: any, index: number) => (
              <View key={orderItem.id} style={styles.orderItemRow}>
                {/* Product Image */}
                {orderItem.productImgUrl && (
                  <Image
                    source={{ uri: orderItem.productImgUrl }}
                    style={styles.productImage}
                    contentFit="cover"
                  />
                )}

                {/* Product Details */}
                <View style={styles.productDetails}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {orderItem.productName}
                  </Text>
                  <Text style={styles.productPrice}>
                    €{orderItem.productPrice.toFixed(2)} × {orderItem.quantity}
                  </Text>
                </View>

                {/* Item Total */}
                <View style={styles.productTotal}>
                  <Text style={styles.productTotalText}>
                    €{(orderItem.productPrice * orderItem.quantity).toFixed(2)}
                  </Text>
                </View>
              </View>
            ))}

            {/* Order Summary */}
            <View style={styles.orderSummary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>
                  €{item.totalAmount.toFixed(2)}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <Text style={styles.summaryValue}>
                  €{item.deliveryFee.toFixed(2)}
                </Text>
              </View>

              <View style={[styles.summaryRow, styles.summaryTotal]}>
                <Text style={styles.summaryTotalLabel}>Total</Text>
                <Text style={styles.summaryTotalValue}>
                  €{(item.totalAmount + item.deliveryFee).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  // Render footer
  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  };

  // Handle load more
  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Order History</Text>
              <Text style={styles.modalSubtitle}>
                {totalOrders} {totalOrders === 1 ? "order" : "orders"}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={COLORS.dark} />
            </TouchableOpacity>
          </View>

          {/* Orders List */}
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Loading orders...</Text>
            </View>
          ) : orders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={80} color="#E0E0E0" />
              <Text style={styles.emptyTitle}>No orders yet</Text>
              <Text style={styles.emptySubtitle}>
                Start ordering from your favorite restaurants
              </Text>
            </View>
          ) : (
            <FlatList
              data={orders}
              renderItem={renderOrderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={renderFooter}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
    paddingBottom: 0,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: FONTS.brandBold,
    color: COLORS.dark,
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: FONTS.brand,
    color: "#999",
    marginTop: 4,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  orderHeader: {
    flexDirection: "row",
    padding: 16,
    paddingBottom: 12,
  },
  restaurantImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
  },
  orderHeaderInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  restaurantName: {
    fontSize: 16,
    fontFamily: FONTS.brandBold,
    color: COLORS.dark,
    marginBottom: 4,
  },
  orderNumber: {
    fontSize: 13,
    fontFamily: FONTS.brand,
    color: "#999",
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 12,
    fontFamily: FONTS.brand,
    color: "#999",
  },
  deleteButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
  },
  expandButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 8,
  },
  itemsPreview: {
    backgroundColor: "#F9F9F9",
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  itemsPreviewText: {
    fontSize: 13,
    fontFamily: FONTS.brandBold,
    color: COLORS.dark,
    marginBottom: 4,
  },
  itemsList: {
    fontSize: 13,
    fontFamily: FONTS.brand,
    color: "#666",
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusText: {
    fontSize: 13,
    fontFamily: FONTS.brandBold,
    textTransform: "capitalize",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  totalLabel: {
    fontSize: 14,
    fontFamily: FONTS.brand,
    color: "#666",
  },
  totalAmount: {
    fontSize: 18,
    fontFamily: FONTS.brandBold,
    color: COLORS.primary,
  },
  notesContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 12,
  },
  notesText: {
    flex: 1,
    fontSize: 12,
    fontFamily: FONTS.brand,
    color: "#999",
    fontStyle: "italic",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: FONTS.brand,
    color: "#999",
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: FONTS.brandBold,
    color: COLORS.dark,
    marginTop: 24,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: FONTS.brand,
    color: "#999",
    textAlign: "center",
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
  // Expanded Section Styles
  expandedSection: {
    backgroundColor: "#FAFAFA",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  expandedHeader: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  expandedTitle: {
    fontSize: 16,
    fontFamily: FONTS.brandBold,
    color: COLORS.dark,
  },
  orderItemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    gap: 12,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
    backgroundColor: "#F5F5F5",
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontFamily: FONTS.brandBold,
    color: COLORS.dark,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 13,
    fontFamily: FONTS.brand,
    color: "#666",
  },
  productTotal: {
    alignItems: "flex-end",
  },
  productTotalText: {
    fontSize: 15,
    fontFamily: FONTS.brandBold,
    color: COLORS.primary,
  },
  orderSummary: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: FONTS.brand,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: FONTS.brand,
    color: COLORS.dark,
  },
  summaryTotal: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    marginBottom: 0,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontFamily: FONTS.brandBold,
    color: COLORS.dark,
  },
  summaryTotalValue: {
    fontSize: 18,
    fontFamily: FONTS.brandBold,
    color: COLORS.primary,
  },
});
