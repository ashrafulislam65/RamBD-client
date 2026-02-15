import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { debounce } from "lodash";

import Box from "@component/Box";
import Card from "@component/Card";
import Icon from "@component/icon/Icon";
import MenuItem from "@component/MenuItem";
import { Span } from "@component/Typography";
import TextField from "@component/text-field";
import StyledSearchBox from "./styled";


// Define the shape of the API response item
interface SearchSuggestion {
  id: number;
  product_name: string;
  slug: string;
  image: string;
}

export default function SearchInputWithCategory() {
  const [resultList, setResultList] = useState<SearchSuggestion[]>([]);

  const search = debounce(async (e) => {
    const value = e.target?.value;

    if (!value) {
      setResultList([]);
    } else {
      try {
        const response = await fetch(`https://admin.felnatech.com/products/searchsuggest?search=${value}`);
        const data = await response.json();
        // The API is expected to return an array of suggestions
        if (data.products && Array.isArray(data.products)) {
          const mappedSuggestions = data.products.map((item: any) => ({
            id: item.id,
            product_name: item.pro_title || item.title || "Unknown Product",
            slug: item.pro_slug || item.slug || "",
            image: item.images && item.images.length > 0
              ? `https://admin.felnatech.com/storage/app/public/products/${item.images[0].img_name}`
              : "/assets/images/products/macbook.png"
          }));
          setResultList(mappedSuggestions);
        } else {
          setResultList([]);
        }
      } catch (error) {
        console.error("Error fetching search suggestions:", error);
        setResultList([]);
      }
    }
  }, 200);

  const hanldeSearch = useCallback((event: any) => {
    event.persist();
    search(event);
  }, []);

  const handleDocumentClick = () => setResultList([]);

  useEffect(() => {
    window.addEventListener("click", handleDocumentClick);
    return () => window.removeEventListener("click", handleDocumentClick);
  }, []);

  return (
    <Box position="relative" flex="1 1 0" maxWidth="670px" mx="auto">
      <StyledSearchBox>
        <Icon className="search-icon" size="18px">
          search
        </Icon>

        <TextField
          fullwidth
          onChange={hanldeSearch}
          className="search-field"
          placeholder="Search and hit enter..."
        />
      </StyledSearchBox>

      {!!resultList.length && (
        <Card position="absolute" top="100%" py="0.5rem" width="100%" boxShadow="large" zIndex={99} style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {resultList.map((item) => (
            <Link href={`/product/search/${item.slug}`} key={item.id}>
              <MenuItem key={item.id}>
                <img
                  src={item.image}
                  alt={item.product_name}
                  style={{ width: 40, height: 40, objectFit: "contain", marginRight: 10 }}
                />
                <Span fontSize="14px">{item.product_name}</Span>
              </MenuItem>
            </Link>
          ))}
        </Card>
      )}
    </Box>
  );
}

// const dummySearchResult = ["Macbook Air 13", "Ksus K555LA", "Acer Aspire X453", "iPad Mini 3"];
