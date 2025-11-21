import styled from "styled-components";
import { Paper } from "@mui/material";

export const Container = styled.div`
  padding: 24px;
  max-width: 1600px;
  margin: 0 auto;
  min-height: 100vh;
`;

export const Header = styled.div`
  margin-bottom: 32px;
`;

export const Title = styled.h1`
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const Subtitle = styled.p`
  font-size: 16px;
  margin: 0;
  color: #7f8c8d;
`;

// Statistics Cards
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

export const StatCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }
`;

export const StatIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.$color}15;
  color: ${(props) => props.$color};
`;

export const StatContent = styled.div`
  flex: 1;
`;

export const StatLabel = styled.div`
  font-size: 13px;
  color: #7f8c8d;
  margin-bottom: 4px;
  font-weight: 500;
`;

export const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
`;

// Main Paper
export const StyledPaper = styled(Paper)`
  && {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  }
`;

// Toolbar
export const ToolBar = styled.div`
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  border-bottom: 1px solid #e0e0e0;
  background: linear-gradient(to right, #f8f9fa, #ffffff);

  @media (max-width: 992px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  max-width: 500px;

  @media (max-width: 992px) {
    max-width: 100%;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.3s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #9e9e9e;
  }
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #9e9e9e;
  display: flex;
  align-items: center;
`;

export const FilterWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const FilterLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  white-space: nowrap;
`;

export const FilterSelect = styled.select`
  padding: 10px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #2c3e50;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &:hover {
    border-color: #667eea;
  }
`;

// Info Banner
export const InfoBanner = styled.div`
  padding: 12px 24px;
  background: linear-gradient(to right, #e3f2fd, #fff3e0);
  border-left: 4px solid #2196f3;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #1565c0;
  font-size: 14px;

  svg {
    flex-shrink: 0;
  }

  strong {
    font-weight: 700;
  }
`;

// Table Wrapper
export const TableWrapper = styled.div`
  .MuiDataGrid-root {
    border: none;
    font-family: inherit;
  }

  .MuiDataGrid-columnHeaders {
    background: linear-gradient(to right, #f8f9fa, #f1f3f5);
    border-bottom: 2px solid #e0e0e0;
    font-weight: 600;
    color: #2c3e50;
  }

  .MuiDataGrid-columnHeaderTitle {
    font-weight: 700;
    font-size: 14px;
  }

  .MuiDataGrid-cell {
    border-bottom: 1px solid #f5f5f5;
    padding: 16px;
  }

  .MuiDataGrid-row {
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #f8f9ff;
    }
  }

  .MuiDataGrid-footerContainer {
    border-top: 2px solid #e0e0e0;
    background: #fafafa;
  }
`;

// Order Number
export const OrderNumber = styled.div`
  font-family: "Courier New", monospace;
  font-weight: 700;
  color: #667eea;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 4px 8px;
  border-radius: 6px;
  display: inline-block;

  &:hover {
    background: #667eea15;
    color: #764ba2;
    transform: translateX(4px);
  }

  &:active {
    transform: scale(0.98);
  }
`;

// Customer Info
export const CustomerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const CustomerName = styled.div`
  font-weight: 600;
  font-size: 15px;
  color: #2c3e50;
`;

export const CustomerEmail = styled.div`
  font-size: 13px;
  color: #7f8c8d;
`;

// Restaurant Info
export const RestaurantInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const RestaurantImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

export const RestaurantName = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #2c3e50;
`;

// Items Count
export const ItemsCount = styled.div`
  font-size: 14px;
  color: #7f8c8d;
  font-weight: 500;
`;

// Total Amount
export const TotalAmount = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #27ae60;
`;

// Status Badge
export const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  background: ${(props) => props.$color}20;
  color: ${(props) => props.$color};
  position: relative;
  opacity: ${(props) => (props.$locked ? 0.7 : 1)};

  svg {
    flex-shrink: 0;
  }
`;

export const LockedIcon = styled.span`
  font-size: 12px;
  margin-left: 2px;
`;

// Actions Cell
export const ActionsCell = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const StatusSelect = styled.select`
  padding: 8px 12px;
  border: 2px solid ${(props) => (props.$locked ? "#e0e0e0" : "#667eea")};
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  background: ${(props) => (props.$locked ? "#f5f5f5" : "white")};
  color: ${(props) => (props.$locked ? "#9e9e9e" : "#2c3e50")};
  cursor: ${(props) => (props.$locked ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  opacity: ${(props) => (props.$locked ? 0.6 : 1)};

  &:not(:disabled):hover {
    border-color: #764ba2;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
  }

  &:focus {
    outline: none;
    border-color: #764ba2;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

// Date Text
export const DateText = styled.div`
  font-size: 13px;
  color: #7f8c8d;
`;

// Loading & Error States
export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #667eea;
  font-size: 18px;
  font-weight: 600;
`;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;
  color: #d32f2f;
  padding: 24px;
`;

export const ErrorText = styled.p`
  font-size: 16px;
  font-weight: 600;
  margin: 0;
`;

export const RetryButton = styled.button`
  padding: 10px 24px;
  background: #d32f2f;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #c62828;
    transform: translateY(-2px);
  }
`;
