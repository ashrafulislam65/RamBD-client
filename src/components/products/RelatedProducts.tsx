"use client";

import Box from "@component/Box";
import { H3 } from "@component/Typography";
import { Carousel } from "@component/carousel";
import { ProductCard1 } from "@component/product-cards";
import Product from "@models/product.model";

// ============================================================
type Props = { products: Product[] };
// ============================================================

export default function RelatedProducts({ products }: Props) {
  const responsive = [
    { breakpoint: 1024, settings: { slidesToShow: 3 } },
    { breakpoint: 650, settings: { slidesToShow: 2 } },
    { breakpoint: 426, settings: { slidesToShow: 1 } }
  ];

  return (
    <Box mb="3.75rem">
      <H3 mb="1.5rem">Related Products</H3>

      <Carousel
        slidesToShow={4}
        responsive={responsive}
        autoplay={true}
        autoplaySpeed={3000}>
        {products.map((item) => {
          // Fallback slug generation in case API/Cache returns empty
          const effectiveSlug = item.slug || (item.title ? item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : '');

          return (
            <Box pb="1rem" key={item.id} height="100%">
              <ProductCard1
                hoverEffect
                id={item.id}
                slug={effectiveSlug}
                price={item.price}
                title={item.title}
                off={item.discount}
                images={item.images}
                imgUrl={item.thumbnail}
                rating={item.rating || 4}
              />
            </Box>
          );
        })}
      </Carousel>
    </Box>
  );
}
