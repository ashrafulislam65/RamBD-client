"use client";

import { useCallback, useState, useEffect } from "react";

import Box from "@component/Box";
import Card from "@component/Card";
import Select from "@component/Select";
import Hidden from "@component/hidden";
import Icon from "@component/icon/Icon";
import Grid from "@component/grid/Grid";
import FlexBox from "@component/FlexBox";
import { IconButton } from "@component/buttons";
import Sidenav from "@component/sidenav/Sidenav";
import { H5, Paragraph } from "@component/Typography";

import ProductGridView from "@component/products/ProductCard1List";
import ProductListView from "@component/products/ProductCard9List";
import ProductFilterCard from "@component/products/ProductFilterCard";
import useWindowSize from "@hook/useWindowSize";
// import db from "@data/db";

// ==============================================================
type Props = {
  sortOptions: { label: string; value: string }[];
  title?: string;
};
// ==============================================================

export default function SearchResult({ sortOptions, products: initialProducts, title = "Searching for products" }: { sortOptions: { label: string; value: string }[], products: any[], title?: string }) {
  const width = useWindowSize();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState(initialProducts);
  const [currentSort, setCurrentSort] = useState(sortOptions[0]);

  const isTablet = width < 1025;
  const toggleView = useCallback((v: any) => () => setView(v), []);

  const applySort = useCallback((productList: any[], sortOption: any) => {
    const sorted = [...productList];
    if (!sortOption) return productList;

    switch (sortOption.value) {
      case "price-asc":
        sorted.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
        break;
      case "price-desc":
        sorted.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
        break;
      case "date":
        sorted.sort((a, b) => Number(b.id) - Number(a.id));
        break;
      default:
        return productList;
    }
    return sorted;
  }, []);

  const handleSortChange = (option: any) => {
    setCurrentSort(option);
    setProducts(applySort(initialProducts, option));
  };

  useEffect(() => {
    setProducts(applySort(initialProducts, currentSort));
  }, [initialProducts, currentSort, applySort]);

  return (
    <>
      <FlexBox
        as={Card}
        mb="24px"
        p="1.25rem"
        elevation={5}
        flexWrap="wrap"
        borderRadius={8}
        alignItems="center"
        justifyContent="space-between">
        <div>
          <H5>{title}</H5>
          <Paragraph color="text.muted">{products.length} items found</Paragraph>
        </div>

        <FlexBox alignItems="center" flexWrap="wrap">
          <Paragraph color="text.muted" mr="1rem">
            Sort by:
          </Paragraph>

          <Box flex="1 1 0" mr="1.75rem" minWidth="150px">
            <Select
              placeholder="Sort by"
              defaultValue={currentSort}
              value={currentSort}
              options={sortOptions}
              onChange={handleSortChange}
            />
          </Box>

          <Paragraph color="text.muted" mr="0.5rem">
            View:
          </Paragraph>

          <IconButton onClick={toggleView("grid")}>
            <Icon
              variant="small"
              defaultcolor="auto"
              color={view === "grid" ? "primary" : "inherit"}>
              grid
            </Icon>
          </IconButton>

          <IconButton onClick={toggleView("list")}>
            <Icon
              variant="small"
              defaultcolor="auto"
              color={view === "list" ? "primary" : "inherit"}>
              menu
            </Icon>
          </IconButton>

          {isTablet && (
            <Sidenav
              position="left"
              scroll={true}
              handle={
                <IconButton>
                  <Icon>options</Icon>
                </IconButton>
              }>
              <ProductFilterCard />
            </Sidenav>
          )}
        </FlexBox>
      </FlexBox>

      <Grid container spacing={0.5}>
        {/* <Hidden as={Grid} item lg={3} xs={12} down={1024}>
          <ProductFilterCard />
        </Hidden> */}

        <Grid item lg={3} xs={12}>
          <ProductFilterCard />
        </Grid>

        <Grid item lg={9} xs={12}>
          {view === "grid" ? (
            <ProductGridView products={products} />
          ) : (
            <ProductListView products={products} />
          )}
        </Grid>
      </Grid>
    </>
  );
}
