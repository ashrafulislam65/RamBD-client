"use client";

import { useCallback, useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

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

    const currentSortValue = searchParams.get("sort") || sortOptions[0].value;
    const currentSort = useMemo(() =>
        sortOptions.find(opt => opt.value === currentSortValue) || sortOptions[0]
        , [sortOptions, currentSortValue]);

    const isTablet = width < 1025;
    const toggleView = useCallback((v: any) => () => setView(v), []);

    const handleSortChange = (option: any) => {
        const params = new URLSearchParams(searchParams);
        params.set("sort", option.value);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    useEffect(() => {
        let filtered = [...initialProducts];

        // 1. Filter by Brand (Only if not already filtered by API, but we apply for consistency)
        const brandIds = searchParams.get("brand_id")?.split(",") || [];
        if (brandIds.length > 0) {
            filtered = filtered.filter(p => p.brandId && brandIds.includes(String(p.brandId)));
        }

        // 2. Filter by Price
        const minPrice = Number(searchParams.get("min_price"));
        const maxPrice = Number(searchParams.get("max_price"));
        if (minPrice) filtered = filtered.filter(p => p.price >= minPrice);
        if (maxPrice) filtered = filtered.filter(p => p.price <= maxPrice);

        // 3. Filter by Ratings
        const ratings = searchParams.get("ratings")?.split(",") || [];
        if (ratings.length > 0) {
            filtered = filtered.filter(p => ratings.includes(Math.round(p.rating || 5).toString()));
        }

        // 4. Filter by Availability
        const onSale = searchParams.get("on_sale") === "true";
        const inStock = searchParams.get("in_stock") === "true";
        const featured = searchParams.get("featured") === "true";

        if (onSale) filtered = filtered.filter(p => p.on_sale);
        if (inStock) filtered = filtered.filter(p => p.in_stock);
        if (featured) filtered = filtered.filter(p => p.featured);

        // 5. Sort
        switch (currentSort.value) {
            case "price-asc":
                filtered.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
                break;
            case "price-desc":
                filtered.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
                break;
            default:
                // Keep default or use relevance if available
                break;
        }

        setProducts(filtered);

        console.log("--- Category Filter Debug ---");
        console.log("Total initial products:", initialProducts.length);
        console.log("Active Filters:", {
            brandIds,
            minPrice,
            maxPrice,
            ratings,
            onSale,
            inStock,
            featured
        });
        console.log("Filtered products found:", filtered.length);
        console.log("-----------------------------");
    }, [initialProducts, searchParams, currentSort]);


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

            <Grid container vertical_spacing={3} horizontal_spacing={0.5}>
                <Grid item lg={3} xs={12}>
                    <ProductFilterCard
                        brands={brands}
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
