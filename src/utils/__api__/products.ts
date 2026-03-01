import { cache } from "react";
import axios from "@lib/axios";
import Product from "@models/product.model";
import Shop from "@models/shop.model";

import market2Api from "./market-2";
import categoryProductApi from "./category-products";
import { transformApiProduct } from "@utils/productTransformer";

// get all product slug
const getSlugs = async (): Promise<{ slug: string }[]> => {
  const response = await axios.get("/api/products/slug-list");
  return response.data;
};

// get product based on slug
const getProduct = cache(async (slug: string, categorySlug?: string): Promise<Product> => {
  try {
    // 1. Always try direct fetch first (Most common case)
    console.log(`Directly fetching product for slug: ${slug}`);
    const response = await axios.get("/api/products/slug", { params: { slug } });

    // If we have valid product data, return it immediately
    if (response.data && response.data.pro_title) {
      return transformApiProduct(response.data);
    } else if (response.data && response.data.id) {
      return response.data;
    }

    // 2. Probing logic as fallback (sequentially to avoid socket hang up)
    console.log(`Probing fallbacks for slug: ${slug}`);

    // Check market-2 APIs one by one if needed (or in smaller batches)
    const fallbackResults = await Promise.allSettled([
      market2Api.getLatestProducts(),
      market2Api.getMostPopularProducts(),
      market2Api.getTopRatedProducts()
    ]);

    const allRealProducts = fallbackResults
      .filter(res => res.status === 'fulfilled')
      .map(res => (res as any).value.products || (res as any).value)
      .flat();

    let realProduct = allRealProducts.find((p) => (p as any).slug === slug);

    if (!realProduct && categorySlug) {
      try {
        const catRes = await categoryProductApi.getProductsByCategory(categorySlug);
        realProduct = catRes.products.find((p) => (p as any).slug === slug);
      } catch (e) {
        console.error("Category fallback probe failed");
      }
    }

    return realProduct || response.data;
  } catch (error) {
    console.error("Error in getProduct fallback:", error);
    // Final fallback attempt
    try {
      const response = await axios.get("/api/products/slug", { params: { slug } });
      return response.data.pro_title ? transformApiProduct(response.data) : response.data;
    } catch (e) {
      console.error("Final fallback failed:", e);
      throw error;
    }
  }
});

const getFrequentlyBought = cache(async (): Promise<Product[]> => {
  return market2Api.getTopRatedProducts();
});

const getRelatedProducts = cache(async (categorySlug?: string): Promise<Product[]> => {
  if (categorySlug) {
    const res = await categoryProductApi.getProductsByCategory(categorySlug);
    if (res.products && res.products.length > 0) {
      return res.products;
    }
  }
  return market2Api.getLatestProducts();
});

const getAvailableShop = cache(async (): Promise<Shop[]> => {
  const response = await axios.get("/api/product/shops");
  return response.data;
});

const getReviews = cache(async (slug: string, model: string): Promise<any[]> => {
  try {
    if (!model) return [];

    const cleanModel = model.trim();
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://admin.unicodeconverter.info';
    const url = `${apiBaseUrl}/products/reviews-data/${slug}/${cleanModel}`;

    const response = await axios.get(url);
    const data = response.data;
    return data.proReview || [];
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return [];
  }
});

const postReview = async (slug: string, model: string, reviewData: { rating: number; message: string; client_id: number | string; pro_id?: number | string }): Promise<any> => {
  try {
    const cleanModel = model.trim();
    const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://admin.unicodeconverter.info').trim();
    // POST requires /api prefix while GET does not.
    const url = `${apiBaseUrl}/api/products/reviews-data/${slug}/${cleanModel}`;

    // Shotgun approach: Send ALL possible field names because the backend is returned nulls for rev_rating/rev_details
    const body: any = {
      rev_rating: reviewData.rating,
      rev_details: reviewData.message,
      rating: reviewData.rating,
      comment: reviewData.message,
      message: reviewData.message,
      details: reviewData.message,
      client_id: reviewData.client_id,
      slug: slug
    };

    // Only include pro_id and product_id if it's a numeric value
    if (reviewData.pro_id && !isNaN(Number(reviewData.pro_id))) {
      body.pro_id = Number(reviewData.pro_id);
      body.product_id = Number(reviewData.pro_id);
    }

    console.log("🚀 [REVIEWS] Submitting review to:", url, body);
    const response = await axios.post(url, body);
    return response.data;
  } catch (error) {
    console.error("❌ [REVIEWS] Failed to post review:", error);
    throw error;
  }
};

export default { getSlugs, getProduct, getFrequentlyBought, getRelatedProducts, getAvailableShop, getReviews, postReview };
