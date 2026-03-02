"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import MiniCart from "@component/mini-cart";
import { H3, Tiny } from "@component/Typography";
import { IconButton } from "@component/buttons";
import Sidenav from "@component/sidenav/Sidenav";
import { SearchInput } from "@component/search-box";
import { useAppContext } from "@context/app-context";
import MobileNavSidebar from "./MobileNavSidebar";
import StyledHeader from "./styles";

type HeaderProps = { className?: string };

export default function HeaderTwo({ className }: HeaderProps) {
  const { state, dispatch } = useAppContext();
  const toggleSidenav = () => dispatch({ type: "TOGGLE_CART" });
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const CART_HANDLE = (
    <FlexBox ml="20px" alignItems="flex-start">
      <IconButton bg="gray.200" p="12px">
        <Icon size="20px">bag</Icon>
      </IconButton>
      {!!state.cart.length && (
        <FlexBox px="5px" py="2px" mt="-9px" ml="-1rem" bg="primary.main"
          alignItems="center" borderRadius="300px" justifyContent="center">
          <Tiny color="white" fontWeight="600">
            {state.cart.reduce((acc, item) => acc + item.qty, 0)}
          </Tiny>
        </FlexBox>
      )}
    </FlexBox>
  );

  return (
    <StyledHeader className={className}>
      <div className="rb-nav-row">
        {/* LOGO */}
        <Link href="/" className="rb-logo-wrap">
          <Image
            src="/assets/images/rambd_logo.webp"
            alt="RamBD Logo"
            width={60}
            height={60}
            priority
            className="rb-logo-img"
          />
          <H3 color="primary.main" className="rb-logo-text">
            Ram<span style={{ color: "#27ae60" }}>BD</span>
          </H3>
        </Link>

        {/* SEARCH */}
        <div className="rb-search">
          <SearchInput />
        </div>

        {/* DESKTOP SECTION */}
        <div className="rb-desktop">
          <Link href="/login">
            <IconButton ml="1rem" bg="gray.200" p="8px">
              <Icon size="28px">user</Icon>
            </IconButton>
          </Link>
          <Sidenav
            open={state.isCartOpen}
            width={380}
            position="right"
            handle={CART_HANDLE}
            toggleSidenav={toggleSidenav}
          >
            <MiniCart toggleSidenav={toggleSidenav} />
          </Sidenav>
        </div>

        {/* MOBILE HAMBURGER */}
        <button
          className="rb-hamburger"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <MobileNavSidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </StyledHeader>
  );
}
