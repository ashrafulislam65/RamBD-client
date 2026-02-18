"use client";

import { useCallback, useState, useEffect } from "react";

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
    brands: { id: string; name: string }[];
};
// ==============================================================

export default function CategorySearchResult({
    sortOptions,
    products: initialProducts,
    categoryName,
    totalPages,
    totalProducts,
    currentPage,
    minPriceDefault,
    maxPriceDefault,
    categories,
    brands
}: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const width = useWindowSize();
    const [view, setView] = useState<"grid" | "list">("grid");
    const [products, setProducts] = useState(initialProducts);
    const [currentSort, setCurrentSort] = useState(() =>
        sortOptions.find(opt => opt.value === searchParams.get("sort")) || sortOptions[0]
    );

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
            default:
                return productList;
        }
        return sorted;
    }, []);

    const handleSortChange = (option: any) => {
        setCurrentSort(option);

        // Update URL for server-side persistence (optional but good)
        const params = new URLSearchParams(searchParams);
        params.set("sort", option.value);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });

        // Immediate client-side sort
        setProducts(applySort(initialProducts, option));
    };

    useEffect(() => {
        // Sync with props when navigation/filtering happens
        const urlSortValue = searchParams.get("sort");
        const activeSort = sortOptions.find(opt => opt.value === urlSortValue) || currentSort;

        setProducts(applySort(initialProducts, activeSort));
        setCurrentSort(activeSort);
    }, [initialProducts, searchParams, sortOptions, applySort]);

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
                        Sort by:
                    </Paragraph>

                    <Box flex="1 1 0" mr="1.75rem" minWidth="150px">
                        <Select
                            instanceId="category-sort-select"
                            placeholder="Sort by"
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
                            <ProductFilterCard
                                brands={brands}
                                categories={categories}
                                minPriceDefault={minPriceDefault}
                                maxPriceDefault={maxPriceDefault}
                            />
                        </Sidenav>
                    )}
                </FlexBox>
            </FlexBox>

            <Grid container spacing={3}>
                <Grid item lg={3} xs={12}>
                    <ProductFilterCard
                        brands={brands}
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
