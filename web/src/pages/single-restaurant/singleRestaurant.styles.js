import styled from "styled-components";

export const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
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
  min-height: 60vh;
  gap: 20px;
  padding: 40px;
  text-align: center;

  svg {
    color: #d32f2f;
  }

  h2 {
    font-size: 32px;
    color: #2c3e50;
    margin: 0;
  }

  p {
    font-size: 16px;
    color: #7f8c8d;
    max-width: 500px;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  color: #2c3e50;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f5f5f5;
    border-color: #d0d0d0;
  }
`;

export const FavouriteButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: white;
  color: #666;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  svg {
    transition: all 0.3s ease;
    color: ${(props) => (props.$isFavourite ? "#ff0000" : "#666")};
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    border-color: ${(props) => (props.$isFavourite ? "#ff0000" : "#d0d0d0")};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Hero = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    height: 300px;
  }
`;

export const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const HeroOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.7) 100%
  );
`;

export const HeroContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px;
  color: white;

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

export const RestaurantName = styled.h1`
  font-size: 48px;
  font-weight: 800;
  margin: 0 0 12px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

export const RestaurantDescription = styled.p`
  font-size: 18px;
  margin: 0 0 16px 0;
  max-width: 600px;
  line-height: 1.6;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

export const RatingBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.95);
  color: #f59e0b;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

export const InfoSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 50px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 24px;
  background: white;
  border: 2px solid #f0f0f0;
  border-radius: 16px;
  transition: all 0.3s ease;

  svg {
    color: #667eea;
    flex-shrink: 0;
  }

  &:hover {
    border-color: #667eea;
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
    transform: translateY(-2px);
  }
`;

export const InfoLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #7f8c8d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
`;

export const InfoValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #2c3e50;
`;

export const InfoSubValue = styled.div`
  font-size: 14px;
  color: #95a5a6;
  margin-top: 2px;
`;

export const CategoriesSection = styled.div`
  margin-bottom: 50px;
`;

export const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: 800;
  color: #2c3e50;
  margin: 0 0 24px 0;
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

export const ProductCount = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: #7f8c8d;
`;

export const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const CategoryCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: ${(props) =>
    props.$active
      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      : "white"};
  color: ${(props) => (props.$active ? "white" : "#2c3e50")};
  border: 2px solid ${(props) => (props.$active ? "#667eea" : "#f0f0f0")};
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
  }
`;

export const CategoryImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  object-fit: cover;
  margin-bottom: 12px;
`;

export const CategoryIcon = styled.div`
  font-size: 48px;
  margin-bottom: 8px;
`;

export const CategoryName = styled.div`
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 4px;
`;

export const CategoryCount = styled.div`
  font-size: 13px;
  opacity: 0.8;
`;

export const ProductsSection = styled.div`
  margin-bottom: 50px;
`;

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
  position: relative;

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
  background: ${(props) =>
    props.$isFavourite ? "rgba(255, 0, 0, 0.95)" : "rgba(255, 255, 255, 0.95)"};
  color: ${(props) => (props.$isFavourite ? "white" : "#ff0000")};
  border: 2px solid
    ${(props) => (props.$isFavourite ? "#ff0000" : "rgba(255, 255, 255, 0.9)")};
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
    box-shadow: 0 4px 12px rgba(255, 0, 0, 0.3);
    background: ${(props) =>
      props.$isFavourite ? "rgba(255, 0, 0, 1)" : "rgba(255, 255, 255, 1)"};
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
  margin: 0 0 16px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;

  svg {
    color: #d0d0d0;
    margin-bottom: 20px;
  }

  h3 {
    font-size: 24px;
    color: #2c3e50;
    margin: 0 0 8px 0;
  }

  p {
    font-size: 16px;
    color: #7f8c8d;
    margin: 0;
  }
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  margin-top: 40px;
  padding: 20px;
  background: white;
  border-radius: 16px;
  border: 2px solid #f0f0f0;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 16px;
  }
`;

export const PaginationButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: ${(props) => (props.disabled ? "#f5f5f5" : "white")};
  color: ${(props) => (props.disabled ? "#999" : "#667eea")};
  border: 2px solid ${(props) => (props.disabled ? "#e0e0e0" : "#667eea")};
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;

  svg {
    transition: transform 0.3s ease;
  }

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.3);

    svg {
      transform: ${(props) =>
        props.children[0]?.type?.name === "ChevronLeft"
          ? "translateX(-4px)"
          : "translateX(4px)"};
    }
  }

  @media (max-width: 640px) {
    width: 100%;
    justify-content: center;
  }
`;

export const PaginationInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  min-width: 200px;
  text-align: center;
`;

export const TotalItems = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #7f8c8d;
`;
