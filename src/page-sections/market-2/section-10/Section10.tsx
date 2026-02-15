"use client";

import { useState } from "react";
import Box from "@component/Box";
import Grid from "@component/grid/Grid";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import Container from "@component/Container";
import { H2, Paragraph } from "@component/Typography";
import { ProductCard19 } from "@component/product-cards";
import Product from "@models/product.model";
// STYLED COMPONENT
import { ButtonsWrapper } from "./styles";

// ======================================================================
type Section10Props = { products: Product[] };
// ======================================================================

export default function Section10({ products }: Section10Props) {
  console.log("Most Popular Products (Section 10) products received from API:", products?.length);
  const [selected, setSelected] = useState("new");

  const handleSelected = (item: string) => () => setSelected(item);
  const activeColor = (item: string) => (item === selected ? "error" : "dark");

  const buttons = [
    { id: 1, title: "New Arrivals", type: "new" },
    { id: 2, title: "Best Seller", type: "best" },
    { id: 3, title: "Most Popular", type: "popular" },
    { id: 4, title: "View All", type: "view" }
  ];

  return (
    <Container mb="0px">
      <FlexBox alignItems="center" justifyContent="space-between" flexWrap="wrap" mb="5px">
        <div>
          <H2 fontSize={20}>Most Popular Products</H2>
          <Paragraph>All our new arrivals in a exclusive brand selection</Paragraph>
        </div>

        <ButtonsWrapper>
          {buttons.map(({ id, title, type }) => (
            <Button
              key={id}
              variant="outlined"
              color={activeColor(type)}
              onClick={handleSelected(type)}>
              {title}
            </Button>
          ))}
        </ButtonsWrapper>
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
                reviews={product.reviews?.length || 15}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
