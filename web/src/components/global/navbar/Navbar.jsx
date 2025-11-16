import * as S from "./navbar.styles";
import { useState, useContext } from "react";
import {
  Store,
  ShoppingBag,
  Package,
  Users,
  Menu,
  X,
  LogOut,
  ChevronDown,
  User,
  Heart,
} from "lucide-react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";

// Context
import { AuthContext } from "../../../context/AuthContext";
import toast from "react-hot-toast";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { path: "/admin/orders", label: "Orders", icon: <ShoppingBag size={20} /> },
    { path: "/admin/products", label: "Products", icon: <Package size={20} /> },
    {
      path: "/admin/restaurants",
      label: "Restaurants",
      icon: <Store size={20} />,
    },
    { path: "/admin/users", label: "Users", icon: <Users size={20} /> },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully 😎");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  return (
    <S.NavbarContainer>
      <S.NavbarWrapper>
        {/* Mobile Menu Toggle - Left Side */}
        <S.MobileMenuButton onClick={toggleMobileMenu}>
          <Menu size={24} />
        </S.MobileMenuButton>

        {/* Logo */}
        <S.Logo to="/">
          <S.LogoIcon>
            <Store size={28} />
          </S.LogoIcon>
          <S.LogoText>FoodHub</S.LogoText>
        </S.Logo>

        {/* Desktop Navigation */}
        <S.DesktopNav>
          {navLinks.map((link) => (
            <S.NavLink
              key={link.path}
              to={link.path}
              $isActive={isActive(link.path)}
            >
              {link.icon}
              <span>{link.label}</span>
            </S.NavLink>
          ))}
        </S.DesktopNav>

        {/* User Section */}
        <S.UserSection>
          {currentUser ? (
            <S.ProfileWrapper>
              <S.ProfileButton onClick={toggleProfileDropdown}>
                <S.Avatar>
                  {currentUser.imgUrl ? (
                    <img src={currentUser.imgUrl} alt={currentUser.username} />
                  ) : (
                    <User size={20} />
                  )}
                </S.Avatar>
                <S.UserInfo>
                  <S.UserName>{currentUser.username}</S.UserName>
                  <S.UserRole>{currentUser.role}</S.UserRole>
                </S.UserInfo>
                <ChevronDown
                  size={18}
                  style={{
                    transform: isProfileDropdownOpen
                      ? "rotate(180deg)"
                      : "rotate(0)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </S.ProfileButton>

              {isProfileDropdownOpen && (
                <S.ProfileDropdown>
                  <S.DropdownItem
                    onClick={() =>
                      toast("Profile coming soon!", { icon: "👤" })
                    }
                  >
                    <User size={18} />
                    My Profile
                  </S.DropdownItem>
                  <NavLink to={"/my-favourites"} className={"link"}>
                    <S.DropdownItem>
                      <Heart size={18} />
                      My Favourites
                    </S.DropdownItem>
                  </NavLink>
                  <S.DropdownDivider />
                  <S.DropdownItem onClick={handleLogout}>
                    <LogOut size={18} />
                    Logout
                  </S.DropdownItem>
                </S.ProfileDropdown>
              )}
            </S.ProfileWrapper>
          ) : (
            <S.LoginButton to="/login">Login</S.LoginButton>
          )}

          {/* Mobile User Avatar */}
          {currentUser && (
            <S.MobileAvatar>
              {currentUser.imgUrl ? (
                <img src={currentUser.imgUrl} alt={currentUser.username} />
              ) : (
                <User size={20} />
              )}
            </S.MobileAvatar>
          )}
        </S.UserSection>
      </S.NavbarWrapper>

      {/* Mobile Sidebar Menu */}
      <S.MobileMenu $isOpen={isMobileMenuOpen}>
        <S.MobileMenuOverlay
          onClick={closeMobileMenu}
          $isOpen={isMobileMenuOpen}
        />
        <S.MobileMenuContent $isOpen={isMobileMenuOpen}>
          <S.MobileMenuHeader>
            <S.LogoText>FoodHub</S.LogoText>
            <S.CloseButton onClick={closeMobileMenu}>
              <X size={24} />
            </S.CloseButton>
          </S.MobileMenuHeader>

          <S.MobileNavLinks>
            {navLinks.map((link) => (
              <S.MobileNavLink
                key={link.path}
                to={link.path}
                onClick={closeMobileMenu}
                $isActive={isActive(link.path)}
              >
                {link.icon}
                <span>{link.label}</span>
              </S.MobileNavLink>
            ))}
          </S.MobileNavLinks>

          {currentUser && (
            <S.MobileUserSection>
              <S.MobileUserInfo>
                <S.Avatar>
                  {currentUser.imgUrl ? (
                    <img src={currentUser.imgUrl} alt={currentUser.username} />
                  ) : (
                    <User size={20} />
                  )}
                </S.Avatar>
                <div>
                  <S.UserName>{currentUser.username}</S.UserName>
                  <S.UserRole>{currentUser.role}</S.UserRole>
                </div>
              </S.MobileUserInfo>
              <S.MobileLogoutButton onClick={handleLogout}>
                <LogOut size={18} />
                Logout
              </S.MobileLogoutButton>
            </S.MobileUserSection>
          )}
        </S.MobileMenuContent>
      </S.MobileMenu>
    </S.NavbarContainer>
  );
}

export default Navbar;
