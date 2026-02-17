import Box from "@component/Box";
import api from "@utils/__api__/market-2";
import SearchResult from "../product/search/[slug]/SearchResult";

export const dynamic = 'force-dynamic';

export default async function MostPopularProductsPage() {
    const products = await api.getMostPopularProducts();

    return (
        <Box pt="20px">
            <SearchResult title="Most Popular Products" sortOptions={sortOptions} products={products} />
        </Box>
    );
}

const sortOptions = [
    { label: "Relevance", value: "Relevance" },
    { label: "Date", value: "Date" },
    { label: "Price Low to High", value: "Price Low to High" },
    { label: "Price High to Low", value: "Price High to Low" }
];
