import Link from "next/link";
import Box from "@component/Box";
import Grid from "@component/grid/Grid";
import Container from "@component/Container";
import NextImage from "@component/NextImage";
import { H4 } from "@component/Typography";
// STYLED COMPONENTS
import { CategoryCard, CategoryTitle } from "./styles";
// API FUNCTIONS
import api from "@utils/__api__/market-2";

export default async function Section3() {
  const categories = await api.getCategories();

  return (
    <Container pt="0px">
      <Grid container spacing={0.5}>
        {(categories || []).map((item) => (
          <Grid item lg={1.2} md={2} sm={3} xs={4} key={item.id}>
            <Link href={`/category/${item.slug}`}>
              <CategoryCard style={{
                height: "100px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px",
                backgroundColor: "#fff",
                border: "1px solid #eee"
              }}>
                <Box mb="5px" display="flex" justifyContent="center">
                  <i className={item.icon} style={{ fontSize: "2.5rem", color: "#e3364e" }}></i>
                </Box>

                <H4 fontSize={13} textAlign="center" color="text.primary" fontWeight="600" style={{ lineHeight: 1.2 }}>
                  {item.name}
                </H4>
              </CategoryCard>
            </Link>
          </Grid>
        ))}

        {/* 
        <Grid item xs={12}>
          <AdWrapper>
            <AdTitle1>Black friday sale!</AdTitle1>

            <Paragraph ellipsis fontSize={28} flex={1} style={{ zIndex: 5 }}>
              <AnimatedText>
                Pay only for{" "}
                <Span
                  fontWeight={700}
                  fontSize="inherit"
                  textTransform="uppercase"
                  sx={{ textOverflow: "hidden", whiteSpace: "nowrap" }}>
                  your loving electronics
                </Span>
              </AnimatedText>
            </Paragraph>

            <Box padding="1.5rem" flexShrink={0} zIndex={5}>
              <AddButton variant="contained" color="primary">
                Shop Now
              </AddButton>
            </Box>
          </AdWrapper>
        </Grid> 
*/}
      </Grid>
    </Container>
  );
}
