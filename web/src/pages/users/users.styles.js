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

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const ToolBarTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 700;
  color: #2c3e50;

  svg {
    color: #667eea;
  }
`;

export const InfoText = styled.div`
  font-size: 14px;
  color: #7f8c8d;
  font-weight: 500;
`;

// Search Components
export const SearchContainer = styled.div`
  flex: 1;
  max-width: 500px;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    max-width: 100%;
    width: 100%;
  }
`;

export const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 10px 16px;
  gap: 10px;
  transition: all 0.3s ease;

  &:focus-within {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  svg:first-child {
    color: #7f8c8d;
    flex-shrink: 0;
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  color: #2c3e50;
  background: transparent;

  &::placeholder {
    color: #95a5a6;
  }
`;

export const ClearButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border: none;
  border-radius: 6px;
  width: 28px;
  height: 28px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #7f8c8d;

  &:hover {
    background: #e0e0e0;
    color: #2c3e50;
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const SearchSpinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  flex-shrink: 0;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const SearchInfo = styled.div`
  padding: 12px 24px;
  background: #f8f9ff;
  border-bottom: 1px solid #e0e0e0;
  color: #7f8c8d;
  font-size: 14px;

  strong {
    color: #667eea;
    font-weight: 600;
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

// User Info
export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 4px;
  border-radius: 8px;

  &:hover {
    background: #667eea10;
    transform: translateX(4px);
  }
`;

export const UserAvatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
`;

export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const AvatarPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  color: white;
`;

export const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Username = styled.div`
  font-weight: 700;
  font-size: 16px;
  color: #2c3e50;
`;

export const UserEmail = styled.div`
  font-size: 13px;
  color: #7f8c8d;
  display: flex;
  align-items: center;
  gap: 6px;
`;

// Full Name
export const FullName = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #2c3e50;
`;

// Phone Number
export const PhoneNumber = styled.div`
  font-size: 14px;
  color: #7f8c8d;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
`;

// City
export const City = styled.div`
  font-size: 14px;
  color: #7f8c8d;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
`;

// Role Badge
export const RoleBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  background: ${(props) => props.$color}20;
  color: ${(props) => props.$color};
  text-transform: uppercase;
  letter-spacing: 0.5px;

  svg {
    flex-shrink: 0;
  }
`;

// Date Text
export const DateText = styled.div`
  font-size: 14px;
  color: #7f8c8d;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
`;

// Actions
export const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const IconButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  background: ${(props) =>
    props.$variant === "delete" ? "#ffebee" : "#e3f2fd"};
  color: ${(props) => (props.$variant === "delete" ? "#d32f2f" : "#1976d2")};

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
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
