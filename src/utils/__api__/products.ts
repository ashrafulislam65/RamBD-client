import axios from "@lib/axios";
import Product from "@models/product.model";
import Shop from "@models/shop.model";

import market2Api from "./market-2";
import categoryProductApi from "./category-products";

// get all product slug
const getSlugs = async (): Promise<{ slug: string }[]> => {
  const response = await axios.get("/api/products/slug-list");
  return response.data;
};

// get product based on slug
const getProduct = async (slug: string, categorySlug?: string): Promise<Product> => {
  try {
    // 1. Try to find in real product lists first
    const probes = [
      market2Api.getLatestProducts(),
      market2Api.getMostPopularProducts(),
      market2Api.getTopRatedProducts()
    ];

    // If category is provided, probe that too
    if (categorySlug) {
      console.log(`Probing specific category list: ${categorySlug}`);
      probes.push(categoryProductApi.getProductsByCategory(categorySlug));
    }

    const results = await Promise.all(probes);
    const allRealProducts = results.flat();
    const realProduct = allRealProducts.find((p) => p.slug === slug);

    if (realProduct) {
      console.log(`Found real product for slug: ${slug}`);
      return realProduct;
    }

    // 2. Fallback to mock data
    console.log(`Falling back to mock data for slug: ${slug}`);
    const response = await axios.get("/api/products/slug", { params: { slug } });
    return response.data;
  } catch (error) {
    console.error("Error in getProduct (smart search):", error);
    // Final fallback to mock if API fails
    const response = await axios.get("/api/products/slug", { params: { slug } });
    return response.data;
  }
};

const getFrequentlyBought = async (): Promise<Product[]> => {
  return market2Api.getTopRatedProducts();
};

const getRelatedProducts = async (categorySlug?: string): Promise<Product[]> => {
  if (categorySlug) {
    return categoryProductApi.getProductsByCategory(categorySlug);
  }
  return market2Api.getLatestProducts();
};

const getAvailableShop = async (): Promise<Shop[]> => {
  const response = await axios.get("/api/product/shops");
  return response.data;
};

const getReviews = async (slug: string, model: string): Promise<any[]> => {
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
};

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
