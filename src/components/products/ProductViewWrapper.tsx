import api from "@utils/__api__/products";
import Container from "@component/Container";
import ProductView from "./ProductView";
import Product from "@models/product.model";

interface Props {
    product: Product;
    effectiveCat?: string;
}

export default async function ProductViewWrapper({ product, effectiveCat }: Props) {
    // Fetch non-critical data in parallel
    const [shops, relatedProducts, frequentlyBought, reviews] = await Promise.all([
        api.getAvailableShop(),
        api.getRelatedProducts(effectiveCat),
        api.getFrequentlyBought(),
        product.model ? api.getReviews(product.slug, product.model) : Promise.resolve([])
    ]);

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
