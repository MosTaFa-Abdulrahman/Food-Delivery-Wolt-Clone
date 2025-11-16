import styled from "styled-components";
import { Paper } from "@mui/material";

export const Container = styled.div`
  padding: 24px;
  max-width: 1400px;
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

export const StyledPaper = styled(Paper)`
  && {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  }
`;

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
    align-items: stretch;
  }
`;

export const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  max-width: 500px;

  @media (max-width: 768px) {
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

export const AddButton = styled.button`
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

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

export const ProductImage = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const ProductInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

export const ProductName = styled.div`
  font-weight: 600;
  font-size: 15px;
  color: #2c3e50;
`;

export const ProductDescription = styled.div`
  font-size: 13px;
  color: #7f8c8d;
  line-height: 1.4;
`;

export const Badge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: ${(props) => (props.$available ? "#d4edda" : "#f8d7da")};
  color: ${(props) => (props.$available ? "#155724" : "#721c24")};
`;

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
  background: ${(props) => (props.$variant === "edit" ? "#e3f2fd" : "#ffebee")};
  color: ${(props) => (props.$variant === "edit" ? "#1976d2" : "#d32f2f")};

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
