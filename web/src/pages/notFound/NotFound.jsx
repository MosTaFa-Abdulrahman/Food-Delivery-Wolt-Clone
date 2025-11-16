import * as S from "./notFound.styles";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <S.Wrapper>
      <S.Card>
        <S.IconWrapper>
          <SearchX size={70} />
        </S.IconWrapper>

        <S.Title>Page Not Found</S.Title>
        <S.Desc>
          The page you are looking for doesn’t exist or has been moved.
        </S.Desc>

        <S.HomeBtn to={"/"} className={"link"}>
          Go Back Home
        </S.HomeBtn>
      </S.Card>
    </S.Wrapper>
  );
}
