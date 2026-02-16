import FlexBox from "@component/FlexBox";
import Grid from "@component/grid/Grid";
import Pagination from "@component/pagination";
import { ProductCard19 } from "@component/product-cards";
import { SemiSpan } from "@component/Typography";
import Product from "@models/product.model";

// ==========================================================
type Props = { products: Product[]; categorySlug?: string };
// ==========================================================

export default function ProductCard19List({ products, categorySlug }: Props) {
    return (
        <div>
            <Grid container spacing={1}>
                {products.map((item) => (
                    <Grid item lg={3} sm={6} xs={12} key={item.id}>
                        <ProductCard19
                            id={item.id}
                            slug={item.slug}
                            price={item.price}
                            name={item.title}
                            img={item.thumbnail}
                            images={item.images as string[]}
                            reviews={item.rating || 5}
                            categorySlug={categorySlug}
                        />
                    </Grid>
                ))}
            </Grid>

            <FlexBox flexWrap="wrap" justifyContent="space-between" alignItems="center" mt="32px">
                <SemiSpan>Showing 1-{products.length} of {products.length} Products</SemiSpan>
                <Pagination pageCount={1} />
            </FlexBox>
        </div>
    );
}
