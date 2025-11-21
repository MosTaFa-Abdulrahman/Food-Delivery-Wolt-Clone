import styled from "styled-components";
import { Paper } from "@mui/material";

export const Container = styled.div`
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
`;

// Header Section
export const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  color: #2c3e50;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #f8f9fa;
    border-color: #667eea;
    color: #667eea;
    transform: translateX(-4px);
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: stretch;
  }
`;

export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${(props) =>
    props.$variant === "delete" ? "#ffebee" : "#e3f2fd"};
  color: ${(props) => (props.$variant === "delete" ? "#d32f2f" : "#1976d2")};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background: ${(props) =>
      props.$variant === "delete" ? "#ffcdd2" : "#bbdefb"};
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    flex: 1;
    justify-content: center;
  }
`;

// Profile Card
export const ProfileCard = styled(Paper)`
  && {
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    margin-bottom: 32px;
  }
`;

export const ProfileHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 32px 80px;
  position: relative;
`;

export const AvatarSection = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

export const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 5px solid white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-size: 48px;
  font-weight: 700;
  color: white;
`;

export const UserMainInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 12px;
`;

export const UserName = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  color: white;
`;

export const UserEmail = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

export const RoleBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  backdrop-filter: blur(10px);
  width: fit-content;

  @media (max-width: 768px) {
    margin: 0 auto;
  }
`;

export const ProfileBody = styled.div`
  padding: 32px;
  /* margin-top: -40px; */
  position: relative;
  z-index: 1;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const InfoLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #7f8c8d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const InfoValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
`;

// Statistics
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

export const StatCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }
`;

export const StatIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.$color}15;
  color: ${(props) => props.$color};
  flex-shrink: 0;
`;

export const StatContent = styled.div`
  flex: 1;
`;

export const StatLabel = styled.div`
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 4px;
  font-weight: 500;
`;

export const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
`;

// Section
export const Section = styled(Paper)`
  && {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    margin-bottom: 32px;
  }
`;

export const SectionHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
  background: linear-gradient(to right, #f8f9fa, #ffffff);
`;

export const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;

  svg {
    color: #667eea;
  }
`;

// Table
export const TableWrapper = styled.div`
  padding: 24px;

  .MuiDataGrid-root {
    border: none;
    font-family: inherit;
  }

  .MuiDataGrid-columnHeaders {
    background: #f8f9fa;
    border-bottom: 2px solid #e0e0e0;
  }

  .MuiDataGrid-columnHeaderTitle {
    font-weight: 700;
    font-size: 14px;
  }

  .MuiDataGrid-row {
    &:hover {
      background-color: #f8f9ff;
    }
  }
`;

export const OrderNumber = styled.div`
  font-weight: 700;
  color: #667eea;
  font-size: 14px;
`;

export const RestaurantName = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #2c3e50;
`;

export const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 700;
  background: ${(props) => props.$color}20;
  color: ${(props) => props.$color};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const PriceText = styled.div`
  font-weight: 700;
  font-size: 16px;
  color: #27ae60;
`;

export const DateText = styled.div`
  font-size: 14px;
  color: #7f8c8d;
  font-weight: 500;
`;

// Favourites
export const FavouritesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
`;

export const FavouriteSection = styled(Paper)`
  && {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

export const FavouriteList = styled.div`
  padding: 16px;
  max-height: 400px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #667eea;
    border-radius: 4px;
  }
`;

export const FavouriteItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  margin-bottom: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #f8f9ff;
  }
`;

export const FavouriteIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const FavouriteInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const FavouriteName = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #2c3e50;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const FavouriteDetail = styled.div`
  font-size: 13px;
  color: #7f8c8d;
  font-weight: 500;
`;

export const EmptyFavourite = styled.div`
  text-align: center;
  padding: 32px 16px;
  color: #95a5a6;
  font-size: 14px;
`;

// Loading & Empty States
export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  gap: 16px;
  color: #667eea;
  font-size: 16px;
  font-weight: 600;
`;

export const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const LoadingText = styled.div`
  text-align: center;
  padding: 24px;
  color: #667eea;
  font-weight: 600;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  color: #95a5a6;

  svg {
    margin-bottom: 16px;
    opacity: 0.5;
  }
`;

export const EmptyStateText = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #7f8c8d;
  margin-bottom: 8px;
`;

export const EmptyStateSubtext = styled.div`
  font-size: 14px;
  color: #95a5a6;
`;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 20px;
  padding: 24px;
`;

export const ErrorText = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: #d32f2f;
  margin: 0;
  text-align: center;
`;
