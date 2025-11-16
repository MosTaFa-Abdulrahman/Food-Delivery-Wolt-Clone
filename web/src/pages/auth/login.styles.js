import styled from "styled-components";

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;

  /* Animated Background Elements */
  &::before {
    content: "";
    position: absolute;
    width: 500px;
    height: 500px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    top: -250px;
    right: -250px;
    animation: float 6s ease-in-out infinite;
  }

  &::after {
    content: "";
    position: absolute;
    width: 300px;
    height: 300px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    bottom: -150px;
    left: -150px;
    animation: float 8s ease-in-out infinite reverse;
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }
`;

export const LoginBox = styled.div`
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 450px;
  padding: 48px 40px;
  position: relative;
  z-index: 1;
  animation: slideIn 0.5s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 480px) {
    padding: 40px 24px;
  }
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

export const Logo = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
  animation: pulse 2s ease-in-out infinite;

  svg {
    color: white;
  }

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
`;

export const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px 0;
`;

export const Subtitle = styled.p`
  font-size: 15px;
  color: #777;
  margin: 0;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const InputIcon = styled.div`
  position: absolute;
  left: 16px;
  color: #999;
  display: flex;
  align-items: center;
  pointer-events: none;
`;

export const Input = styled.input`
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 2px solid ${(props) => (props.$hasError ? "#e53e3e" : "#e0e0e0")};
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.2s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: ${(props) => (props.$hasError ? "#e53e3e" : "#667eea")};
    box-shadow: 0 0 0 3px
      ${(props) =>
        props.$hasError
          ? "rgba(229, 62, 62, 0.1)"
          : "rgba(102, 126, 234, 0.1)"};
  }

  &::placeholder {
    color: #aaa;
  }
`;

export const PasswordInput = styled(Input)`
  padding-right: 48px;
`;

export const PasswordToggle = styled.button`
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  color: #667eea;
  display: flex;
  align-items: center;
  padding: 0;
  transition: all 0.2s ease;

  &:hover {
    color: #5568d3;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const ErrorText = styled.span`
  font-size: 13px;
  color: #e53e3e;
  display: flex;
  align-items: center;
  gap: 4px;
  animation: shake 0.3s ease;

  @keyframes shake {
    0%,
    100% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-5px);
    }
    75% {
      transform: translateX(5px);
    }
  }
`;

export const ForgotPassword = styled.a`
  font-size: 14px;
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  align-self: flex-end;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    color: #5568d3;
    text-decoration: underline;
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
  margin-top: 8px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 24px 0;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #e0e0e0;
  }

  span {
    font-size: 14px;
    color: #999;
    font-weight: 500;
  }
`;

export const SignupLink = styled.div`
  text-align: center;
  font-size: 15px;
  color: #666;

  a {
    color: #667eea;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s ease;

    &:hover {
      color: #5568d3;
      text-decoration: underline;
    }
  }
`;

export const ServerError = styled.div`
  padding: 12px 16px;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  color: #c33;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: slideDown 0.3s ease;

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
