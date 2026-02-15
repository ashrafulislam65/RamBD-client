import { Fragment } from "react";
// API FUNCTIONS
import api from "@utils/__api__/market-2";
import navbarApi from "@utils/__api__/navbar";
import categoryProductApi from "@utils/__api__/category-products";
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
import Section9 from "@sections/market-2/section-9";
import Section10 from "@sections/market-2/section-10";
import Section11 from "@sections/market-2/section-11";

export default async function Home() {
  const brands = await api.getBrands();
  const products = await api.getProducts();

  // Fetch real product data from company APIs
  const latestProducts = await api.getLatestProducts();
  const popularProducts = await api.getMostPopularProducts();
  const topRatedProducts = await api.getTopRatedProducts();

  let navbarCategories: any = null;
  try {
    navbarCategories = await navbarApi.getNavbarServices();
  } catch (error) {
    console.error("Server-side fetch for navbar failed:", error);
  }

  return (
    <AppLayout navbar={<Navbar categories={navbarCategories} />}>
      <Fragment>
        <Box bg="white" pb="1rem" pt="0">
          {/* HERO CAROUSEL AREA */}
          <Box mx="auto" bg="base.200" maxWidth={1210} borderRadius="8px" mb="5px" p="5px">
            <Section1 />
          </Box>

          {/* SERVICE LIST AREA */}
          <Box mx="auto" bg="base.200" maxWidth={1210} borderRadius="8px" mb="5px" p="5px">
            <Section2 />
          </Box>

          {/* TOP CATEGORIES AREA */}
          <Box mx="auto" bg="base.200" maxWidth={1210} borderRadius="8px" mb="5px" p="5px">
            <Section3 />
          </Box>

          {/* DEAL OF THE DAY PRODUCTS AREA - TOP RATED */}
          <Box mx="auto" bg="base.200" maxWidth={1210} borderRadius="8px" mb="5px" p="5px">
            <Section4 products={topRatedProducts} />
          </Box>

          {/* LATEST PRODUCTS AREA */}
          <Box mx="auto" bg="base.200" maxWidth={1210} borderRadius="8px" mb="5px" p="5px">
            <Section11 products={latestProducts} />
          </Box>

          {/* 
          <Box mx="auto" bg="base.200" maxWidth={1210} borderRadius="8px" mb="5px" p="5px">
            <Section5 />
          </Box>
*/}

          {/* FEATURES BRAND LIST AREA */}
          <Box mx="auto" bg="base.200" maxWidth={1210} borderRadius="8px" mb="5px" p="5px">
            <Section9 brands={brands as any} />
          </Box>

          {/* SELECTED PRODUCTS AREA - MOST POPULAR */}
          <Box mx="auto" bg="base.200" maxWidth={1210} borderRadius="8px" mb="5px" p="5px">
            <Section10 products={popularProducts} />
          </Box>
        </Box>
      </Fragment>
    </AppLayout>
  );
}
