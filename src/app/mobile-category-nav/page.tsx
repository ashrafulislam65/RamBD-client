"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import clsx from "clsx";
// GLOBAL CUSTOM COMPONENTS
import Box from "@component/Box";
import Grid from "@component/grid/Grid";
import Icon from "@component/icon/Icon";
import Divider from "@component/Divider";
import { Header } from "@component/header";
import Scrollbar from "@component/Scrollbar";
import Typography from "@component/Typography";
import MobileNavigationBar from "@component/mobile-navigation";
import { Accordion, AccordionHeader } from "@component/accordion";
// CUSTOM HOOK
import useWindowSize from "@hook/useWindowSize";
// API UTILS
import navbarApi from "@utils/__api__/navbar";

import { MobileCategoryNavStyle } from "./styles";
import MobileCategoryImageBox from "./MobileCategoryImageBox";

// ==============================================================
interface NavItem {
  title: string;
  icon: string;
  href: string;
  children?: NavItem[];
}
// ==============================================================

export default function MobileCategoryNav() {
  const width = useWindowSize();
  const [category, setCategory] = useState<NavItem | null>(null);
  const [navList, setNavList] = useState<NavItem[]>([]);
  const [subCategoryList, setSubCategoryList] = useState<NavItem[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await navbarApi.getNavbarServices();
        if (!data || !data.menu) return;

        const filteredMenus = data.menu.filter((m: any) => Number(m.checked) === 1);
        const sortedMenus = filteredMenus.sort((a: any, b: any) => Number(a.menu_order) - Number(b.menu_order));

        const childMap: Record<string | number, any[]> = {};
        if (Array.isArray(data.subCategory)) {
          data.subCategory.forEach((sub: any) => {
            if (sub.parent_id) {
              if (!childMap[sub.parent_id]) childMap[sub.parent_id] = [];
              childMap[sub.parent_id].push(sub);
            }
          });
        }

        const mapSubCategories = (subs?: any[]): NavItem[] | undefined => {
          return subs?.map(sub => {
            const children = sub.sub_categories || sub.category_sub_categories || sub.children || childMap[sub.id];
            return {
              title: sub.cate_name,
              href: `/category/${sub.cate_slug}`,
              icon: "dot", // Mobile icons for subcats are usually dots or similar
              children: mapSubCategories(children)
            };
          });
        };

        const mappedNavs: NavItem[] = sortedMenus.map((m: any) => ({
          title: m.category.cate_name,
          href: `/category/${m.category.cate_slug}`,
          icon: m.category.cate_icon || "dress", // Use dress as default if missing
          children: mapSubCategories(m.category.sub_categories || m.category.category_sub_categories || m.category.children || childMap[m.category.id])
        }));

        setNavList(mappedNavs);
        if (mappedNavs.length > 0) {
          setCategory(mappedNavs[0]);
          setSubCategoryList(mappedNavs[0].children || []);
        }
      } catch (error) {
        console.error("Failed to fetch mobile nav categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (cat: NavItem) => () => {
    setSubCategoryList(cat.children || []);
    setCategory(cat);
  };

  // HIDDEN IN LARGE DEVICE
  if (width > 900) return null;

  return (
    <MobileCategoryNavStyle>
      <Header className="header" />

      <div className="main-category-holder">
        <Scrollbar>
          {navList.map((item) => (
            <div
              key={item.title}
              className={clsx({ "main-category-box": true, active: category?.href === item.href })}
              onClick={handleCategoryClick(item)}
            >
              <Icon size="28px" mb="0.5rem">
                {item.icon}
              </Icon>

              <Typography className="ellipsis" textAlign="center" fontSize="11px" lineHeight="1">
                {item.title}
              </Typography>
            </div>
          ))}
        </Scrollbar>
      </div>

      <div className="container">
        <Typography fontWeight="600" fontSize="15px" mb="1rem">
          {category?.title || "Categories"}
        </Typography>

        <Box mb="2rem">
          <Grid container spacing={3}>
            {subCategoryList.filter(sub => !sub.children || sub.children.length === 0).map((item, ind) => (
              <Grid item lg={1} md={2} sm={3} xs={4} key={ind}>
                <Link href={item.href}>
                  <MobileCategoryImageBox title={item.title} imgUrl="/assets/images/products/categories/default.png" />
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>

        {subCategoryList.filter(sub => sub.children && sub.children.length > 0).map((item, ind) => (
          <Fragment key={ind}>
            <Divider />
            <Accordion expanded={true}>
              <AccordionHeader px="0px" py="10px">
                <Typography fontWeight="600" fontSize="15px">
                  {item.title}
                </Typography>
              </AccordionHeader>

              <Box mb="2rem" mt="0.5rem">
                <Grid container spacing={3}>
                  {item.children?.map((subItem: any, subInd: number) => (
                    <Grid item lg={1} md={2} sm={3} xs={4} key={subInd}>
                      <Link href={subItem.href}>
                        <MobileCategoryImageBox title={subItem.title} imgUrl="/assets/images/products/categories/default.png" />
                      </Link>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Accordion>
          </Fragment>
        ))}
      </div>

      <MobileNavigationBar />
    </MobileCategoryNavStyle>
  );
}
