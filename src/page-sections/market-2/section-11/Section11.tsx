"use client";

import Box from "@component/Box";
import Grid from "@component/grid/Grid";
import FlexBox from "@component/FlexBox";
import NavLink from "@component/nav-link";
import { H2 } from "@component/Typography";
import Container from "@component/Container";
import { ProductCard19 } from "@component/product-cards";
import Product from "@models/product.model";

// =========================================================
type Props = { products: Product[] };
// =========================================================

export default function Section11({ products }: Props) {
    console.log("Our Latest Product (Section 11) products received from API:", products?.length);
    return (
        <Container pt="0px" id="latest-products">
            <FlexBox alignItems="center" justifyContent="space-between" mb="5px">
                <H2 fontSize={20}>Our Latest Product</H2>
                <NavLink href="#">View All</NavLink>
            </FlexBox>

            <Grid container spacing={1}>
                {products?.slice(0, 15).map((product) => (
                    <Grid item xl={2.4} lg={2.4} md={3} sm={4} xs={6} key={product.id}>
                        <Box py="5px">
                            <ProductCard19
                                id={product.id}
                                slug={product.slug}
                                name={product.title}
                                price={product.price}
                                img={product.thumbnail}
                                images={product.images as string[]}
                                reviews={product.reviews?.length || 10}
                            />
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
