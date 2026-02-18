"use client";

import { useCallback, useState } from "react";

import Box from "@component/Box";
import Card from "@component/Card";
import Select from "@component/Select";
import Icon from "@component/icon/Icon";
import Grid from "@component/grid/Grid";
import FlexBox from "@component/FlexBox";
import { IconButton } from "@component/buttons";
import Sidenav from "@component/sidenav/Sidenav";
import { H5, Paragraph } from "@component/Typography";

import ProductGridView from "@component/products/ProductCard19List";
import ProductListView from "@component/products/ProductCard9List";
import ProductFilterCard from "@component/products/ProductFilterCard";
import useWindowSize from "@hook/useWindowSize";
import Product from "@models/product.model";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

// ==============================================================
type Props = {
    sortOptions: { label: string; value: string }[];
    products: Product[];
    categoryName?: string;
    totalPages: number;
    totalProducts: number;
    currentPage: number;
    minPriceDefault?: number;
    maxPriceDefault?: number;
    categories: any[];
};
// ==============================================================

export default function CategorySearchResult({
    sortOptions,
    products,
    categoryName,
    totalPages,
    totalProducts,
    currentPage,
    minPriceDefault,
    maxPriceDefault,
    categories
}: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const width = useWindowSize();
    const [view, setView] = useState<"grid" | "list">("grid");

    const isTablet = width < 1025;
    const toggleView = useCallback((v: any) => () => setView(v), []);

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
                    <H5>Searching for “ {categoryName || "Category"} ”</H5>
                    <Paragraph color="text.muted">{totalProducts} results found</Paragraph>
                </div>

                <FlexBox alignItems="center" flexWrap="wrap">
                    <Paragraph color="text.muted" mr="1rem">
                        Short by:
                    </Paragraph>

                    <Box flex="1 1 0" mr="1.75rem" minWidth="150px">
                        <Select
                            instanceId="category-sort-select"
                            placeholder="Short by"
                            defaultValue={sortOptions.find(opt => opt.value === searchParams.get("sort")) || sortOptions[0]}
                            options={sortOptions}
                            onChange={(option: any) => {
                                const params = new URLSearchParams(searchParams);
                                params.set("sort", option.value);
                                router.push(`${pathname}?${params.toString()}`);
                            }}
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

            <Grid container spacing={3}>
                <Grid item lg={3} xs={12}>
                    <ProductFilterCard
                        brands={Array.from(new Set(products.map(p => p.brand).filter(Boolean)))}
                        ratings={[5, 4, 3, 2, 1]}
                        minPriceDefault={minPriceDefault}
                        maxPriceDefault={maxPriceDefault}
                        categories={categories}
                    />
                </Grid>

                <Grid item lg={9} xs={12}>
                    {view === "grid" ? (
                        <ProductGridView
                            products={products}
                            categorySlug={categoryName}
                            totalPages={totalPages}
                            currentPage={currentPage}
                        />
                    ) : (
                        <ProductListView
                            products={products}
                            categorySlug={categoryName}
                            totalPages={totalPages}
                            currentPage={currentPage}
                        />
                    )}
                </Grid>
            </Grid>
        </>
    );
}
