import { Fragment, Suspense } from "react";
import { Metadata } from "next";
import api from "@utils/__api__/products";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import Container from "@component/Container";
import ProductIntro from "@component/products/ProductIntro";
import { H3, Paragraph } from "@component/Typography";
import LatestProductsSidebar from "@component/products/LatestProductsSidebar";
import ProductViewWrapper from "@component/products/ProductViewWrapper";

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

    const plainDescription = product.pro_meta_description || (product.description
        ? product.description.replace(/<[^>]*>/g, '').slice(0, 160) + "..."
        : `Buy ${product.title} at the best price from Felna Tech.`);

    const metaTitle = product.meta_title || `${product.title} | Felna Tech`;
    const metaKeywords = product.pro_meta_key || "";

    // Use the direct CDN image URL for OG — Facebook crawler doesn't follow redirects
    const storageBaseUrl = process.env.NEXT_PUBLIC_STORAGE_BASE_URL || "https://admin.unicodeconverter.info/storage/app/public/products";
    const ogImages = (product.images && product.images.length > 0)
        ? product.images.slice(0, 3).map((imgUrl: string) => {
            // If already full URL, use directly; if just filename, prepend base
            const fullUrl = imgUrl.startsWith("http") ? imgUrl : `${storageBaseUrl}/${imgUrl}`;
            return { url: fullUrl, width: 1200, height: 630, type: "image/png" };
        })
        : [{ url: `${process.env.NEXT_PUBLIC_APP_URL || "https://felna-tech.com"}/assets/images/rambd_logo.webp`, width: 400, height: 400 }];

    return {
        title: metaTitle,
        description: plainDescription,
        keywords: metaKeywords,
        openGraph: {
            title: product.title,
            description: plainDescription,
            images: ogImages,
            type: "website",
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

    const effectiveCat = cat || (product.categories && product.categories.length > 0 ? product.categories[0] : undefined);

    return (
        <Fragment>
            <Container mb="1rem" mt="10px" p="0">
                <Box overflow="hidden" p="0">
                    <FlexBox flexWrap="wrap" alignItems="stretch" style={{ gap: 2 }}>
                        <Box flex="1 1 0" minWidth={300}>
                            <ProductIntro
                                id={product.id}
                                slug={slug}
                                price={product.price}
                                regularPrice={product.regularPrice}
                                title={product.title}
                                images={product.images || []}
                                brand={product.brand}
                                status={product.status}
                                model={product.model}
                                product_code={product.product_code}
                                categoryName={product.categoryName}
                                category_slug={product.category_slug}
                                visitors={product.visitors}
                                discount={product.discount}
                            />
                        </Box>

                        <Suspense fallback={<Box width="160px" bg="white" p="8px" borderRadius={8} height="100%" shadow={1} />}>
                            <LatestProductsSidebar />
                        </Suspense>
                    </FlexBox>
                </Box>
            </Container>

            <Suspense fallback={<Container><Box p="2rem" textAlign="center">Loading details...</Box></Container>}>
                <ProductViewWrapper product={product} effectiveCat={effectiveCat} />
            </Suspense>
        </Fragment>
    );
}
