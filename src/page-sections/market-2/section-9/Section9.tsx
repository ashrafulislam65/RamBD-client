"use client";

import Link from "next/link";
import Box from "@component/Box";
import Image from "@component/Image";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import { H2, Span } from "@component/Typography";
import Container from "@component/Container";
import { Carousel } from "@component/carousel";
import Brand from "@models/Brand.model";

// ==========================================================
type Props = { brands: Brand[] };
// ==========================================================

export default function Section9({ brands }: Props) {
  const responsive = [
    { breakpoint: 1200, settings: { slidesToShow: 4 } },
    { breakpoint: 1024, settings: { slidesToShow: 3 } },
    { breakpoint: 650, settings: { slidesToShow: 2 } },
    { breakpoint: 426, settings: { slidesToShow: 1 } }
  ];

  return (
    <Container my="4rem">
      <FlexBox justifyContent="space-between" alignItems="center" mb="1.5rem">
        <H2 fontSize={20}>Featured Brands</H2>

        <Link href="/brands">
          <FlexBox alignItems="center" color="success.main" style={{ gap: 4, cursor: "pointer" }}>
            <Span fontWeight="600" fontSize={13}>See All Brands</Span>
            <Icon size="12px">right-arrow</Icon>
          </FlexBox>
        </Link>
      </FlexBox>

      <Box padding="2rem" bg="white">
        <Carousel autoplay arrows={false} slidesToShow={5} responsive={responsive}>
          {brands.map((item) => (
            <FlexBox
              key={item.id}
              height="100%"
              margin="auto"
              maxWidth={110}
              alignItems="center"
              justifyContent="center">
              <Image src={item.image} alt="brand" width="100%" />
            </FlexBox>
          ))}
        </Carousel>
      </Box>
    </Container>
  );
}
