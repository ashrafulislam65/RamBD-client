"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import Login from "@sections/auth/Login";

import Box from "@component/Box";
import Image from "@component/Image";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import Menu from "@component/Menu";
import MenuItem from "@component/MenuItem";
import MiniCart from "@component/mini-cart";
import Container from "@component/Container";
import Typography, { H2, H3, Tiny } from "@component/Typography";
import { IconButton } from "@component/buttons";
import Sidenav from "@component/sidenav/Sidenav";
import Categories from "@component/categories/Categories";
import { SearchInputWithCategory } from "@component/search-box";
import { useAppContext } from "@context/app-context";
import StyledHeader from "./styles";
import UserLoginDialog from "./LoginDialog";
import ChangePasswordModal from "@sections/customer-dashboard/profile/ChangePasswordModal";

// ====================================================================
type HeaderProps = { isFixed?: boolean; className?: string };
// =====================================================================

export default function Header({ isFixed, className }: HeaderProps) {
  const router = useRouter();
  const { state, dispatch } = useAppContext();
  const [openChangePassword, setOpenChangePassword] = useState(false);

  const toggleSidenav = () => dispatch({ type: "TOGGLE_CART" });

  const CART_HANDLE = (
    <Box ml="20px" position="relative">
      <IconButton bg="gray.200" p="12px" size="small">
        <Icon size="20px">bag</Icon>
      </IconButton>

      {!!state.cart.length && (
        <FlexBox
          top={-5}
          right={-5}
          height={20}
          minWidth={20}
          bg="primary.main"
          borderRadius="50%"
          alignItems="center"
          position="absolute"
          justifyContent="center">
          <Tiny color="white" fontWeight="600" lineHeight={1}>
            {state.cart.reduce((acc, item) => acc + item.qty, 0)}
          </Tiny>
        </FlexBox>
      )}
    </Box>
  );

  const LOGIN_HANDLE = state.user ? (
    <IconButton ml="1rem" bg="gray.200" p="4px 12px" style={{ borderRadius: '20px' }}>
      <FlexBox alignItems="center">
        <Icon size="20px">user</Icon>
        <Typography ml="8px" fontWeight="600" fontSize="14px">
          {(() => {
            const parts = state.user.name.split(' ');
            if ((parts[0].toLowerCase() === 'md.' || parts[0].toLowerCase() === 'md') && parts.length > 1) {
              return parts.slice(0, 2).join(' ');
            }
            return parts[0];
          })()}
        </Typography>
      </FlexBox>
    </IconButton>
  ) : (
    <IconButton ml="1rem" bg="gray.200" p="8px">
      <Icon size="28px">user</Icon>
    </IconButton>
  );

  const handleLogout = () => {
    localStorage.removeItem("rambd_user");
    dispatch({ type: "LOGOUT" });
    window.location.href = "/";
  };

  return (
    <StyledHeader className={className}>
      <Container display="flex" alignItems="center" justifyContent="space-between" height="100%">
        <FlexBox className="logo" alignItems="center" mr="1rem">
          <Link href="/">
            <FlexBox alignItems="center">
              <Image src="/assets/images/rambd_logo.webp" alt="RamBD Logo" height={44} />
              <H2 fontWeight="700" ml="10px" color="primary.main" fontSize="40px" fontFamily="'Arial Black', sans-serif">
                Ram<span style={{ color: "#27ae60" }}>BD</span>
              </H2>
            </FlexBox>
          </Link>

        </FlexBox>

        <FlexBox justifyContent="center" flex="1 1 0">
          <SearchInputWithCategory />
        </FlexBox>

        <FlexBox className="header-right" alignItems="center" position="relative">
          {state.user ? (
            <FlexBox alignItems="center">
              <Menu handler={LOGIN_HANDLE} direction="right">
                <Link href="/profile">
                  <MenuItem>
                    <Icon size="16px" mr="10px">user</Icon>
                    Profile
                  </MenuItem>
                </Link>

                <Link href="/orders">
                  <MenuItem>
                    <Icon size="16px" mr="10px">bag</Icon>
                    Order History
                  </MenuItem>
                </Link>

                <MenuItem onClick={() => setOpenChangePassword(true)}>
                  <Icon size="16px" mr="10px">key</Icon>
                  Change Password
                </MenuItem>

                <MenuItem onClick={handleLogout} style={{ color: '#e74c3c' }}>
                  <Icon size="16px" mr="10px">logout</Icon>
                  Logout
                </MenuItem>
              </Menu>
            </FlexBox>
          ) : (
            <UserLoginDialog handle={LOGIN_HANDLE}>
              <div>
                <Login />
              </div>
            </UserLoginDialog>
          )}

          <Sidenav
            open={state.isCartOpen}
            width={380}
            position="right"
            handle={CART_HANDLE}
            toggleSidenav={toggleSidenav}>
            <MiniCart toggleSidenav={toggleSidenav} />
          </Sidenav>
        </FlexBox>
      </Container>

      <ChangePasswordModal
        open={openChangePassword}
        onClose={() => setOpenChangePassword(false)}
      />
    </StyledHeader>
  );
}
