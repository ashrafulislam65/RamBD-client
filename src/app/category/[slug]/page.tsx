import { Metadata } from "next";
import Box from "@component/Box";
import CategorySearchResult from "./CategorySearchResult";
import categoryProductApi from "@utils/__api__/category-products";

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
    searchParams: Promise<{ min_price?: string; max_price?: string }>;
};
// ==============================================================

export default async function CategoryProductPage({ params, searchParams }: Props) {
    const { slug } = await params;
    const { min_price, max_price } = await searchParams;
    const products = await categoryProductApi.getProductsByCategory(slug, min_price, max_price);

    return (
        <Box pt="0px">
            <CategorySearchResult
                sortOptions={sortOptions}
                products={products}
                categoryName={slug}
            />
        </Box>
    );
}

const sortOptions = [
    { label: "Relevance", value: "Relevance" },
    { label: "Date", value: "Date" },
    { label: "Price Low to High", value: "Price Low to High" },
    { label: "Price High to Low", value: "Price High to Low" }
];
