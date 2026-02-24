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
    // Handle specific keyword discrepancies (e.g., "trypod" vs "tripod")
    let searchKeyword = slug.toLowerCase().trim();
    if (searchKeyword === 'trypod') {
      searchKeyword = 'tripod';
    }

    const url = `https://admin.unicodeconverter.info/products/searchpro?search=${searchKeyword}`;

    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json"
      }
    });

    if (!res.ok) return [];

    const json = await res.json();
    const productData = json.products?.data || (Array.isArray(json.products) ? json.products : []);

    return productData.map(transformApiProduct).filter((p: any) => p !== null);
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
}

export default async function ProductSearchResult({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
  const params = await paramsPromise;
  const decodedSlug = decodeURIComponent(params?.slug || '');

  const [products, brands, categories] = await Promise.all([
    getProducts(decodedSlug),
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
  { label: "Default", value: "relevance" },
  { label: "Price Low to High", value: "price-asc" },
  { label: "Price High to Low", value: "price-desc" }
];

