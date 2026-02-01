"use client";

import { Fragment } from "react";
import Image from "next/image";
import Box from "@component/Box";
import { Card1 } from "@component/Card1";
import Avatar from "@component/avatar";
import Divider from "@component/Divider";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import TextField from "@component/text-field";
import Typography, { H6 } from "@component/Typography";
import CheckBox from "@component/CheckBox";
import Radio from "@component/radio";
import { useAppContext } from "@context/app-context";
import { currency } from "@utils/utils";

export default function CheckoutSummary({ formik }: { formik: any }) {
  const { state } = useAppContext();
  const { values, setFieldValue, handleSubmit, handleChange } = formik;

  const getTotalPrice = () => {
    return state.cart.reduce((accumulator, item) => accumulator + item.price * item.qty, 0) || 0;
  };

  return (
    <Card1>
      <FlexBox justifyContent="space-between" mb="1rem">
        <Typography fontSize="14px" fontWeight="600" color="text.muted">Product</Typography>
        <FlexBox>
          <Typography fontSize="14px" fontWeight="600" color="text.muted" mr="2rem">Qty</Typography>
          <Typography fontSize="14px" fontWeight="600" color="text.muted">Price</Typography>
        </FlexBox>
      </FlexBox>

      <Divider mb="1rem" />

      {state.cart.map((item) => (
        <FlexBox justifyContent="space-between" alignItems="center" mb="1rem" key={item.id}>
          <FlexBox alignItems="center">
            <Avatar
              src={item.imgUrl || "/assets/images/products/iphone-x.png"}
              size={40}
              mr="10px"
            />
            <Typography fontSize="13px" fontWeight="600" maxWidth="150px">
              {item.name}
            </Typography>
          </FlexBox>

          <FlexBox alignItems="center">
            <Typography fontSize="14px" fontWeight="700" mr="2.5rem">
              {item.qty}
            </Typography>
            <Typography fontSize="14px" fontWeight="600" color="primary.main">
              {currency(item.price * item.qty, 0)}
            </Typography>
          </FlexBox>
        </FlexBox>
      ))}

      <Divider mb="1rem" mt="1.5rem" />

      <FlexBox justifyContent="space-between" alignItems="center" mb="0.75rem">
        <Typography fontSize="14px" fontWeight="600">Discount</Typography>
        <Typography fontSize="14px" fontWeight="600" color="primary.main">0</Typography>
      </FlexBox>

      <FlexBox justifyContent="space-between" alignItems="center" mb="0.75rem">
        <Typography fontSize="14px" fontWeight="600">Promotion Discount</Typography>
        <Typography fontSize="14px" fontWeight="600" color="primary.main">0</Typography>
      </FlexBox>

      <FlexBox justifyContent="space-between" alignItems="center" mb="0.75rem">
        <Typography fontSize="14px" fontWeight="600">Shipping Cost</Typography>
        <Typography fontSize="14px" fontWeight="600" color="primary.main">
          {currency(values.shipping_cost || 0, 0)}
        </Typography>
      </FlexBox>

      <Divider mb="1rem" />

      <FlexBox justifyContent="space-between" alignItems="center" mb="1.5rem">
        <Typography fontSize="16px" fontWeight="700">Total Price</Typography>
        <Typography fontSize="16px" fontWeight="700" color="primary.main">
          {currency(getTotalPrice() + (values.shipping_cost || 0), 0)} TK
        </Typography>
      </FlexBox>

      <Box mb="1.5rem">
        <CheckBox
          name="agree"
          color="primary"
          onChange={handleChange}
          checked={values.agree}
          label={
            <Typography fontSize="14px" color="text.hint" sx={{ cursor: "pointer", userSelect: "none", fontWeight: 700 }}>
              I have read and agree to the <span style={{ color: "#2ba56d" }}>terms and conditions</span> & <span style={{ color: "#2ba56d" }}>privacy policy</span> & <span style={{ color: "#2ba56d" }}>return & refund policy</span>
            </Typography>
          }
        />
      </Box>

      <Box mb="2rem">
        <FlexBox alignItems="center" flexWrap="wrap">
          <Typography fontSize="16px" fontWeight="700" color="text.primary" mr="1.5rem">
            Payment Methods:
          </Typography>

          <FlexBox alignItems="center">
            <Radio
              id="payment-cod"
              name="payment_method"
              color="primary"
              label={
                <Typography ml="8px" mr="1.5rem" fontSize="14px" fontWeight="700" color="text.primary">
                  Cash On Delivery
                </Typography>
              }
              value="cod"
              checked={values.payment_method === "cod"}
              onChange={handleChange}
            />

            <Radio
              id="payment-card"
              name="payment_method"
              color="primary"
              label={
                <Typography ml="8px" mr="1.5rem" fontSize="14px" fontWeight="700" color="text.primary">
                  Bank / Card
                </Typography>
              }
              value="card"
              checked={values.payment_method === "card"}
              onChange={handleChange}
            />

            <Radio
              id="payment-bkash"
              name="payment_method"
              color="primary"
              label={
                <FlexBox alignItems="center" ml="8px">
                  <Typography fontSize="14px" fontWeight="700" color="text.primary" mr="8px">
                    bKash
                  </Typography>
                  <svg width="24" height="24" viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg">
                    <path d="M96.7 4.1c-1.2-1.2-3.2-1.2-4.4 0L67.1 29.3c-1.2 1.2-1.2 3.2 0 4.4L92.3 59c1.2 1.2 3.2 1.2 4.4 0l1.3-1.3c1.2-1.2 1.2-3.2 0-4.4L78.6 33.7c-1.2-1.2-1.2-3.2 0-4.4l11.4-11.4c1.2-1.2 1.2-3.2 0-4.4l-1.3-1.3c-.6-.6-1.5-.9-2.2-.9s-1.6.3-2.2.9L73.4 23.5c-1.2 1.2-3.2 1.2-4.4 0L43.8 17.1c-1.2 1.2-1.2 3.2 0 4.4l13.1 13.1c1.2 1.2 1.2 3.2 0 4.4L44.2 51.7c-1.2 1.2-1.2 3.2 0 4.4l6.4 6.4c1.2 1.2 3.2 1.2 4.4 0l13.1-13.1c1.2-1.2 3.2-1.2 4.4 0l13.1 13.1c1.2 1.2 3.2 1.2 4.4 0l1.3-1.3c1.2-1.2 1.2-3.2 0-4.4L78.6 44.1c-1.2-1.2-1.2-3.2 0-4.4l11.4-11.4c1.2-1.2 1.2-3.2 0-4.4l-1.3-1.3z" fill="#E2136E" />
                  </svg>
                </FlexBox>
              }
              value="bkash"
              checked={values.payment_method === "bkash"}
              onChange={handleChange}
            />
          </FlexBox>
        </FlexBox>
      </Box>

      <Button
        variant="contained"
        color="primary"
        fullwidth
        size="large"
        onClick={handleSubmit}
        disabled={!values.agree || state.cart.length === 0}
        style={{ borderRadius: "8px", height: "50px", fontSize: "16px", fontWeight: "700" }}
      >
        Proceed To Confirm Order
      </Button>
    </Card1>
  );
}
