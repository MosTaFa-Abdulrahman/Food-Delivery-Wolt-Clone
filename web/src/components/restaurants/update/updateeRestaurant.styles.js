import styled from "styled-components";

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  max-height: 70vh;
  overflow-y: auto;

  /* Custom Scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #667eea;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #5568d3;
  }
`;

export const ImageUploadSection = styled.div`
  margin-bottom: 8px;
`;

export const ImageUploadWrapper = styled.div`
  margin-top: 8px;
`;

export const UploadPlaceholder = styled.div`
  border: 2px dashed #d0d0d0;
  border-radius: 12px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafafa;
  color: #667eea;

  &:hover {
    border-color: #667eea;
    background: #f0f4ff;
  }

  svg {
    color: #667eea;
  }

  span {
    font-size: 16px;
    font-weight: 500;
    color: #555;
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

export const UploadHint = styled.p`
  font-size: 13px;
  color: #999;
  margin: 0;
`;

export const ImagePreview = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #e0e0e0;
`;

export const PreviewImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
`;

export const ChangeImageButton = styled.button`
  position: absolute;
  bottom: 12px;
  right: 12px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.95);
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #667eea;
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  grid-column: ${(props) => (props.$fullWidth ? "1 / -1" : "auto")};
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

export const Required = styled.span`
  color: #e53e3e;
  margin-left: 4px;
`;

export const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid ${(props) => (props.$hasError ? "#e53e3e" : "#e0e0e0")};
  border-radius: 8px;
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

  /* Remove spinner for number inputs */
  &[type="number"]::-webkit-inner-spin-button,
  &[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  font-family: inherit;
  transition: all 0.2s ease;
  resize: vertical;
  background: white;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #aaa;
  }
`;

export const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #667eea;
`;

export const CheckboxLabel = styled.label`
  font-size: 15px;
  color: #555;
  cursor: pointer;
  user-select: none;
`;

export const ErrorText = styled.span`
  font-size: 13px;
  color: #e53e3e;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const HintText = styled.span`
  font-size: 12px;
  color: #999;
  margin-top: 2px;
  font-style: italic;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
  margin-top: 8px;
`;

export const CancelButton = styled.button`
  padding: 12px 24px;
  background: #f5f5f5;
  color: #555;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e8e8e8;
    border-color: #d0d0d0;
  }
`;

export const SubmitButton = styled.button`
  padding: 12px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background: #5568d3;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
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
