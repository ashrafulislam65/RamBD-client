import { Metadata } from "next";
import Box from "@component/Box";
import CategorySearchResult from "./CategorySearchResult";
import categoryProductApi from "@utils/__api__/category-products";
import market2Api from "@utils/__api__/market-2";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const categoryName = slug.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

    return {
        title: `${categoryName} | Felna Tech`,
        description: `Browse the best collection of ${categoryName} at Felna Tech. Best prices and fastest delivery.`
    };
}

// ==============================================================
type Props = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{
        min_price?: string;
        max_price?: string;
        page?: string;
        sort?: string;
        in_stock?: string;
        on_sale?: string;
        featured?: string;
        brand_id?: string;
    }>;
};
// ==============================================================

export default async function CategoryProductPage({ params, searchParams }: Props) {
    const { slug } = await params;
    const sParams = await searchParams;
    const pageNumber = sParams.page ? Number(sParams.page) : 1;
    const { sort, min_price, max_price, in_stock, on_sale, featured, brand_id: brandIds } = sParams;

    // Fetch products based on filters
    const { products, totalPages, totalProducts } = await categoryProductApi.getProductsByCategory(
        slug,
        min_price,
        max_price,
        pageNumber,
        sort,
        brandIds
    );

    // Fetch real categories and brands for sidebar
    const [categories, allBrands] = await Promise.all([
        market2Api.getCategories(),
        market2Api.getBrands()
    ]);

    // Calculate min/max price from products if not provided
    const productPrices = products.map(p => p.price).filter(p => p > 0);
    const minPriceDynamic = productPrices.length > 0 ? Math.min(...productPrices) : 0;
    const maxPriceDynamic = productPrices.length > 0 ? Math.max(...productPrices) : 20000;

    return (
        <Box pt="0px">
            <CategorySearchResult
                sortOptions={sortOptions}
                products={products}
                categoryName={slug}
                totalPages={totalPages}
                totalProducts={totalProducts}
                currentPage={pageNumber}
                minPriceDefault={minPriceDynamic}
                maxPriceDefault={maxPriceDynamic}
                categories={categories}
                brands={allBrands}
            />
        </Box>
    );
}

const sortOptions = [
    { label: "Default", value: "relevance" },
    { label: "Date", value: "date" },
    { label: "Price Low to High", value: "price-asc" },
    { label: "Price High to Low", value: "price-desc" }
];
