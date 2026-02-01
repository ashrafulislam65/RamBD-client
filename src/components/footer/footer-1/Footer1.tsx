import Link from "next/link";
import Box from "@component/Box";
import Image from "@component/Image";
import Grid from "@component/grid/Grid";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import Container from "@component/Container";
import Typography, { Paragraph } from "@component/Typography";

// STYLED COMPONENTS
import { StyledLink } from "./styles";
// CUSTOM DATA
import { usefulLinks, generalLinks, iconList } from "./data";

export default function Footer1() {
  return (
    <Box as="footer" bg="#0F3460">
      <Container p="1rem" color="white">
        <Box py="5rem" overflow="hidden">
          <Grid container spacing={6}>
            <Grid item lg={4} md={6} sm={6} xs={12}>
              <Link href="/">
                <Image
                  alt="RamBD Logo"
                  mb="1.25rem"
                  src="/assets/images/rambd_logo.webp"
                  height={40}
                />
              </Link>
              <Typography py="0.3rem" mb="1rem" color="gray.500">
                Phone: +880 1847-117888
              </Typography>
            </Grid>

            <Grid item lg={2} md={6} sm={6} xs={12}>
              <Typography mb="1.25rem" lineHeight="1" fontSize={20} fontWeight="600">
                USEFUL LINK
              </Typography>

              <div>
                {usefulLinks.map((item, ind) => (
                  <StyledLink href="/" key={ind}>
                    {item}
                  </StyledLink>
                ))}
              </div>
            </Grid>

            <Grid item lg={3} md={6} sm={6} xs={12}>
              <Typography mb="1.25rem" lineHeight="1" fontSize={20} fontWeight="600">
                LINK
              </Typography>

              <div>
                {generalLinks.map((item, ind) => (
                  <StyledLink href="/" key={ind}>
                    {item}
                  </StyledLink>
                ))}
              </div>
            </Grid>

            <Grid item lg={3} md={6} sm={6} xs={12}>
              <Typography mb="1.25rem" lineHeight="1" fontSize={20} fontWeight="600">
                FOLLOW US
              </Typography>

              <FlexBox className="flex" mx="-5px">
                {iconList.map((item) => (
                  <a
                    href={item.url}
                    target="_blank"
                    key={item.iconName}
                    rel="noreferrer noopenner">
                    <Box m="5px" p="10px" size="small" borderRadius="50%" bg="rgba(0,0,0,0.2)">
                      <Icon size="12px" defaultcolor="auto">
                        {item.iconName}
                      </Icon>
                    </Box>
                  </a>
                ))}
              </FlexBox>
            </Grid>
          </Grid>
        </Box>

        <Box py="1rem" borderTop="1px solid rgba(255,255,255,0.1)">
          <Typography color="gray.500" textAlign="center" fontSize={14}>
            Copyright © 2026 RamBD. All rights reserved | Website Designed by: IGL Web Ltd
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
