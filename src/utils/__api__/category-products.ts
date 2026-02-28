
import axios from "axios";
import Product from "@models/product.model";
import { transformApiProduct } from "@utils/productTransformer";

const getProductsByCategory = async (
    slug: string,
    minPrice?: string | string[],
    maxPrice?: string | string[],
    page: number = 1,
    sort?: string,
    brand_id?: string
): Promise<{ products: Product[]; totalPages: number; totalProducts: number }> => {
    try {
        const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.unicodeconverter.info").trim();
        const categoryUrl = (process.env.NEXT_PUBLIC_CATEGORY_ITEMS_URL || `${apiBaseUrl}/product/product-category-items`).trim();
        let url = `${categoryUrl}/${slug}?page=${page}&limit=16`;

        if (sort) url += `&sort=${sort}`;

        if (minPrice) url += `&min_price=${minPrice}`;
        if (maxPrice) url += `&max_price=${maxPrice}`;
        if (brand_id) url += `&brand_id=${brand_id}`;

        console.log(`Fetching products from: ${url}`);
        const response = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "application/json"
            }
        });

        const data = response.data;

        // Initial check to see if response data exists
        if (!data || !data.products || !data.products.data) {
            console.warn("No data found for category:", slug, data);
            return { products: [], totalPages: 1, totalProducts: 0 };
        }
        console.log(`Found ${data.products.data.length} products`);

        // Map the API response to our Product model using the shared transformer
        const products: Product[] = data.products.data.map((item: any) => {
            const transformed = transformApiProduct(item);
            if (!transformed) return null;

            // The category API might use different field names for thumbnail/price 
            // than the latest products API. Let's provide fallbacks if the transformer
            // didn't find the data.
            if (!transformed.thumbnail || transformed.thumbnail.includes('default-product.png')) {
                const storageBaseUrl = process.env.NEXT_PUBLIC_STORAGE_BASE_URL;
                if (item.product_thumbnail) {
                    transformed.thumbnail = `${storageBaseUrl}/${item.product_thumbnail}`;
                }
            }

            if (transformed.price === 0 && item.product_price) {
                transformed.price = Number(item.product_price);
            }

            // Ensure categories is set for routing/filtering context if needed
            transformed.categories = [slug];

            return transformed;
        }).filter((p: any) => p !== null);

        return {
            products,
            totalPages: data.products.last_page || 1,
            totalProducts: data.products.total || products.length
        };
    } catch (error: any) {
        console.error("Failed to fetch products by category.");
        console.error("URL:", `${process.env.NEXT_PUBLIC_CATEGORY_ITEMS_URL}/${slug}`);
        console.error("Error details:", error);
        if (error.cause) console.error("Error cause:", error.cause);
        return { products: [], totalPages: 1, totalProducts: 0 };
    }
};

export default { getProductsByCategory };
