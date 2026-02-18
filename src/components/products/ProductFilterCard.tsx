"use client";

import Card from "@component/Card";
import Box from "@component/Box";
import Avatar from "@component/avatar";
import Rating from "@component/rating";
import Divider from "@component/Divider";
import FlexBox from "@component/FlexBox";
import CheckBox from "@component/CheckBox";
import TextField from "@component/text-field";
import { Accordion, AccordionHeader } from "@component/accordion";
import { H5, H6, Paragraph, SemiSpan } from "@component/Typography";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import styled from "styled-components";
import { themeGet } from "@styled-system/theme-get";

const StyledSlider = styled(Slider)`
  .rc-slider-rail {
    background-color: ${themeGet("colors.gray.300")};
  }
  .rc-slider-track {
    background-color: #7ED321; /* Match the green in screenshot */
  }
  .rc-slider-handle {
    border: solid 2px #7ED321;
    background-color: #fff;
    opacity: 1;
    &:focus, &:active, &:hover {
      border-color: #7ED321;
      box-shadow: 0 0 0 5px rgba(126, 211, 33, 0.2);
    }
  }
`;

type Props = {
  categories?: any[];
  brands?: string[];
  ratings?: number[];
  minPriceDefault?: number;
  maxPriceDefault?: number;
};

export default function ProductFilterCard({
  categories = [],
  brands = [],
  ratings = [],
  minPriceDefault = 0,
  maxPriceDefault = 10000
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || minPriceDefault.toString());
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || maxPriceDefault.toString());

  useEffect(() => {
    setMinPrice(searchParams.get("min_price") || minPriceDefault.toString());
    setMaxPrice(searchParams.get("max_price") || maxPriceDefault.toString());
  }, [searchParams, minPriceDefault, maxPriceDefault]);

  const handlePriceChange = (values: number | number[]) => {
    if (Array.isArray(values)) {
      const [min, max] = values;
      setMinPrice(min.toString());
      setMaxPrice(max.toString());
    }
  };

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.set("min_price", minPrice);
    params.set("max_price", maxPrice);
    params.set("page", "1"); // Reset to page 1 on filter
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSliderChangeComplete = (values: number | number[]) => {
    if (Array.isArray(values)) {
      applyPriceFilter();
    }
  };

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleBrandChange = (brand: string) => {
    const currentBrands = searchParams.get("brands")?.split(",") || [];
    let updated;
    if (currentBrands.includes(brand)) {
      updated = currentBrands.filter(b => b !== brand);
    } else {
      updated = [...currentBrands, brand];
    }
    updateParam("brands", updated.join(",") || null);
  };

  const handleRatingChange = (rating: number) => {
    const currentRatings = searchParams.get("ratings")?.split(",") || [];
    const rStr = rating.toString();
    let updated;
    if (currentRatings.includes(rStr)) {
      updated = currentRatings.filter(r => r !== rStr);
    } else {
      updated = [...currentRatings, rStr];
    }
    updateParam("ratings", updated.join(",") || null);
  };

  const selectedBrands = searchParams.get("brands")?.split(",") || [];
  const selectedRatings = searchParams.get("ratings")?.split(",") || [];

  const render = (items: string[]) =>
    items.map((name) => (
      <Paragraph
        py="6px"
        pl="22px"
        key={name}
        fontSize="14px"
        color="text.muted"
        className="cursor-pointer">
        {name}
      </Paragraph>
    ));

  return (
    <Card p="18px 27px" elevation={5} borderRadius={8}>
      <H6 mb="10px">Categories</H6>

      {(categories.length > 0 ? categories : categoryList).map((item) =>
        item.child ? (
          <Accordion key={item.title} expanded>
            <AccordionHeader px="0px" py="6px" color="text.muted">
              <SemiSpan className="cursor-pointer" mr="9px">
                {item.title}
              </SemiSpan>
            </AccordionHeader>

            {render(item.child)}
          </Accordion>
        ) : (
          <Paragraph
            py="6px"
            fontSize="14px"
            key={item.title}
            color="text.muted"
            className="cursor-pointer">
            {item.title}
          </Paragraph>
        )
      )}

      <Divider mt="18px" mb="24px" />

      {/* PRICE RANGE FILTER */}
      <H6 mb="16px">Price Range</H6>
      <Box mb="24px" px="5px">
        <StyledSlider
          range
          min={minPriceDefault}
          max={maxPriceDefault}
          value={[Number(minPrice) || minPriceDefault, Number(maxPrice) || maxPriceDefault]}
          onChange={handlePriceChange}
          onChangeComplete={handleSliderChangeComplete}
        />
      </Box>
      <FlexBox justifyContent="space-between" alignItems="center">
        <TextField
          placeholder="Min"
          type="number"
          fullwidth
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          onBlur={applyPriceFilter}
          onKeyDown={(e) => e.key === "Enter" && applyPriceFilter()}
        />

        <H5 color="text.muted" px="0.5rem">
          -
        </H5>

        <TextField
          placeholder="Max"
          type="number"
          fullwidth
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          onBlur={applyPriceFilter}
          onKeyDown={(e) => e.key === "Enter" && applyPriceFilter()}
        />
      </FlexBox>

      <Divider my="24px" />

      {/* BRANDS FILTER */}
      <H6 mb="16px">Brands</H6>
      {(brands.length > 0 ? brands : brandList).map((item) => (
        <CheckBox
          my="10px"
          key={item}
          name={item}
          value={item}
          color="secondary"
          checked={selectedBrands.includes(item)}
          label={<SemiSpan color="inherit">{item}</SemiSpan>}
          onChange={() => handleBrandChange(item)}
        />
      ))}

      <Divider my="24px" />

      {/* STOCK AND SALES FILTERS */}
      {otherOptions.map((item) => (
        <CheckBox
          my="10px"
          key={item}
          name={item}
          value={item}
          color="secondary"
          label={<SemiSpan color="inherit">{item}</SemiSpan>}
          onChange={(e) => console.log(e.target.value, e.target.checked)}
        />
      ))}

      <Divider my="24px" />

      {/* RATING FILTER */}
      <H6 mb="16px">Ratings</H6>
      {(ratings.length > 0 ? ratings : [5, 4, 3, 2, 1]).map((item) => (
        <CheckBox
          my="10px"
          key={item}
          value={item}
          color="secondary"
          checked={selectedRatings.includes(item.toString())}
          label={<Rating value={item} outof={5} color="warn" />}
          onChange={() => handleRatingChange(item)}
        />
      ))}

      <Divider my="24px" />

      {/* COLORS FILTER */}
      <H6 mb="16px">Colors</H6>
      <FlexBox mb="1rem">
        {colorList.map((item, ind) => (
          <Avatar key={ind} bg={item} size={25} mr="10px" style={{ cursor: "pointer" }} />
        ))}
      </FlexBox>
    </Card>
  );
}

const categoryList = [
  { title: "Bath Preparations", child: ["Bubble Bath", "Bath Capsules", "Others"] },
  { title: "Eye Makeup Preparations" },
  { title: "Fragrance" },
  { title: "Hair Preparations" }
];

const otherOptions = ["On Sale", "In Stock", "Featured"];
const brandList = ["Maccs", "Karts", "Baars", "Bukks", "Luasis"];
const colorList = ["#1C1C1C", "#FF7A7A", "#FFC672", "#84FFB5", "#70F6FF", "#6B7AFF"];
