import Box from "@component/Box";
import api from "@utils/__api__/market-2";
import SearchResult from "../product/search/[slug]/SearchResult";

export const dynamic = 'force-dynamic';

export default async function LatestProductsPage() {
    const products = await api.getLatestProducts();

    return (
        <Box pt="20px">
            <SearchResult title="Our Latest Product" sortOptions={sortOptions} products={products} />
        </Box>
    );
}

const sortOptions = [
    { label: "Relevance", value: "relevance" },
    { label: "Date", value: "date" },
    { label: "Price Low to High", value: "price-asc" },
    { label: "Price High to Low", value: "price-desc" }
];
