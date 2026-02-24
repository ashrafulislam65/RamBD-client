import Box from "@component/Box";
import SearchResult from "./SearchResult";
import api from "@utils/__api__/market-2";
import { Metadata } from "next";

export async function generateMetadata({ params: paramsPromise }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await paramsPromise;
  const slug = decodeURIComponent(params?.slug || '');

  try {
    const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.unicodeconverter.info").trim();
    const response = await fetch(`${apiBaseUrl}/home-menu`, { next: { revalidate: 3600 } });

    if (response.ok) {
      const data = await response.json();
      const categories = data.category || [];
      const category = categories.find((c: any) => c.cate_slug === slug);

      if (category) {
        return {
          title: category.meta_title || `${category.cate_name} | Felna Tech`,
          description: category.meta_description || category.cate_desc?.replace(/<[^>]*>/g, '').slice(0, 160) || `Buy ${category.cate_name} at Felna Tech`,
          keywords: category.cat_meta_keys || ""
        };
      }
    }
  } catch (error) {
    console.error("Error generating metadata for category:", error);
  }

  return {
    title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} | Felna Tech`,
    description: `Browse ${slug} at the best price from Felna Tech.`
  };
}

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

