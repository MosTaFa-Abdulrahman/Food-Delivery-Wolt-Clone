import * as S from "./orderDetailsModal.styles";
import {
  Package,
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  FileText,
  Store,
} from "lucide-react";

// Components
import Modal from "../global/modal/Modal";

export default function OrderDetailsModal({ order, onClose }) {
  if (!order) return null;

  const getStatusColor = (status) => {
    const colors = {
      PENDING: "#f39c12",
      CONFIRMED: "#3498db",
      PREPARING: "#9b59b6",
      READY: "#1abc9c",
      DELIVERING: "#e67e22",
      DELIVERED: "#27ae60",
      CANCELLED: "#e74c3c",
    };
    return colors[status] || "#95a5a6";
  };

  return (
    <Modal title="Order Details" onClose={onClose}>
      <S.Container>
        {/* Order Header */}
        <S.OrderHeader>
          <S.OrderNumberSection>
            <S.OrderNumberLabel>Order Number</S.OrderNumberLabel>
            <S.OrderNumberValue>{order.orderNumber}</S.OrderNumberValue>
          </S.OrderNumberSection>

          <S.StatusBadge $color={getStatusColor(order.status)}>
            {order.status}
          </S.StatusBadge>
        </S.OrderHeader>

        {/* Customer Information */}
        <S.Section>
          <S.SectionTitle>
            <User size={20} />
            Customer Information
          </S.SectionTitle>

          <S.InfoGrid>
            <S.InfoItem>
              <S.InfoIcon>
                <User size={16} />
              </S.InfoIcon>
              <S.InfoContent>
                <S.InfoLabel>Name</S.InfoLabel>
                <S.InfoValue>{order.user.username}</S.InfoValue>
              </S.InfoContent>
            </S.InfoItem>

            <S.InfoItem>
              <S.InfoIcon>
                <Mail size={16} />
              </S.InfoIcon>
              <S.InfoContent>
                <S.InfoLabel>Email</S.InfoLabel>
                <S.InfoValue>{order.user.email}</S.InfoValue>
              </S.InfoContent>
            </S.InfoItem>

            {order.user.phoneNumber && (
              <S.InfoItem>
                <S.InfoIcon>
                  <Phone size={16} />
                </S.InfoIcon>
                <S.InfoContent>
                  <S.InfoLabel>Phone</S.InfoLabel>
                  <S.InfoValue>
                    {order.user.phoneNumber.replace(/"/g, "")}
                  </S.InfoValue>
                </S.InfoContent>
              </S.InfoItem>
            )}
          </S.InfoGrid>
        </S.Section>

        {/* Restaurant Information */}
        <S.Section>
          <S.SectionTitle>
            <Store size={20} />
            Restaurant Information
          </S.SectionTitle>

          <S.RestaurantCard>
            <S.RestaurantImage
              src={order.restaurant.imgUrl}
              alt={order.restaurant.name}
            />
            <S.RestaurantName>{order.restaurant.name}</S.RestaurantName>
          </S.RestaurantCard>
        </S.Section>

        {/* Order Items */}
        <S.Section>
          <S.SectionTitle>
            <Package size={20} />
            Order Items ({order.orderItems.length})
          </S.SectionTitle>

          <S.ItemsList>
            {order.orderItems.map((item) => (
              <S.OrderItem key={item.id}>
                <S.ItemImage
                  src={item.productImgUrl}
                  alt={item.productName}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/80?text=No+Image";
                  }}
                />

                <S.ItemDetails>
                  <S.ItemName>{item.productName}</S.ItemName>
                  <S.ItemPrice>${item.productPrice.toFixed(2)}</S.ItemPrice>
                </S.ItemDetails>

                <S.ItemQuantity>
                  <S.QuantityBadge>x{item.quantity}</S.QuantityBadge>
                  <S.ItemTotal>
                    ${(item.productPrice * item.quantity).toFixed(2)}
                  </S.ItemTotal>
                </S.ItemQuantity>
              </S.OrderItem>
            ))}
          </S.ItemsList>
        </S.Section>

        {/* Order Summary */}
        <S.Section>
          <S.SectionTitle>
            <DollarSign size={20} />
            Order Summary
          </S.SectionTitle>

          <S.SummaryBox>
            <S.SummaryRow>
              <S.SummaryLabel>Subtotal</S.SummaryLabel>
              <S.SummaryValue>
                ${(order.totalAmount - order.deliveryFee).toFixed(2)}
              </S.SummaryValue>
            </S.SummaryRow>

            <S.SummaryRow>
              <S.SummaryLabel>Delivery Fee</S.SummaryLabel>
              <S.SummaryValue>${order.deliveryFee.toFixed(2)}</S.SummaryValue>
            </S.SummaryRow>

            <S.SummaryDivider />

            <S.SummaryRow $isTotal>
              <S.SummaryLabel>Total Amount</S.SummaryLabel>
              <S.SummaryValue>${order.totalAmount.toFixed(2)}</S.SummaryValue>
            </S.SummaryRow>
          </S.SummaryBox>
        </S.Section>

        {/* Additional Information */}
        <S.Section>
          <S.SectionTitle>
            <FileText size={20} />
            Additional Information
          </S.SectionTitle>

          <S.InfoGrid>
            <S.InfoItem>
              <S.InfoIcon>
                <Calendar size={16} />
              </S.InfoIcon>
              <S.InfoContent>
                <S.InfoLabel>Order Date</S.InfoLabel>
                <S.InfoValue>
                  {new Date(order.createdDate).toLocaleString()}
                </S.InfoValue>
              </S.InfoContent>
            </S.InfoItem>

            <S.InfoItem>
              <S.InfoIcon>
                <Calendar size={16} />
              </S.InfoIcon>
              <S.InfoContent>
                <S.InfoLabel>Last Modified</S.InfoLabel>
                <S.InfoValue>
                  {new Date(order.lastModifiedDate).toLocaleString()}
                </S.InfoValue>
              </S.InfoContent>
            </S.InfoItem>
          </S.InfoGrid>

          {order.notes && (
            <S.NotesBox>
              <S.NotesLabel>
                <FileText size={16} />
                Customer Notes
              </S.NotesLabel>
              <S.NotesText>{order.notes}</S.NotesText>
            </S.NotesBox>
          )}
        </S.Section>
      </S.Container>
    </Modal>
  );
}
