"use client";

import { useRouter } from "next/navigation";
import * as yup from "yup";
import { Formik } from "formik";
// GLOBAL CUSTOM COMPONENTS
import Box from "@component/Box";
import Grid from "@component/grid/Grid";
import Modal from "@component/Modal";
import { Button } from "@component/buttons";
import TextField from "@component/text-field";
import Typography, { Span } from "@component/Typography";
// PAGE SECTION COMPONENTS
import CheckoutForm from "@sections/checkout/CheckoutForm";
import CheckoutSummary from "@sections/checkout/CheckoutSummary";
// CUSTOM HOOK
import { useAppContext } from "@context/app-context";
import checkoutApi from "@utils/__api__/checkout";
import { useState } from "react";

import Swal from "sweetalert2";

export default function Checkout() {
  const router = useRouter();
  const { state, dispatch } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [orderPayload, setOrderPayload] = useState<any>(null);

  const handleFormSubmit = async (values: any) => {
    // scale payload
    const orderData = {
      order_details: {
        ord_name: values.full_name,
        ord_phone: values.phone,
        email: "",
        ord_note: values.special_note,
        shipping_cost: values.shipping_cost,
        ord_address: values.address,
        district_id: values.district,
        thana_id: values.thana,
        payment_method: values.payment_method
      },
      product_details: state.cart.map((item) => ({
        id: item.id,
        product_qty: item.qty,
        sale_price: item.price,
        product_total_price: item.price * item.qty
      })),
      is_emi_available: "0"
    };

    setOrderPayload(orderData);

    // Generate OTP
    setLoading(true);
    const otpResponse = await checkoutApi.generateOtp(values.phone);
    setLoading(false);

    if (otpResponse && (otpResponse.status || otpResponse.success)) {
      setIsOtpModalOpen(true);
      Swal.fire({
        icon: 'success',
        title: 'OTP Sent',
        text: 'OTP sent to your phone number.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to generate OTP. Please try again.'
      });
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    const otpResponse = await checkoutApi.generateOtp(orderPayload.order_details.ord_phone);
    setLoading(false);

    if (otpResponse && (otpResponse.status || otpResponse.success)) {
      Swal.fire({
        icon: 'success',
        title: 'OTP Resent',
        text: 'A new OTP has been sent to your phone.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to resend OTP. Please try again.'
      });
    }
  };

  const handleOtpConfirm = async () => {
    if (!otp) {
      Swal.fire('Error', 'Please enter the OTP.', 'error');
      return;
    }

    setLoading(true);
    const finalPayload = { ...orderPayload, otp };

    const response = await checkoutApi.placeOrder(finalPayload);

    if (response && response.success) {
      dispatch({ type: "RESTORE_CART", payload: [] });
      localStorage.removeItem("cart");

      setIsOtpModalOpen(false);

      Swal.fire({
        icon: 'success',
        title: 'Order Placed!',
        text: 'Your order has been successfully placed.',
        showConfirmButton: true,
        confirmButtonText: 'View Invoice'
      }).then((result) => {
        if (result.isConfirmed) {
          // Assuming response contains order_id or id. Adjust based on actual API response.
          // If ID is not in response, redirect to generic orders page.
          const orderId = response.order_id || response.id || response.data?.id;
          if (orderId) {
            router.push(`/orders/${orderId}`);
          } else {
            router.push("/orders");
          }
        } else {
          router.push("/orders");
        }
      });

    } else {
      Swal.fire('Error', response?.message || "Failed to place order. Please try again.", 'error');
    }
    setLoading(false);
  };

  if (state.cart.length === 0) {
    return (
      <Box mb="2rem" textAlign="center" mt="4rem">
        <Typography fontSize="28px" fontWeight="700" mb="1rem">
          Your cart is empty
        </Typography>
        <Typography fontSize="16px" color="text.muted" mb="2rem">
          Please add some items to your cart to proceed with checkout.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/")}
        >
          Continue Shopping
        </Button>
      </Box>
    );
  }

  return (
    <Box mb="2rem">
      <Box mb="2rem">
        <Typography fontSize="14px" color="text.muted" mb="0.5rem">
          <Span color="primary.main">🏠</Span> / Checkout
        </Typography>
        <Typography fontSize="28px" fontWeight="700" mb="0.5rem">
          Complete Checkout Process
        </Typography>
        <Typography fontSize="16px" color="text.muted">
          Get our <Span color="primary.main" fontWeight="600">Provide you delivery destination & get the product with super fast delivery</Span>
        </Typography>
      </Box>

      <Formik
        initialValues={initialValues}
        validationSchema={checkoutSchema}
        onSubmit={handleFormSubmit}
      >
        {(formik) => (
          <Grid container spacing={6}>
            <Grid item lg={8} md={8} xs={12}>
              <CheckoutForm formik={formik} />
            </Grid>

            <Grid item lg={4} md={4} xs={12}>
              <CheckoutSummary formik={formik} />
            </Grid>
          </Grid>
        )}
      </Formik>

      <Modal open={isOtpModalOpen} onClose={() => setIsOtpModalOpen(false)}>
        <Box p="2rem" bg="white" borderRadius="8px" maxWidth="400px" width="100%">
          <Typography fontSize="22px" fontWeight="700" mb="1rem" textAlign="center">
            Verify Your Phone
          </Typography>
          <Typography fontSize="14px" color="text.muted" mb="1.5rem" textAlign="center">
            An OTP has been sent to your phone number. Please enter it below to confirm your order.
          </Typography>

          <TextField
            fullwidth
            placeholder="Enter OTP"
            mb="1.5rem"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <Button
            variant="contained"
            color="primary"
            fullwidth
            onClick={handleOtpConfirm}
            disabled={loading}
            mb="1rem"
          >
            {loading ? "Confirming..." : "Confirm & Place Order"}
          </Button>

          <Button
            variant="outlined"
            color="primary"
            fullwidth
            onClick={handleResendOtp}
            disabled={loading}
          >
            Resend OTP
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

const initialValues = {
  phone: "",
  full_name: "",
  district: "",
  thana: "",
  address: "",
  special_note: "",
  payment_method: "cod",
  agree: false,
  shipping_cost: 0
};

const checkoutSchema = yup.object().shape({
  full_name: yup.string().required("Name is required"),
  phone: yup.string().required("Phone is required"),
  district: yup.string().required("District is required"),
  thana: yup.string().required("Thana is required"),
  address: yup.string().required("Address is required"),
  agree: yup.bool().oneOf([true], "You must agree to the terms and conditions")
});
