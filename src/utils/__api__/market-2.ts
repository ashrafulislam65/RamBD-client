import axios from "@lib/axios";
import Brand from "models/Brand.model";
import Product from "models/product.model";
import Service from "models/service.model";
import { CategoryBasedProducts, MainCarouselItem } from "models/market-2.model";
import { transformApiProduct, transformApiBrand } from "@utils/productTransformer";

const getProducts = async (): Promise<Product[]> => {
  return getLatestProducts();
};

const getServices = async (): Promise<Service[]> => {
  const response = await axios.get("/api/market-2/service");
  return response.data;
};

const getCategories = async () => {
  const response = await axios.get("/api/market-2/categories");
  return response.data;
};

const getBrands = async (): Promise<Brand[]> => {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://admin.unicodeconverter.info';
    const response = await fetch(`${apiBaseUrl}/brand/getAllBrandsLast`, { next: { revalidate: 3600 } });
    if (!response.ok) return [];

    const data = await response.json();
    const brands = data.brands || [];
    return brands.map(transformApiBrand);
  } catch (error) {
    console.error("getBrands face error:", error);
    return [];
  }
};

const getMainCarouselData = async (): Promise<MainCarouselItem[]> => {
  const response = await axios.get("/api/market-2/main-carousel");
  return response.data;
};

const getElectronicsProducts = async (): Promise<CategoryBasedProducts> => {
  const response = await axios.get("/api/market-2/category-based-product?tag=electronics");
  return response.data;
};

const getMenFashionProducts = async (): Promise<CategoryBasedProducts> => {
  const response = await axios.get("/api/market-2/category-based-product?tag=men");
  return response.data;
};

const getWomenFashionProducts = async (): Promise<CategoryBasedProducts> => {
  const response = await axios.get("/api/market-2/category-based-product?tag=women");
  return response.data;
};

const getLatestProducts = async (): Promise<Product[]> => {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://admin.unicodeconverter.info';
    const response = await fetch(`${apiBaseUrl}/LatestProductList/getAllLatestProducts`, { next: { revalidate: 3600 } });
    if (!response.ok) return [];

    const data = await response.json();
    const products = data.products || [];
    return products.map(transformApiProduct).filter((p: any) => p !== null);
  } catch (error) {
    console.error("getLatestProducts face error:", error);
    return [];
  }
};

const getMostPopularProducts = async (): Promise<Product[]> => {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://admin.unicodeconverter.info';
    const response = await fetch(`${apiBaseUrl}/most-popular-product`, { next: { revalidate: 3600 } });
    if (!response.ok) return [];

    const data = await response.json();
    const products = data.populars || [];
    return products.map(transformApiProduct);
  } catch (error) {
    console.error("getMostPopularProducts face error:", error);
    return [];
  }
};

const getTopRatedProducts = async (): Promise<Product[]> => {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://admin.unicodeconverter.info';
    const response = await fetch(`${apiBaseUrl}/top-rated-product`, { next: { revalidate: 3600 } });
    if (!response.ok) return [];

    const data = await response.json();
    const products = data.products || [];
    return products.map(transformApiProduct).filter((p: any) => p !== null);
  } catch (error) {
    console.error("getTopRatedProducts face error:", error);
    return [];
  }
};

export default {
  getBrands,
  getProducts,
  getServices,
  getCategories,
  getMainCarouselData,
  getMenFashionProducts,
  getElectronicsProducts,
  getWomenFashionProducts,
  getLatestProducts,
  getMostPopularProducts,
  getTopRatedProducts
};
