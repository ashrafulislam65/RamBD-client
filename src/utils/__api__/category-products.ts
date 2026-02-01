
import axios from "axios";
import Product from "@models/product.model";
import { transformApiProduct } from "@utils/productTransformer";

const getProductsByCategory = async (
    slug: string,
    minPrice?: string | string[],
    maxPrice?: string | string[]
): Promise<Product[]> => {
    try {
        const categoryUrl = process.env.NEXT_PUBLIC_CATEGORY_ITEMS_URL || "https://admin.felnatech.com/product/product-category-items";
        let url = `${categoryUrl}/${slug}?page=1&limit=20`;

        if (minPrice) url += `&min_price=${minPrice}`;
        if (maxPrice) url += `&max_price=${maxPrice}`;

        console.log(`Fetching products: ${url}`);
        const response = await fetch(url, { next: { revalidate: 3600 } });

        if (!response.ok) {
            console.error(`API response error: ${response.status}`);
            return [];
        }

        const data = await response.json();

        // Initial check to see if response data exists
        if (!data || !data.products || !data.products.data) {
            console.warn("No data found for category:", slug, data);
            return [];
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

        return products;
    } catch (error) {
        console.error("Failed to fetch products by category:", error);
        return [];
    }
};

export default { getProductsByCategory };
