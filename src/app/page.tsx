import { Fragment } from "react";
// API FUNCTIONS
import api from "@utils/__api__/market-2";
import navbarApi from "@utils/__api__/navbar";
// GLOBAL CUSTOM COMPONENTS
import Box from "@component/Box";
import Navbar from "@component/navbar/Navbar";
import AppLayout from "@component/layout/layout-1";
// PAGE SECTION COMPONENTS
import Section1 from "@sections/market-2/section-1";
import Section2 from "@sections/market-2/section-2";
import Section3 from "@sections/market-2/section-3";
import Section4 from "@sections/market-2/section-4";
import Section5 from "@sections/market-2/section-5";
import Section6 from "@sections/market-2/section-6";
import Section7 from "@sections/market-2/section-7";
import Section8 from "@sections/market-2/section-8";
import Section9 from "@sections/market-2/section-9";
import Section10 from "@sections/market-2/section-10";
import Section11 from "@sections/market-2/section-11";

export default async function Home() {
  const brands = await api.getBrands();
  const products = await api.getProducts();
  const menFashionProducts = await api.getMenFashionProducts();
  const electronicsProducts = await api.getElectronicsProducts();
  const womenFashionProducts = await api.getWomenFashionProducts();

  // Fetch real product data from company APIs
  const latestProducts = await api.getLatestProducts();
  const popularProducts = await api.getMostPopularProducts();
  const topRatedProducts = await api.getTopRatedProducts();

  let navbarCategories: any = null;
  try {
    navbarCategories = await navbarApi.getNavbarServices();
    console.log("Server side navbarCategories fetched. Type:", typeof navbarCategories);
    if (navbarCategories) {
      console.log("Response Keys:", Object.keys(navbarCategories));
      if (navbarCategories.menu) console.log("Menu Item 0:", JSON.stringify(navbarCategories.menu[0]));
      if (navbarCategories.category) console.log("Category Item 0:", JSON.stringify(navbarCategories.category[0]));
    }
  } catch (error) {
    console.error("Server-side fetch for navbar failed:", error);
  }

  return (
    <AppLayout navbar={<Navbar categories={navbarCategories} />}>
      <Fragment>
        <Box bg="#F6F6F6">
          {/* HERO CAROUSEL AREA */}
          <Section1 />

          {/* SERVICE LIST AREA */}
          <Section2 />

          {/* TOP CATEGORIES AREA */}
          <Section3 />

          {/* DEAL OF THE DAY PRODUCTS AREA - TOP RATED */}
          <Section4 products={topRatedProducts} />

          {/* LATEST PRODUCTS AREA */}
          <Section11 products={latestProducts} />

          {/* NEW ARRIVALS AND BEST SELLER OFFER BANNER AREA */}
          <Section5 />

          {/* ELECTRONICS CATEGORY BASED PRODUCTS AREA */}
          <Section6 data={electronicsProducts} />

          {/* SALES OFFER BANNERS AREA */}
          <Section7 />

          {/* MEN'S CATEGORY BASED PRODUCTS AREA */}
          <Section6 data={menFashionProducts} />

          {/* DISCOUNT OFFER BANNER AREA */}
          <Section8 />

          {/* WOMEN'S CATEGORY BASED PRODUCTS AREA */}
          <Section6 data={womenFashionProducts} />

          {/* FEATURES BRAND LIST AREA */}
          <Section9 brands={brands as any} />

          {/* SELECTED PRODUCTS AREA - MOST POPULAR */}
          <Section10 products={popularProducts} />
        </Box>
      </Fragment>
    </AppLayout>
  );
}
