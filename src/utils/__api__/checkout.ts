import axios from "axios";
import axiosInstance from "@lib/axios";

const getDistrictsAndThanas = async () => {
    try {
        const response = await axiosInstance.get("/remote-api/district-thana");
        return response.data;
    } catch (error) {
        console.error("Failed to fetch districts and thanas:", error);
        return { district: [], thana: [] };
    }
};

const getShippingCost = async (districtId: string | number) => {
    try {
        const url = `/remote-api/api/get-shipping-cost?district=${districtId}`;
        const response = await axiosInstance.get(url);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch shipping cost:", error);
        return { success: false, data: { price: 0 } };
    }
};

const placeOrder = async (orderData: any) => {
    try {
        console.log("Placing order with payload:", JSON.stringify(orderData, null, 2));
        const url = "/remote-api/api/order-places";
        const response = await axiosInstance.post(url, orderData);
        return response.data;
    } catch (error) {
        console.error("Failed to place order:", error);
        return { success: false, message: "Failed to place order" };
    }
};

const generateOtp = async (phone: string) => {
    try {
        // Normalize to 11-digit local format (01XXXXXXXXX)
        const normalizedPhone = phone.replace(/^(\+88|88)/, "");
        const apiBaseUrl = "https://admin.unicodeconverter.info";
        const url = `${apiBaseUrl}/api/generate-otp`;

        console.log("🚀 Calling Generate OTP API (ABSOLUTE):", url, { phone: normalizedPhone });

        // Use standard axios to bypass MockAdapter
        const response = await axios.get(url, {
            params: { phone: normalizedPhone }
        });

        console.log("✅ OTP API Response (ABSOLUTE):", response.data);
        return response.data;
    } catch (error: any) {
        console.error("❌ OTP API Error (ABSOLUTE):", error.response?.data || error.message);
        return { success: false, message: error.message };
    }
};

const getUserByPhone = async (phone: string) => {
    try {
        // Normalize to 11-digit local format (01XXXXXXXXX)
        const normalizedPhone = phone.replace(/^(\+88|88)/, "");
        const apiBaseUrl = "https://admin.unicodeconverter.info";
        const url = `${apiBaseUrl}/api/get-user-by-phone`;

        console.log("🔍 Fetching user by phone (ABSOLUTE):", normalizedPhone);

        // Use standard axios to bypass MockAdapter
        const response = await axios.get(url, {
            params: { phone: normalizedPhone }
        });

        console.log("👤 User API Response (ABSOLUTE):", response.data);
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            console.log("User not found (404), skipping auto-fill.");
            return { success: false, message: "User not found" };
        }
        console.error("❌ User API Error (ABSOLUTE):", error.response?.data || error.message);
        return { success: false, message: "Failed to fetch user" };
    }
};

export default { getDistrictsAndThanas, getShippingCost, placeOrder, generateOtp, getUserByPhone };
