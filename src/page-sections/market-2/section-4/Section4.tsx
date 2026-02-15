"use client";

import Box from "@component/Box";
import Grid from "@component/grid/Grid";
import FlexBox from "@component/FlexBox";
import NavLink from "@component/nav-link";
import { H2 } from "@component/Typography";
import Container from "@component/Container";
import ProductCard19 from "@component/product-cards/ProductCard19";
import Product from "@models/product.model";

// =========================================================
type Props = { products: Product[] };
// =========================================================

export default function Section4({ products }: Props) {
  console.log("Deals Of The Day (Section 4) products received from API:", products?.length);
  return (
    <Container pt="0px">
      <FlexBox alignItems="center" justifyContent="space-between" mb="5px">
        <H2 fontSize={20}>Deals Of The Day</H2>
        <NavLink href="#">More Products</NavLink>
      </FlexBox>

      <Grid container spacing={1}>
        {products.slice(0, 5).map((product) => (
          <Grid item xl={2.4} lg={2.4} md={3} sm={4} xs={6} key={product.id}>
            <Box py="5px">
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
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
