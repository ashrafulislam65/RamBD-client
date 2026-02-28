"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as yup from "yup";
import { useState } from "react";
import Swal from "sweetalert2";

import useVisibility from "./useVisibility";

import Box from "@component/Box";
import Icon from "@component/icon/Icon";
import Divide from "./components/Divide";
import FlexBox from "@component/FlexBox";
import TextField from "@component/text-field";
import Modal from "@component/Modal";
import { Button, IconButton } from "@component/buttons";
import Typography, { H3, H5, H6, SemiSpan } from "@component/Typography";
import { useAppContext } from "@context/app-context";
import { formatPhoneInput, validatePhoneNumber, isValidFirstDigit } from "@utils/phoneValidation";

// STYLED COMPONENT
import { StyledRoot } from "./styles";
import authApi from "@utils/__api__/auth";
import checkoutApi from "@utils/__api__/checkout";
import ForgotPasswordModal from "./components/ForgotPasswordModal";

export default function Login() {
  const router = useRouter();
  const { state: appState, dispatch } = useAppContext();
  const { passwordVisibility, togglePasswordVisibility } = useVisibility();
  const [loading, setLoading] = useState(false);
  const [openForgot, setOpenForgot] = useState(false);

  const initialValues = { phone_digits: "", password: "" };

  const formSchema = yup.object().shape({
    phone_digits: yup.string().required("Phone is required").length(9, "Enter 9 digits after +8801"),
    password: yup.string().required("Password is required")
  });

  const handleFormSubmit = async (values: any) => {
    try {
      setLoading(true);
      const fullPhone = `+8801${values.phone_digits}`;
      const payload = {
        phone: fullPhone,
        password: values.password
      };

      console.log("🚀 [LOGIN] Request:", payload);
      const response = await authApi.login(payload);
      setLoading(false);

      if (response && (response.status === 200 || response.success)) {
        console.log("📨 [LOGIN] Success Response:", response);

        const token = response.token || response.access_token || response.data?.token || null;

        // 1. EXTRA-ROBUST extraction from login response
        // Try all common nested locations
        const u = response.data?.user || response.user ||
          response.data?.customer || response.customer ||
          response.data?.customer_login || response.customer_login ||
          response.data?.data || response.data || {};

        let name = u.name || u.customer_name || u.full_name || u.display_name ||
          u.first_name || response.name || response.data?.name || "";

        // If it was at response.data.customer_login.name, u would be response.data.customer_login
        // If it was at response.data.name, u would be response.data

        if (typeof name === "object" && name !== null) {
          name = `${name.firstName || name.first_name || ""} ${name.lastName || name.last_name || ""}`.trim();
        }

        // 2. FALLBACK: Check existing session if phone matches (prevents over-writing MD. Ashraful with "User")
        if (!name || name === "User" || name === "") {
          try {
            const existingUser = JSON.parse(localStorage.getItem("rambd_user") || "null");
            if (existingUser && existingUser.phone === fullPhone && existingUser.name && existingUser.name !== "User") {
              name = existingUser.name;
              console.log("💡 [LOGIN] Restored name from existing session:", name);
            }
          } catch (e) { }
        }

        // 3. FALLBACK: Check localStorage mapping from Registration
        if (!name || name === "User" || name === "") {
          try {
            const namesMap = JSON.parse(localStorage.getItem("rambd_phone_names") || "{}");
            if (namesMap[fullPhone]) {
              name = namesMap[fullPhone];
              console.log("💡 [LOGIN] Using fallback name from registration mapping:", name);
            }
          } catch (e) { }
        }

        // Final fallback
        if (!name) name = "User";

        const userData = {
          name: name,
          phone: fullPhone,
          token: token,
          isLoggedIn: true,
          loginTime: new Date().toISOString()
        };
        localStorage.setItem("rambd_user", JSON.stringify(userData));
        dispatch({ type: "SET_USER", payload: userData });

        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: `Welcome, ${userData.name}!`,
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          router.push("/"); // Redirect to Home
        });
      } else {
        Swal.fire({ icon: 'error', title: 'Login Failed', text: response?.message || 'Invalid credentials' });
      }
    } catch (error: any) {
      setLoading(false);
      Swal.fire({ icon: 'error', title: 'Error', text: error.message || 'Something went wrong!' });
    }
  };


  const { values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues,
    onSubmit: handleFormSubmit,
    validationSchema: formSchema
  });

  return (
    <StyledRoot mx="auto" my="2rem" boxShadow="large" borderRadius={8}>
      <form className="content" onSubmit={handleSubmit}>
        <H3 mb="1.5rem" fontWeight="700">
          Login
        </H3>

        {/* PHONE FIELD */}
        <Box mb="1.25rem">
          <FlexBox alignItems="center" mb="0.5rem">
            <Typography variant="body1" fontWeight="600" color="text.secondary">
              Phone *
            </Typography>
          </FlexBox>
          <FlexBox
            alignItems="center"
            borderRadius="8px"
            style={{
              border: (() => {
                const { color } = validatePhoneNumber(values.phone_digits);
                if (touched.phone_digits && errors.phone_digits) return "1px solid #e74c3c";
                return `1px solid ${color}`;
              })(),
              overflow: "hidden"
            }}
          >
            <Box bg="gray.100" px="15px" py="12px" style={{ borderRight: "1px solid #dee2e6" }}>
              <Typography fontWeight="700">+8801</Typography>
            </Box>
            <input
              name="phone_digits"
              type="tel"
              maxLength={10}
              placeholder="XXXXX-XXXX"
              value={formatPhoneInput(values.phone_digits)}
              onBlur={handleBlur}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                if (val.length > 0 && !isValidFirstDigit(val[0])) return;
                setFieldValue("phone_digits", val);
              }}
              style={{
                border: "none",
                outline: "none",
                width: "100%",
                padding: "12px",
                fontSize: "20px",
                fontWeight: 700,
                letterSpacing: "2px"
              }}
            />
          </FlexBox>
          {(() => {
            const { message, color } = validatePhoneNumber(values.phone_digits);
            if (touched.phone_digits && errors.phone_digits) {
              return <Typography color="error.main" fontSize="12px" mt="4px">{errors.phone_digits}</Typography>;
            }
            return (
              <Typography color={color} fontSize="12px" mt="4px" fontWeight="600">
                {message}
              </Typography>
            );
          })()}
        </Box>

        {/* PASSWORD FIELD */}
        <Box mb="1.25rem">
          <Typography variant="body1" fontWeight="600" mb="0.5rem">
            Password *
          </Typography>
          <TextField
            mb="1rem"
            fullwidth
            name="password"
            autoComplete="on"
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder="*********"
            value={values.password}
            errorText={touched.password && errors.password}
            type={passwordVisibility ? "text" : "password"}
            endAdornment={
              <IconButton
                p="0.25rem"
                mr="0.25rem"
                type="button"
                onClick={togglePasswordVisibility}
                color={passwordVisibility ? "gray.700" : "gray.600"}
              >
                <Icon variant="small" defaultcolor="currentColor">
                  {passwordVisibility ? "eye-alt" : "eye"}
                </Icon>
              </IconButton>
            }
          />
        </Box>

        <Button
          mb="1.65rem"
          variant="contained"
          color="primary"
          type="submit"
          fullwidth
          disabled={loading}
        >
          {loading ? "Processing..." : "Login"}
        </Button>

        <FlexBox justifyContent="space-between" alignItems="center" mb="1.25rem" flexWrap="wrap">
          <FlexBox alignItems="center">
            <SemiSpan>No account?</SemiSpan>
            <Link href="/signup">
              <H6 ml="0.4rem" borderBottom="1px solid" borderColor="gray.900">Sign Up</H6>
            </Link>
          </FlexBox>
          <FlexBox alignItems="center">
            <SemiSpan>Forgot password?</SemiSpan>
            <Box
              ml="0.4rem"
              style={{ cursor: "pointer", borderBottom: "1px solid #111" }}
              onClick={() => setOpenForgot(true)}
            >
              <H6>Reset</H6>
            </Box>
          </FlexBox>
        </FlexBox>
      </form>

      <ForgotPasswordModal open={openForgot} onClose={() => setOpenForgot(false)} />
    </StyledRoot>
  );
}
