
import Box from "@component/Box";
import SearchResult from "./SearchResult";
import api from "@utils/__api__/market-2";

interface Product {
  id: string;
  slug: string;
  title: string;
  price: number;
  discount: number;
  thumbnail: string;
  images: string[];
  rating: number;
  categories: any[];
  status?: string;
}

import { transformApiProduct } from "@utils/productTransformer";

async function getProducts(slug: string): Promise<any[]> {
  try {
    const res = await fetch(`https://admin.unicodeconverter.info/products/searchpro?search=${slug}`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    const json = await res.json();

    // Check if products exists and has data array
    const productData = json.products?.data || [];
    return productData.map(transformApiProduct).filter((p: any) => p !== null);
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
}

export default async function ProductSearchResult({ params }: { params: { slug: string } }) {
  const [products, brands, categories] = await Promise.all([
    getProducts(params.slug),
    api.getBrands(),
    api.getCategories()
  ]);

  return (
    <Box pt="20px">
      <SearchResult
        title="Searching for products"
        sortOptions={sortOptions}
        products={products}
        brands={brands}
        categories={categories}
      />
    </Box>
  );
}

const sortOptions = [
  { label: "Relevance", value: "relevance" },
  { label: "Date", value: "date" },
  { label: "Price Low to High", value: "price-asc" },
  { label: "Price High to Low", value: "price-desc" }
];

