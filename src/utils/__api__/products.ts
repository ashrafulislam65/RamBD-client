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
    if (response.data) {
      // If it's the mock server, it might already be transformed, 
      // but applying transformApiProduct is safer if it returns raw API format.
      // We check for id to see if it's already a model.
      return response.data.pro_title ? transformApiProduct(response.data) : response.data;
    }

    // 2. Probing logic as fallback (if direct fetch for some reason doesn't return the full data or is mock-only)
    const probes: Promise<Product[]>[] = [
      market2Api.getLatestProducts(),
      market2Api.getMostPopularProducts(),
      market2Api.getTopRatedProducts()
    ];

    if (categorySlug) {
      const catRes = await categoryProductApi.getProductsByCategory(categorySlug);
      probes.push(Promise.resolve(catRes.products));
    }

    const results = await Promise.all(probes);
    const allRealProducts = results.map(res => (res as any).products || res).flat();
    const realProduct = allRealProducts.find((p) => (p as any).slug === slug);

    return realProduct || response.data;
  } catch (error) {
    console.error("Error in getProduct:", error);
    // Final fallback
    const response = await axios.get("/api/products/slug", { params: { slug } });
    return response.data.pro_title ? transformApiProduct(response.data) : response.data;
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
    const url = `${apiBaseUrl}/api/products/reviews-data/${slug}/${cleanModel}`;

    const response = await fetch(url, { next: { revalidate: 0 } });
    if (!response.ok) return [];

    const data = await response.json();
    return data.proReview || [];
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return [];
  }
});

const postReview = async (slug: string, model: string, reviewData: { rating: number; message: string; client_id: number }): Promise<any> => {
  try {
    const cleanModel = model.trim();
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://admin.unicodeconverter.info';
    const url = `${apiBaseUrl}/api/products/reviews-data/${slug}/${cleanModel}`;

    // The API expects 'slug' in the body as well based on user request example
    const body = {
      ...reviewData,
      slug: slug
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`Failed to post review: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to post review:", error);
    throw error;
  }
};

export default { getSlugs, getProduct, getFrequentlyBought, getRelatedProducts, getAvailableShop, getReviews, postReview };
