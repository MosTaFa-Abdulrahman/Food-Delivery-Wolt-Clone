import * as S from "./footer.styles";
import {
  Store,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Heart,
} from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { path: "/admin/orders", label: "Orders" },
    { path: "/admin/products", label: "Products" },
    { path: "/admin/restaurants", label: "Restaurants" },
    { path: "/admin/users", label: "Users" },
  ];

  const supportLinks = [
    { label: "Help Center", action: () => {} },
    { label: "Privacy Policy", action: () => {} },
    { label: "Terms of Service", action: () => {} },
    { label: "Contact Us", action: () => {} },
  ];

  const socialLinks = [
    { icon: <Facebook size={20} />, url: "#", label: "Facebook" },
    { icon: <Twitter size={20} />, url: "#", label: "Twitter" },
    { icon: <Instagram size={20} />, url: "#", label: "Instagram" },
    { icon: <Linkedin size={20} />, url: "#", label: "LinkedIn" },
  ];

  return (
    <S.FooterContainer>
      <S.FooterWrapper>
        {/* Main Footer Content */}
        <S.FooterContent>
          {/* About Section */}
          <S.FooterSection>
            <S.FooterLogo>
              <S.LogoIcon>
                <Store size={32} />
              </S.LogoIcon>
              <S.LogoText>FoodHub</S.LogoText>
            </S.FooterLogo>
            <S.FooterDescription>
              Your trusted platform for managing restaurants, orders, and
              deliveries. Bringing food businesses and customers together.
            </S.FooterDescription>
            <S.SocialLinks>
              {socialLinks.map((social, index) => (
                <S.SocialLink
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  {social.icon}
                </S.SocialLink>
              ))}
            </S.SocialLinks>
          </S.FooterSection>

          {/* Quick Links */}
          <S.FooterSection>
            <S.FooterTitle>Quick Links</S.FooterTitle>
            <S.FooterLinks>
              {quickLinks.map((link) => (
                <S.FooterLink key={link.path} to={link.path}>
                  {link.label}
                </S.FooterLink>
              ))}
            </S.FooterLinks>
          </S.FooterSection>

          {/* Support */}
          <S.FooterSection>
            <S.FooterTitle>Support</S.FooterTitle>
            <S.FooterLinks>
              {supportLinks.map((link, index) => (
                <S.FooterLinkButton key={index} onClick={link.action}>
                  {link.label}
                </S.FooterLinkButton>
              ))}
            </S.FooterLinks>
          </S.FooterSection>

          {/* Contact Info */}
          <S.FooterSection>
            <S.FooterTitle>Contact Us</S.FooterTitle>
            <S.ContactInfo>
              <S.ContactItem>
                <Mail size={18} />
                <span>mostafa.abdulrahman1880@gmail.com</span>
              </S.ContactItem>
              <S.ContactItem>
                <Phone size={18} />
                <span>+20 1098893166</span>
              </S.ContactItem>
              <S.ContactItem>
                <MapPin size={18} />
                <span>Cairo, Egypt</span>
              </S.ContactItem>
            </S.ContactInfo>
          </S.FooterSection>
        </S.FooterContent>

        {/* Footer Bottom */}
        <S.FooterBottom>
          <S.Copyright>
            © {currentYear} FoodHub. All rights reserved.
          </S.Copyright>
          <S.MadeWith>
            Made with <Heart size={16} fill="#667eea" color="#667eea" /> by
            MosTaFa Abdulrahman
          </S.MadeWith>
        </S.FooterBottom>
      </S.FooterWrapper>
    </S.FooterContainer>
  );
}

export default Footer;
