import api from "@utils/__api__/products";
import Container from "@component/Container";
import ProductView from "./ProductView";
import Product from "@models/product.model";

interface Props {
    product: Product;
    effectiveCat?: string;
}

export default async function ProductViewWrapper({ product, effectiveCat }: Props) {
    // Fetch non-critical data in parallel using allSettled to be more resilient
    const results = await Promise.allSettled([
        api.getRelatedProducts(effectiveCat, product.parentId),
        product.model ? api.getReviews(product.pro_slug || product.slug, product.model) : Promise.resolve([])
    ]);

    const relatedProducts = results[0].status === 'fulfilled' ? results[0].value : [];
    const reviews = results[1].status === 'fulfilled' ? results[1].value : [];

    if (results.some(r => r.status === 'rejected')) {
        console.warn("Some non-critical product data failed to load:",
            results.map((r, i) => r.status === 'rejected' ? `Index ${i}` : null).filter(Boolean)
        );
    }

    // Attach reviews to product
    if (reviews) {
        product.reviews = reviews;
    }

    return (
        <Container mb="1rem" mt="10px" p="0">
            <ProductView
                product={product}
                relatedProducts={relatedProducts}
            />
        </Container>
    );
}
