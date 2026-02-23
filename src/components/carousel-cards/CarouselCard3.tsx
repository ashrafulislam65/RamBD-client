import Image from "next/image";
import styled from "styled-components";
// GLOBAL CUSTOM COMPONENTS
import { Button } from "@component/buttons";
import { H1, H4, Paragraph, Span } from "@component/Typography";
// UTILS
import { deviceSize } from "@utils/constants";

// STYLED COMPONENTS
const CarouselCard = styled("div")({
  minHeight: 500,
  display: "flex",
  alignItems: "center",
  backgroundColor: "#fff",
  position: "relative",
  overflow: "hidden",

  [`@media(max-width: ${deviceSize.sm}px)`]: {
    padding: 24,
    textAlign: "center",
    justifyContent: "center",
    "& button": { margin: "auto" }
  },

  [`@media(min-width: ${deviceSize.sm}px)`]: {
    "& .hero-content": { paddingLeft: "5rem" }
  }
});

// =============================================================
interface Props {
  img: string;
  title: string;
  category: string;
  discount: number;
  buttonText: string;
  description: string;
  priority?: boolean;
}
// =============================================================

export default function CarouselCard3(props: Props) {
  const { img, title, category, discount, description, buttonText, priority } = props;

  return (
    <CarouselCard>
      <Image
        src={img}
        fill
        priority={priority}
        alt={category || title || "Hero Image"}
        style={{ objectFit: "cover", zIndex: 0 }}
      />

      <div className="hero-content" style={{ position: "relative", zIndex: 1 }}>
        {title && (
          <H4 mb={1} fontSize={30} lineHeight={1} fontWeight={400} textTransform="uppercase">
            {title}
          </H4>
        )}

        {category && (
          <H1 fontSize={60} lineHeight={1} textTransform="uppercase">
            {category}
          </H1>
        )}

        {discount > 0 && (
          <H4 fontSize={30} lineHeight={1} mt=".75rem" textTransform="uppercase">
            SALE UP TO <Span color="primary.main">{discount}% OFF</Span>
          </H4>
        )}

        {description && (
          <Paragraph fontSize={18} mb="2rem">
            {description}
          </Paragraph>
        )}

        {buttonText && (
          <Button variant="contained" color="primary" aria-label={buttonText}>
            {buttonText}
          </Button>
        )}
      </div>
    </CarouselCard>
  );
}
