"use client";

import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import NavLink from "@component/nav-link";
import { H2 } from "@component/Typography";
import Container from "@component/Container";
import { Carousel } from "@component/carousel";
import ProductCard19 from "@component/product-cards/ProductCard19";
import Product from "@models/product.model";

// =========================================================
type Props = { products: Product[] };
// =========================================================

export default function Section4({ products }: Props) {
  const responsive = [
    { breakpoint: 1200, settings: { slidesToShow: 5 } },
    { breakpoint: 1024, settings: { slidesToShow: 4 } },
    { breakpoint: 650, settings: { slidesToShow: 3 } },
    { breakpoint: 426, settings: { slidesToShow: 2 } }
  ];

  return (
    <Container pt="4rem">
      <FlexBox alignItems="center" justifyContent="space-between" mb="1.5rem">
        <H2 fontSize={20}>Deals Of The Day</H2>
        <NavLink href="#">More Products</NavLink>
      </FlexBox>

      <Carousel slidesToShow={5} responsive={responsive}>
        {products.map((product) => (
          <Box py="1rem" key={product.id}>
            <ProductCard19
              id={product.id}
              slug={product.slug}
              name={product.title}
              price={product.price}
              img={product.thumbnail}
              images={product.images as string[]}
              reviews={product.reviews?.length || 11}
            />
          </Box>
        ))}
      </Carousel>
    </Container>
  );
}
