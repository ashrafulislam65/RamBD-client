import { Fragment } from "react";
import { Metadata } from "next";
import api from "@utils/__api__/products";
import market2Api from "@utils/__api__/market-2";
import Box from "@component/Box";
import Container from "@component/Container";
import ProductIntro from "@component/products/ProductIntro";
import ProductView from "@component/products/ProductView";
import Section11 from "@sections/market-2/section-11";
import { H3, Paragraph } from "@component/Typography";

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { cat } = await searchParams;
  const product = await api.getProduct(slug, cat);

  if (!product) {
    return {
      title: "Product Not Found | Felna Tech",
      description: "The product you are looking for does not exist."
    };
  }

  // Remove HTML tags from description for meta tag
  const plainDescription = product.description
    ? product.description.replace(/<[^>]*>/g, '').slice(0, 160) + "..."
    : `Buy ${product.title} at the best price from Felna Tech.`;

  return {
    title: `${product.title} | Felna Tech`,
    description: plainDescription,
    openGraph: {
      title: product.title,
      description: plainDescription,
      images: product.images && product.images.length > 0 ? [product.images[0]] : [],
    },
  };
}

// ==============================================================
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ cat?: string }>;
};
// ==============================================================

export default async function ProductDetails({ params, searchParams }: Props) {
  const { slug } = await params;
  const { cat } = await searchParams;

  const product = await api.getProduct(slug, cat);

  if (!product) {
    return (
      <Container mb="2rem" mt="2rem">
        <Box textAlign="center" py="5rem">
          <H3>Product Not Found</H3>
          <Paragraph>The product you are looking for might have been moved or deleted.</Paragraph>
        </Box>
      </Container>
    );
  }

  // Use product's internal category if 'cat' query param is missing
  const effectiveCat = cat || (product.categories && product.categories.length > 0 ? product.categories[0] : undefined);

  const shops = await api.getAvailableShop();
  const relatedProducts = await api.getRelatedProducts(effectiveCat);
  const frequentlyBought = await api.getFrequentlyBought();
  const reviews = product.model ? await api.getReviews(slug, product.model) : [];
  const latestProducts = await market2Api.getProducts();

  // Attach reviews if found
  if (reviews) {
    product.reviews = reviews;
  }

  return (
    <Fragment>
      <Container mb="2rem" mt="0px">
        <ProductIntro
          id={product.id}
          price={product.price}
          regularPrice={product.regularPrice}
          title={product.title}
          images={product.images || []}
          brand={product.brand}
          status={product.status}
          model={product.model}
          product_code={product.product_code}
          categoryName={product.categoryName}
          visitors={product.visitors}
          discount={product.discount}
          latestProducts={latestProducts}
        />
      </Container>

      <Container>
        <ProductView
          product={product}
          shops={shops}
          relatedProducts={relatedProducts}
          frequentlyBought={frequentlyBought}
        />
      </Container>
    </Fragment>
  );
}
