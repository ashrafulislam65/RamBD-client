"use client";

import Image, { ImageProps } from "next/image";
import styled from "styled-components";
import { space, SpaceProps, compose, borderRadius, BorderRadiusProps } from "styled-system";

// ==============================================================
type NextImageProps = ImageProps & SpaceProps & BorderRadiusProps;
// ==============================================================

const NextImage = styled(Image).attrs(props => ({
  alt: props.alt || "image",
  style: { width: "100%", height: "auto" }
}))<NextImageProps>(
  compose(space, borderRadius)
);

export default NextImage;
