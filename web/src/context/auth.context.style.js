import styled, { keyframes } from "styled-components";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 100px 20px;

  svg {
    color: #f093fb;
    animation: ${spin} 1s linear infinite;
  }

  p {
    color: #64748b;
    font-size: 18px;
    font-weight: 600;
  }
`;
