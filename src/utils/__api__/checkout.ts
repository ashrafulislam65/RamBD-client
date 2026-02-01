import axios from "@lib/axios";

const getDistrictsAndThanas = async () => {
    try {
        const response = await axios.get("/remote-api/district-thana");
        return response.data;
    } catch (error) {
        console.error("Failed to fetch districts and thanas:", error);
        return { district: [], thana: [] };
    }
};

const getShippingCost = async (districtId: string | number) => {
    try {
        const url = `/remote-api/api/get-shipping-cost?district=${districtId}`;
        const response = await axios.get(url);
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
        const response = await axios.post(url, orderData);
        return response.data;
    } catch (error) {
        console.error("Failed to place order:", error);
        return { success: false, message: "Failed to place order" };
    }
};

const generateOtp = async (phone: string) => {
    try {
        const encodedPhone = encodeURIComponent(phone);
        const url = `/remote-api/api/generate-otp?phone=${encodedPhone}`;
        console.log("Generating OTP for phone:", phone, "at URL:", url);
        const response = await axios.get(url);
        console.log("OTP API Response:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("Failed to generate OTP. Error:", error.message);
        return { success: false, message: "Failed to generate OTP" };
    }
};

export default { getDistrictsAndThanas, getShippingCost, placeOrder, generateOtp };
