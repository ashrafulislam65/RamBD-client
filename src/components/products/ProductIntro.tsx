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
import { currency, calculateDiscount } from "@utils/utils";
import Product from "models/product.model";
import { theme } from "@utils/theme";

// ========================================
interface Props {
  price: number;
  regularPrice?: number;
  title: string;
  images: string[];
  id: string | number;
  brand?: string;
  status?: string;
  model?: string;
  product_code?: string;
  categoryName?: string;
  visitors?: number;
  discount?: number;
  latestProducts?: Product[];
}
// ========================================

export default function ProductIntro({
  images,
  title,
  price,
  regularPrice,
  id,
  brand,
  status,
  model,
  product_code,
  categoryName,
  visitors,
  discount,
  latestProducts
}: Props) {
  const router = useRouter();
  const param = useParams();
  const { state, dispatch } = useAppContext();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

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
    // const discountedPrice = discount ? price - (price * discount) / 100 : price;

    dispatch({
      type: "CHANGE_CART_AMOUNT",
      payload: {
        price: price, // Use the pre-calculated final price
        originalPrice: regularPrice || price,
        regularPrice: regularPrice, // Added regularPrice
        discount: discount,
        qty: amount,
        name: title,
        imgUrl: images[0],
        id: id || routerId,
        slug: param.slug as string
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
      <FlexBox flexWrap="wrap" alignItems="stretch" style={{ gap: 2 }}>
        <Box flex="1 1 0" minWidth={300}>
          <Box bg="white" p="1.5rem" borderRadius={8} shadow={1} height="100%">
            <Grid container spacing={6}>
              {/* IMAGE GALLERY */}
              <Grid item md={7} xs={12}>
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
                    width={500}
                    height={500}
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
              <Grid item md={5} xs={12}>
                <H1 mb="0.75rem" color="secondary.main" fontSize={22} fontWeight="700" style={{ lineHeight: 1.3 }}>{title}</H1>

                <FlexBox alignItems="center" mb="1rem">
                  <H3 color="primary.main" mr="12px" fontWeight="700">
                    {currency(price)}
                  </H3>
                  {(discount > 0) && (
                    <SemiSpan color="text.muted" fontWeight="600">
                      <del>{currency(regularPrice || price)}</del>
                    </SemiSpan>
                  )}
                </FlexBox>

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

                {/* QUANTITY AND BUTTONS IN ONE ROW */}
                <Box mb="1.5rem">
                  <SemiSpan fontWeight="600" mb="8px" display="block">Quantity:</SemiSpan>
                  <FlexBox alignItems="center" flexWrap="wrap" style={{ gap: 2 }}>
                    <FlexBox
                      alignItems="center"
                      justifyContent="space-between"
                      borderRadius="4px"
                      style={{ border: `1px solid ${theme.colors.gray[300]}`, width: 100, height: 40 }}>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => {
                          const newQty = Math.max(1, (cartItem?.qty || quantity) - 1);
                          setQuantity(newQty);
                          if (cartItem) {
                            handleCartAmountChange(newQty);
                          }
                        }}
                        style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                        <FaMinus size={12} />
                      </Button>
                      <H3 fontSize={16} fontWeight="600" style={{ flex: 1, textAlign: 'center' }}>{cartItem?.qty || quantity}</H3>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => {
                          const newQty = (cartItem?.qty || quantity) + 1;
                          setQuantity(newQty);
                          if (cartItem) {
                            handleCartAmountChange(newQty);
                          }
                        }}
                        style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                        <FaPlus size={12} />
                      </Button>
                    </FlexBox>

                    <Button
                      size="medium"
                      color="primary"
                      variant="contained"
                      onClick={() => handleCartAmountChange(cartItem?.qty || quantity)}
                      style={{ padding: '0 15px', height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IoCartOutline size={20} style={{ marginRight: 6 }} />
                      <Span fontSize={13} fontWeight="600">ADD TO CART</Span>
                    </Button>

                    <Button
                      size="medium"
                      color="secondary"
                      variant="contained"
                      onClick={handleBuyNow}
                      style={{ padding: '0 15px', height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IoBagCheckOutline size={18} style={{ marginRight: 6 }} />
                      <Span fontSize={13} fontWeight="600">BUY NOW</Span>
                    </Button>
                  </FlexBox>
                </Box>

                <Box mb="1.5rem">
                  <FlexBox alignItems="center" style={{ gap: 10 }}>
                    <SemiSpan fontWeight="600" color="secondary.main">For Inquiry: +880-1958-666975</SemiSpan>
                    <a href="https://wa.me/8801847117888" target="_blank" rel="noreferrer">
                      <Box cursor="pointer" bg="#25D366" borderRadius="50%" p="6px" display="flex" alignItems="center" justifyContent="center">
                        <FaWhatsapp size={18} color="white" />
                      </Box>
                    </a>
                    <a href="tel:+8801958666975">
                      <Box cursor="pointer" bg="#3498DB" borderRadius="50%" p="6px" display="flex" alignItems="center" justifyContent="center">
                        <FaPhoneAlt size={16} color="white" />
                      </Box>
                    </a>
                  </FlexBox>
                </Box>

                <Box>
                  <H4 mb="10px">Share This Product On Social Media</H4>
                  <FlexBox style={{ gap: 12 }}>
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noreferrer">
                      <Box cursor="pointer" bg="#3B5998" borderRadius="50%" width={35} height={35} display="flex" alignItems="center" justifyContent="center">
                        <FaFacebookF size={18} color="white" />
                      </Box>
                    </a>
                    <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noreferrer">
                      <Box cursor="pointer" bg="#25D366" borderRadius="50%" width={35} height={35} display="flex" alignItems="center" justifyContent="center">
                        <FaWhatsapp size={20} color="white" />
                      </Box>
                    </a>
                    <a href={`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noreferrer">
                      <Box cursor="pointer" bg="#0088CC" borderRadius="50%" width={35} height={35} display="flex" alignItems="center" justifyContent="center">
                        <FaTelegramPlane size={18} color="white" />
                      </Box>
                    </a>
                    <Box cursor="pointer" bg="#7f8c8d" borderRadius="50%" width={35} height={35} display="flex" alignItems="center" justifyContent="center" onClick={copyToClipboard}>
                      <FaLink size={16} color="white" />
                    </Box>
                  </FlexBox>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* SIDEBAR LATEST PRODUCTS */}
        <Box width="100px" flexShrink={0}>
          <Box bg="white" p="8px" borderRadius={8} shadow={1} textAlign="center" height="100%">
            <H4 fontSize={11} mb="12px" color="text.muted" style={{ lineHeight: 1.2 }}>Latest Products</H4>

            <Box>
              {latestProducts?.slice(0, 4).map((item) => (
                <Link href={`/product/${item.slug}`} key={item.id}>
                  <Box
                    padding="8px 4px"
                    mb="10px"
                    style={{ border: "1px solid", borderColor: theme.colors.gray[200], borderRadius: 8 }}
                  >
                    <Box mb="5px" display="flex" justifyContent="center">
                      <Image
                        width={70}
                        height={70}
                        alt={item.title}
                        src={item.thumbnail}
                        style={{ objectFit: "contain", borderRadius: 4 }}
                      />
                    </Box>

                    <Paragraph fontSize={11} color="primary.main" fontWeight="700">
                      {currency(item.price)}
                    </Paragraph>
                  </Box>
                </Link>
              ))}
            </Box>

            <Link href="/#latest-products">
              <Box color="success.main" cursor="pointer" mt="10px">
                <Span fontWeight="600" fontSize={10}>See All</Span>
              </Box>
            </Link>
          </Box>
        </Box>
      </FlexBox>
    </Box>
  );
}
