import * as S from "./modal.styles";
import { X } from "lucide-react";

export default function Modal({ title, children, onClose }) {
  return (
    <S.Overlay onClick={onClose}>
      <S.ModalBox onClick={(e) => e.stopPropagation()}>
        <S.Header>
          <S.Title>{title}</S.Title>

          <S.CloseBtn onClick={onClose}>
            <X size={22} />
          </S.CloseBtn>
        </S.Header>

        <S.Content>{children}</S.Content>
      </S.ModalBox>
    </S.Overlay>
  );
}
