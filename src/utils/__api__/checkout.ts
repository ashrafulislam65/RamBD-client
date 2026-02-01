import axios from "axios";

const getDistrictsAndThanas = async () => {
    try {
        const response = await axios.get(process.env.NEXT_PUBLIC_LOCATIONS_URL);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch districts and thanas:", error);
        return [];
    }
};

const getShippingCost = async (districtId: string | number) => {
    try {
        const url = `${process.env.NEXT_PUBLIC_SHIPPING_COST_URL}?district=${districtId}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch shipping cost:", error);
        return { status: "error", shipping_cost: 0 };
    }
};

const placeOrder = async (orderData: any) => {
    try {
        console.log("Placing order with payload:", JSON.stringify(orderData, null, 2));
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/order-places`;
        const response = await axios.post(url, orderData);
        return response.data;
    } catch (error) {
        console.error("Failed to place order:", error);
        return { status: "error", message: "Failed to place order" };
    }
};

const generateOtp = async (phone: string) => {
    try {
        const response = await axios.get(`https://admin.felnatech.com/api/generate-otp?phone=${phone}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to generate OTP:", error);
        return { success: false, message: "Failed to generate OTP" };
    }
};

export default { getDistrictsAndThanas, getShippingCost, placeOrder, generateOtp };
