import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-height: 70vh;
  overflow-y: auto;
  /* padding-right: 8px; */
  padding: 20px;

  /* Custom Scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #667eea;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #764ba2;
  }
`;

/* Order Header */
export const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
  flex-wrap: wrap;
  gap: 16px;
`;

export const OrderNumberSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const OrderNumberLabel = styled.span`
  font-size: 13px;
  opacity: 0.9;
  font-weight: 500;
`;

export const OrderNumberValue = styled.span`
  font-size: 20px;
  font-weight: 700;
  font-family: "Courier New", monospace;
`;

export const StatusBadge = styled.div`
  padding: 10px 20px;
  background: ${(props) => props.$color};
  border-radius: 20px;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

/* Sections */
export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #e0e0e0;

  svg {
    color: #667eea;
  }
`;

/* Info Grid */
export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #667eea;
`;

export const InfoIcon = styled.div`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #667eea15;
  border-radius: 8px;
  color: #667eea;
  flex-shrink: 0;
`;

export const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

export const InfoLabel = styled.span`
  font-size: 12px;
  color: #7f8c8d;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const InfoValue = styled.span`
  font-size: 15px;
  color: #2c3e50;
  font-weight: 600;
  word-break: break-word;
`;

/* Restaurant Card */
export const RestaurantCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 12px;
  border: 2px solid #e0e0e0;
`;

export const RestaurantImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

export const RestaurantName = styled.h4`
  font-size: 18px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
`;

/* Order Items */
export const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const OrderItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: white;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
    transform: translateY(-2px);
  }
`;

export const ItemImage = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const ItemDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const ItemName = styled.h5`
  font-size: 16px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
`;

export const ItemPrice = styled.span`
  font-size: 14px;
  color: #7f8c8d;
  font-weight: 600;
`;

export const ItemQuantity = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
`;

export const QuantityBadge = styled.span`
  padding: 6px 12px;
  background: #667eea15;
  color: #667eea;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
`;

export const ItemTotal = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #27ae60;
`;

/* Order Summary */
export const SummaryBox = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  padding: 20px;
  border-radius: 12px;
  border: 2px solid #e0e0e0;
`;

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  font-size: ${(props) => (props.$isTotal ? "18px" : "15px")};
  font-weight: ${(props) => (props.$isTotal ? "700" : "600")};
  color: ${(props) => (props.$isTotal ? "#2c3e50" : "#7f8c8d")};
`;

export const SummaryLabel = styled.span``;

export const SummaryValue = styled.span`
  color: ${(props) => (props.$isTotal ? "#27ae60" : "inherit")};
`;

export const SummaryDivider = styled.div`
  height: 2px;
  background: linear-gradient(to right, #667eea, #764ba2);
  margin: 12px 0;
  border-radius: 2px;
`;

/* Notes */
export const NotesBox = styled.div`
  margin-top: 8px;
  padding: 16px;
  background: #fff3cd;
  border-left: 4px solid #ffc107;
  border-radius: 8px;
`;

export const NotesLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #856404;
  margin-bottom: 8px;
`;

export const NotesText = styled.p`
  font-size: 15px;
  color: #856404;
  margin: 0;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
`;
