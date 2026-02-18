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
    }>;
};
// ==============================================================

export default async function CategoryProductPage({ params, searchParams }: Props) {
    const { slug } = await params;
    const sParams = await searchParams;
    const pageNumber = sParams.page ? Number(sParams.page) : 1;
    const { sort, min_price, max_price, in_stock, on_sale, featured } = sParams;

    // Fetch products based on filters
    const { products, totalPages, totalProducts } = await categoryProductApi.getProductsByCategory(
        slug,
        min_price,
        max_price,
        pageNumber,
        sort
    );

    // Fetch real categories for sidebar
    const categories = await market2Api.getCategories();

    return (
        <Box pt="0px">
            <CategorySearchResult
                sortOptions={sortOptions}
                products={products}
                categoryName={slug}
                totalPages={totalPages}
                totalProducts={totalProducts}
                currentPage={pageNumber}
                minPriceDefault={0}
                maxPriceDefault={20000}
                categories={categories}
            />
        </Box>
    );
}

const sortOptions = [
    { label: "Price Low to High", value: "price-asc" },
    { label: "Price High to Low", value: "price-desc" }
];
