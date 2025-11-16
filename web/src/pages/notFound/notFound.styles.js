import styled from "styled-components";
import { NavLink } from "react-router-dom";

const mainBlue = "#009DE0"; // Wolt-style main blue
const lightGray = "#f5f7fa";
const darkText = "#1f2d3d";

export const Wrapper = styled.div`
  min-height: 100vh;
  background: ${lightGray};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

export const Card = styled.div`
  background: #ffffff;
  padding: 40px 30px;
  border-radius: 16px;
  text-align: center;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.12);

  @media (max-width: 480px) {
    padding: 30px 20px;
  }
`;

export const IconWrapper = styled.div`
  color: ${mainBlue};
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

export const Title = styled.h1`
  font-size: 1.9rem;
  font-weight: 700;
  color: ${darkText};
  margin-bottom: 10px;

  @media (max-width: 480px) {
    font-size: 1.6rem;
  }
`;

export const Desc = styled.p`
  font-size: 1rem;
  color: #5a6b7b;
  line-height: 1.5;
  margin-bottom: 25px;
`;

export const HomeBtn = styled(NavLink)`
  background: ${mainBlue};
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 12px 22px;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.25s ease;

  &:hover {
    background: #028ac8;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;
