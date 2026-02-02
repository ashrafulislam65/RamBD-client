"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
// REACT ICONS
import { FaFacebookF, FaWhatsapp, FaTelegramPlane, FaLink, FaPhoneAlt, FaPlus, FaMinus } from "react-icons/fa";
import { IoCartOutline, IoBagCheckOutline } from "react-icons/io5";

import Box from "@component/Box";
import Grid from "@component/grid/Grid";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import Avatar from "@component/avatar";
import { H1, H3, H4, SemiSpan, Paragraph, Span } from "@component/Typography";
import { useAppContext } from "@context/app-context";
import { currency } from "@utils/utils";
import Product from "models/product.model";
import { theme } from "@utils/theme";

// ========================================
interface Props {
  price: number;
  title: string;
  images: string[];
  id: string | number;
  brand?: string;
  status?: string;
  model?: string;
  product_code?: string;
  categoryName?: string;
  visitors?: number;
  latestProducts?: Product[];
}
// ========================================

export default function ProductIntro({
  images,
  title,
  price,
  id,
  brand,
  status,
  model,
  product_code,
  categoryName,
  visitors,
  latestProducts
}: Props) {
  const router = useRouter();
  const param = useParams();
  const { state, dispatch } = useAppContext();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // ZOOM STATE
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomPos({ x, y });
  };

  const routerId = param.slug as string;
  const cartItem = state.cart.find((item) => item.id === id || item.id === routerId);

  // Sync quantity with cart
  useEffect(() => {
    if (cartItem?.qty) {
      setQuantity(cartItem.qty);
    }
  }, [cartItem?.qty]);

  const handleImageClick = (ind: number) => () => setSelectedImage(ind);

  const handleCartAmountChange = (amount: number) => {
    dispatch({
      type: "CHANGE_CART_AMOUNT",
      payload: {
        price,
        qty: amount,
        name: title,
        imgUrl: images[0],
        id: id || routerId
      }
    });
  };

  const handleBuyNow = () => {
    handleCartAmountChange(quantity);
    router.push("/checkout");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  // FAKE WATCHING COUNT BASED ON VISITORS
  const watchingCount = visitors ? (visitors % 15) + 3 : 5;

  return (
    <Box overflow="hidden">
      <Grid container spacing={4}>
        <Grid item md={9} xs={12}>
          <Box bg="white" p="1.5rem" borderRadius={8} shadow={1}>
            <Grid container spacing={6}>
              {/* IMAGE GALLERY */}
              <Grid item md={6} xs={12}>
                <FlexBox
                  mb="20px"
                  overflow="hidden"
                  borderRadius={8}
                  border="1px solid"
                  borderColor="gray.300"
                  justifyContent="center"
                  position="relative"
                  style={{ cursor: "zoom-in" }}
                  onMouseEnter={() => setShowZoom(true)}
                  onMouseLeave={() => setShowZoom(false)}
                  onMouseMove={handleMouseMove}
                >
                  <Image
                    width={400}
                    height={400}
                    src={images[selectedImage]}
                    priority
                    alt={title}
                    style={{ display: "block", width: "100%", height: "auto", objectFit: "contain" }}
                  />

                  {/* ZOOM OVERLAY */}
                  {showZoom && (
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      width="100%"
                      height="100%"
                      bg="white"
                      style={{
                        zIndex: 10,
                        backgroundImage: `url(${images[selectedImage]})`,
                        backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                        backgroundSize: "250%",
                        backgroundRepeat: "no-repeat",
                        pointerEvents: "none",
                        borderRadius: 8
                      }}
                    />
                  )}
                </FlexBox>

                <FlexBox style={{ gap: 10 }} overflow="auto">
                  {images.map((url, ind) => (
                    <Box
                      key={ind}
                      size={80}
                      bg="white"
                      minWidth={80}
                      display="flex"
                      cursor="pointer"
                      border="1px solid"
                      borderRadius="4px"
                      alignItems="center"
                      justifyContent="center"
                      borderColor={selectedImage === ind ? "primary.main" : "gray.300"}
                      onClick={handleImageClick(ind)}>
                      <Avatar src={url} borderRadius="4px" size={75} />
                    </Box>
                  ))}
                </FlexBox>
              </Grid>

              {/* PRODUCT INFO */}
              <Grid item md={6} xs={12}>
                <H1 mb="0.5rem" color="secondary.main">{title}</H1>
                <H4 color="primary.main" mb="1rem">{currency(price)}</H4>

                <Box mb="1.5rem">
                  <FlexBox alignItems="center" mb="8px">
                    <SemiSpan color="text.muted" mr="8px">In Stock:</SemiSpan>
                    <SemiSpan fontWeight="600" color="success.main">{status || "Yes"}</SemiSpan>
                  </FlexBox>

                  <FlexBox alignItems="center" mb="8px">
                    <SemiSpan color="text.muted" mr="8px">Model:</SemiSpan>
                    <SemiSpan fontWeight="600">{model || "N/A"}</SemiSpan>
                  </FlexBox>

                  <FlexBox alignItems="center" mb="8px">
                    <SemiSpan color="text.muted" mr="8px">Brand:</SemiSpan>
                    <SemiSpan fontWeight="600">{brand || "Felna Tech"}</SemiSpan>
                  </FlexBox>

                  <FlexBox alignItems="center" mb="8px">
                    <SemiSpan color="text.muted" mr="8px">Code:</SemiSpan>
                    <SemiSpan fontWeight="600">{product_code || id}</SemiSpan>
                  </FlexBox>

                  <FlexBox alignItems="center" mb="20px" mt="20px">
                    <SemiSpan fontWeight="700" color="secondary.main" mr="8px">Category:</SemiSpan>
                    <SemiSpan fontWeight="700" color="text.muted">{categoryName || "General"}</SemiSpan>
                  </FlexBox>

                  <FlexBox alignItems="center" mt="20px" bg="gray.100" p="8px 12px" borderRadius="8px" style={{ width: "fit-content" }}>
                    <Icon size="18px" color="primary" mr="10px">eye</Icon>
                    <SemiSpan fontWeight="600" color="success.main">
                      {watchingCount} people are watching this product now
                    </SemiSpan>
                  </FlexBox>
                </Box>

                {/* QUANTITY SELECTOR (Moved Above Buttons) */}
                <Box mb="1.5rem">
                  <SemiSpan fontWeight="600" mb="8px" display="block">Quantity:</SemiSpan>
                  <FlexBox
                    alignItems="center"
                    justifyContent="space-between"
                    p="4px"
                    borderRadius="4px"
                    style={{ border: `1px solid ${theme.colors.gray[300]}`, width: 120, height: 44 }}>
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => {
                        const newQty = Math.max(1, (cartItem?.qty || quantity) - 1);
                        setQuantity(newQty);
                        if (cartItem) {
                          handleCartAmountChange(newQty);
                        }
                      }}>
                      <FaMinus size={14} />
                    </Button>
                    <H3 fontWeight="600">{cartItem?.qty || quantity}</H3>
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => {
                        const newQty = (cartItem?.qty || quantity) + 1;
                        setQuantity(newQty);
                        if (cartItem) {
                          handleCartAmountChange(newQty);
                        }
                      }}>
                      <FaPlus size={14} />
                    </Button>
                  </FlexBox>
                </Box>

                <Box mb="1.5rem">
                  <FlexBox style={{ gap: 16 }}>
                    <Button
                      size="medium"
                      color="primary"
                      variant="contained"
                      onClick={() => handleCartAmountChange(cartItem?.qty || quantity)}
                      style={{ minWidth: 160, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IoCartOutline size={22} style={{ marginRight: 8 }} />
                      ADD TO CART
                    </Button>

                    <Button
                      size="medium"
                      color="secondary"
                      variant="contained"
                      onClick={handleBuyNow}
                      style={{ minWidth: 160, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IoBagCheckOutline size={20} style={{ marginRight: 8 }} />
                      BUY NOW
                    </Button>
                  </FlexBox>
                </Box>

                <Box mb="1.5rem">
                  <FlexBox alignItems="center" style={{ gap: 10 }}>
                    <SemiSpan fontWeight="600" color="secondary.main">For Inquiry: +880-1958-666975</SemiSpan>
                    <Box cursor="pointer" bg="#25D366" borderRadius="50%" p="6px" display="flex" alignItems="center" justifyContent="center">
                      <FaWhatsapp size={18} color="white" />
                    </Box>
                    <Box cursor="pointer" bg="#3498DB" borderRadius="50%" p="6px" display="flex" alignItems="center" justifyContent="center">
                      <FaPhoneAlt size={16} color="white" />
                    </Box>
                  </FlexBox>
                </Box>

                <Box>
                  <H4 mb="10px">Share This Product On Social Media</H4>
                  <FlexBox style={{ gap: 12 }}>
                    <Box cursor="pointer" bg="#3B5998" borderRadius="50%" width={35} height={35} display="flex" alignItems="center" justifyContent="center">
                      <FaFacebookF size={18} color="white" />
                    </Box>
                    <Box cursor="pointer" bg="#25D366" borderRadius="50%" width={35} height={35} display="flex" alignItems="center" justifyContent="center">
                      <FaWhatsapp size={20} color="white" />
                    </Box>
                    <Box cursor="pointer" bg="#0088CC" borderRadius="50%" width={35} height={35} display="flex" alignItems="center" justifyContent="center">
                      <FaTelegramPlane size={18} color="white" />
                    </Box>
                    <Box cursor="pointer" bg="#7f8c8d" borderRadius="50%" width={35} height={35} display="flex" alignItems="center" justifyContent="center" onClick={copyToClipboard}>
                      <FaLink size={16} color="white" />
                    </Box>
                  </FlexBox>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* SIDEBAR LATEST PRODUCTS */}
        <Grid item md={3} xs={12}>
          <Box bg="white" p="1rem" borderRadius={8} shadow={1}>
            <H4 mb="1rem">Our Latest Products</H4>

            <Box>
              {latestProducts?.slice(0, 6).map((item) => (
                <Link href={`/product/${item.slug}`} key={item.id}>
                  <FlexBox
                    alignItems="center"
                    padding="10px"
                    style={{ gap: 12, border: "1px solid", borderColor: theme.colors.gray[200], borderRadius: 8, marginBottom: 12 }}
                  >
                    <Box size={50} minWidth={50}>
                      <Image
                        width={50}
                        height={50}
                        alt={item.title}
                        src={item.thumbnail}
                        style={{ objectFit: "contain", borderRadius: 4 }}
                      />
                    </Box>
                    <Box overflow="hidden">
                      <Paragraph
                        fontSize={13}
                        fontWeight="600"
                        color="secondary.main"
                        ellipsis
                      >
                        {item.title}
                      </Paragraph>
                      <Paragraph fontSize={12} color="primary.main" fontWeight="600">
                        {currency(item.price)}
                      </Paragraph>
                    </Box>
                  </FlexBox>
                </Link>
              ))}
            </Box>

            <Link href="/#latest-products">
              <FlexBox alignItems="center" color="success.main" style={{ gap: 4, cursor: "pointer", marginTop: "1rem" }}>
                <Span fontWeight="600" fontSize={13}>See All Latest Products</Span>
                <Icon size="12px">right-arrow</Icon>
              </FlexBox>
            </Link>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
