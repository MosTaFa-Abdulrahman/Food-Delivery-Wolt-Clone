import styled from "styled-components";
import { Link } from "react-router-dom";

export const NavbarContainer = styled.nav`
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid #f0f0f0;
`;

export const NavbarWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;

  @media (max-width: 768px) {
    padding: 0 16px;
    height: 64px;
  }
`;

export const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

export const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
`;

export const LogoText = styled.span`
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

export const DesktopNav = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: center;

  @media (max-width: 968px) {
    display: none;
  }
`;

export const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 12px;
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
  color: ${(props) => (props.$isActive ? "#667eea" : "#666")};
  background: ${(props) => (props.$isActive ? "#f0f4ff" : "transparent")};
  transition: all 0.2s ease;
  position: relative;

  svg {
    color: ${(props) => (props.$isActive ? "#667eea" : "#999")};
  }

  &:hover {
    background: #f0f4ff;
    color: #667eea;

    svg {
      color: #667eea;
    }
  }

  ${(props) =>
    props.$isActive &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 20px;
      right: 20px;
      height: 3px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 2px;
    }
  `}
`;

export const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const ProfileWrapper = styled.div`
  position: relative;

  @media (max-width: 968px) {
    display: none;
  }
`;

export const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f0f4ff;
    border-color: #667eea;
  }
`;

export const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const MobileAvatar = styled(Avatar)`
  display: none;

  @media (max-width: 968px) {
    display: flex;
  }
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
`;

export const UserName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

export const UserRole = styled.span`
  font-size: 12px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const ProfileDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 8px;
  min-width: 200px;
  animation: slideDown 0.2s ease;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const DropdownItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  transition: all 0.2s ease;
  text-align: left;

  svg {
    color: #667eea;
  }

  &:hover {
    background: #f0f4ff;
  }
`;

export const DropdownDivider = styled.div`
  height: 1px;
  background: #e9ecef;
  margin: 8px 0;
`;

export const LoginButton = styled(Link)`
  padding: 10px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  display: inline-block;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }

  @media (max-width: 968px) {
    display: none;
  }
`;

export const MobileMenuButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: #333;
  transition: all 0.2s ease;

  &:hover {
    color: #667eea;
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 968px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const MobileMenu = styled.div`
  display: none;

  @media (max-width: 968px) {
    display: block;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 9999;
    pointer-events: ${(props) => (props.$isOpen ? "auto" : "none")};
  }
`;

export const MobileMenuOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

export const MobileMenuContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 85%;
  max-width: 320px;
  background: white;
  display: flex;
  flex-direction: column;
  transform: ${(props) =>
    props.$isOpen ? "translateX(0)" : "translateX(-100%)"};
  transition: transform 0.3s ease;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.15);
`;

export const MobileMenuHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
`;

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    color: #667eea;
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 8px;
  flex: 1;
  overflow-y: auto;
`;

export const MobileNavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 12px;
  text-decoration: none;
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => (props.$isActive ? "#667eea" : "#666")};
  background: ${(props) => (props.$isActive ? "#f0f4ff" : "transparent")};
  transition: all 0.2s ease;

  svg {
    color: ${(props) => (props.$isActive ? "#667eea" : "#999")};
  }

  &:hover {
    background: #f0f4ff;
    color: #667eea;

    svg {
      color: #667eea;
    }
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const MobileUserSection = styled.div`
  padding: 16px;
  border-top: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f8f9fa;
`;

export const MobileUserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const MobileLogoutButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 10px;
  color: #c33;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #fdd;
  }

  &:active {
    transform: scale(0.98);
  }
`;
