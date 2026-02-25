import styled from "styled-components";
// GLOBAL CUSTOM COMPONENTS
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import NextImage from "@component/NextImage";
import Typography from "@component/Typography";

// STYLED COMPONENT
const StyledImage = styled(NextImage)`
  border-radius: 5px;
  object-fit: cover;
`;

// ==============================================================
interface Props {
  icon?: string;
  title: string;
  imgUrl?: string;
}
// ==============================================================

export default function MobileCategoryImageBox({ icon, title, imgUrl }: Props) {
  const isHtmlIcon = icon?.startsWith("<i");

  return (
    <FlexBox flexDirection="column" alignItems="center" justifyContent="center">
      {imgUrl ? (
        <StyledImage src={imgUrl} width={69} height={60} alt={title} />
      ) : isHtmlIcon ? (
        <div
          style={{ fontSize: "32px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", color: "#4B566B" }}
          dangerouslySetInnerHTML={{ __html: icon }}
        />
      ) : (
        icon && <Icon size="48px">{icon}</Icon>
      )}

      <Typography
        className="ellipsis"
        textAlign="center"
        fontSize="11px"
        lineHeight="1"
        mt="0.5rem">
        {title || "Category"}
      </Typography>
    </FlexBox>
  );
}
