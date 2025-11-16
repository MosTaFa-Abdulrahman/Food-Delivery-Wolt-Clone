import styled from "styled-components";

export const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
`;

export const PageHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
  padding: 40px;
  margin-bottom: 40px;
  color: white;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);

  @media (max-width: 768px) {
    padding: 30px 20px;
  }
`;

export const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 640px) {
    flex-direction: column;
    text-align: center;
  }
`;

export const HeaderIcon = styled.div`
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);

  svg {
    color: white;
  }

  @media (max-width: 640px) {
    width: 60px;
    height: 60px;

    svg {
      width: 30px;
      height: 30px;
    }
  }
`;

export const PageTitle = styled.h1`
  font-size: 42px;
  font-weight: 800;
  margin: 0 0 8px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    font-size: 32px;
  }

  @media (max-width: 640px) {
    font-size: 28px;
  }
`;

export const PageSubtitle = styled.p`
  font-size: 16px;
  margin: 0;
  opacity: 0.95;

  @media (max-width: 640px) {
    font-size: 14px;
  }
`;

export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 640px) {
    gap: 12px;
  }
`;

export const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);

  @media (max-width: 640px) {
    padding: 16px;
  }
`;

export const StatNumber = styled.div`
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 8px;

  @media (max-width: 640px) {
    font-size: 28px;
  }
`;

export const StatLabel = styled.div`
  font-size: 14px;
  opacity: 0.9;
`;

export const TabsContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 40px;
  background: white;
  padding: 8px;
  border-radius: 16px;
  border: 2px solid #f0f0f0;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 8px;
  }
`;

export const Tab = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 24px;
  background: ${(props) =>
    props.$active
      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      : "transparent"};
  color: ${(props) => (props.$active ? "white" : "#666")};
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  svg {
    transition: all 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) =>
      props.$active
        ? "0 8px 20px rgba(102, 126, 234, 0.3)"
        : "0 4px 12px rgba(0, 0, 0, 0.05)"};
  }

  @media (max-width: 640px) {
    padding: 14px 20px;
    font-size: 15px;
  }
`;

export const TabBadge = styled.span`
  background: ${(props) =>
    props.theme === "active" ? "rgba(255, 255, 255, 0.2)" : "#f0f0f0"};
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  margin-left: 4px;
`;

export const Section = styled.div`
  margin-bottom: 60px;
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 28px;
  font-weight: 800;
  color: #2c3e50;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

export const SectionCount = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #7f8c8d;
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 20px;

  .spin {
    animation: spin 1s linear infinite;
    color: #667eea;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  p {
    font-size: 18px;
    color: #666;
  }
`;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 20px;
  text-align: center;

  svg {
    color: #d32f2f;
  }

  p {
    font-size: 16px;
    color: #7f8c8d;
    max-width: 500px;
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  background: white;
  border-radius: 20px;
  border: 2px solid #f0f0f0;

  svg {
    color: #d0d0d0;
    margin-bottom: 24px;
  }

  h3 {
    font-size: 28px;
    color: #2c3e50;
    margin: 0 0 12px 0;
  }

  p {
    font-size: 16px;
    color: #7f8c8d;
    margin: 0 0 32px 0;
    max-width: 500px;
  }
`;

export const ExploreButton = styled.button`
  padding: 14px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  }
`;

/* Restaurant Styles */
export const RestaurantsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const RestaurantCard = styled.div`
  background: white;
  border: 2px solid #f0f0f0;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
    transform: translateY(-4px);
  }
`;

export const RestaurantImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 240px;
  cursor: pointer;
  overflow: hidden;
`;

export const RestaurantImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${RestaurantImageContainer}:hover & {
    transform: scale(1.05);
  }
`;

export const RestaurantOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.3) 100%
  );
`;

export const RatingBadge = styled.div`
  position: absolute;
  bottom: 16px;
  left: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: rgba(255, 255, 255, 0.95);
  color: #f59e0b;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  backdrop-filter: blur(10px);
  z-index: 2;

  svg {
    color: #f59e0b;
  }
`;

export const FavouriteButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 0, 0, 0.95);
  color: white;
  border: 2px solid #ff0000;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;
  backdrop-filter: blur(10px);

  svg {
    transition: all 0.3s ease;
  }

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(255, 0, 0, 0.4);
    background: rgba(255, 0, 0, 1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const RestaurantContent = styled.div`
  padding: 24px;
`;

export const RestaurantName = styled.h3`
  font-size: 22px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 10px 0;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #667eea;
  }
`;

export const RestaurantDescription = styled.p`
  font-size: 14px;
  color: #7f8c8d;
  margin: 0 0 16px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const RestaurantInfo = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #666;

  svg {
    color: #667eea;
    flex-shrink: 0;
  }
`;

export const RestaurantFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 2px solid #f0f0f0;
`;

export const DeliveryInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  color: #2c3e50;

  svg {
    color: #667eea;
  }
`;

export const ViewButton = styled.button`
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }
`;

/* Product Styles */
export const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const ProductCard = styled.div`
  background: white;
  border: 2px solid #f0f0f0;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
    transform: translateY(-4px);
  }
`;

export const ProductImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 220px;
`;

export const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const UnavailableBadge = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 6px 12px;
  background: rgba(211, 47, 47, 0.95);
  color: white;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  z-index: 2;
`;

export const ProductFavouriteButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 0, 0, 0.95);
  color: white;
  border: 2px solid #ff0000;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;
  backdrop-filter: blur(10px);

  svg {
    transition: all 0.3s ease;
  }

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(255, 0, 0, 0.4);
    background: rgba(255, 0, 0, 1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const ProductContent = styled.div`
  padding: 20px;
`;

export const ProductName = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 8px 0;
`;

export const ProductDescription = styled.p`
  font-size: 14px;
  color: #7f8c8d;
  margin: 0 0 12px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const ProductCategory = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #f0f0f0;
  color: #666;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 16px;

  svg {
    color: #667eea;
  }
`;

export const ProductFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const ProductPrice = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: #667eea;
`;

export const ProductQuantity = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #7f8c8d;

  svg {
    color: #667eea;
  }
`;

export const AddToCartButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    background: #e0e0e0;
    color: #999;
    cursor: not-allowed;
  }
`;
