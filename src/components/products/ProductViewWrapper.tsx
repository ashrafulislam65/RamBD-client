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
        api.getAvailableShop(),
        api.getRelatedProducts(effectiveCat),
        api.getFrequentlyBought(),
        product.model ? api.getReviews(product.slug, product.model) : Promise.resolve([])
    ]);

    const shops = results[0].status === 'fulfilled' ? results[0].value : [];
    const relatedProducts = results[1].status === 'fulfilled' ? results[1].value : [];
    const frequentlyBought = results[2].status === 'fulfilled' ? results[2].value : [];
    const reviews = results[3].status === 'fulfilled' ? results[3].value : [];

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
        <Container>
            <ProductView
                product={product}
                shops={shops}
                relatedProducts={relatedProducts}
                frequentlyBought={frequentlyBought}
            />
        </Container>
    );
}
