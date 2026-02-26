import axios from "axios";

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.unicodeconverter.info").trim();

const normalizePhone = (phone: string) => {
    // Remove all non-digits
    let digits = phone.replace(/\D/g, "");
    // Handle BD format: if starts with 880, take last 11. if starts with 0, take all 11.
    // If it's something like 019..., keep it. If it's 88019..., take 019...
    if (digits.startsWith("880") && digits.length > 11) {
        digits = digits.substring(2);
    }
    // Ensure it starts with 0 for the API if it's 10 digits (missing leading 0)
    if (digits.length === 10 && digits.startsWith("1")) {
        digits = "0" + digits;
    }
    return digits;
};

const register = async (payload: any) => {
    try {
        const url = `${apiBaseUrl}/api/cus-register`;
        const normalizedPayload = { ...payload, phone: normalizePhone(payload.phone) };
        console.log("🚀 [AUTH] Register Request:", { url, payload: normalizedPayload });
        const response = await axios.post(url, normalizedPayload);
        console.log("✅ [AUTH] Register Success:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("❌ [AUTH] Register Error:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
            url: error.config?.url
        });
        throw error.response?.data || { message: error.message };
    }
};

const verifyPhone = async (phone: string, pincode: string) => {
    try {
        const digits = normalizePhone(phone);
        const url = `${apiBaseUrl}/api/cus-verifyphone/${digits}`;
        const payload = { phone: digits, pincode };
        console.log("🚀 [AUTH] Verify Request:", { url, payload });
        const response = await axios.post(url, payload);
        console.log("✅ [AUTH] Verify Success:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("❌ [AUTH] Verify Error:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
            url: error.config?.url
        });
        throw error.response?.data || { message: error.message };
    }
};

const generateOtp = async (phone: string) => {
    try {
        const digits = normalizePhone(phone);
        const url = `${apiBaseUrl}/api/generate-otp`;
        console.log("🚀 [AUTH] OTP Request:", { url, phone: digits });
        const response = await axios.get(url, { params: { phone: digits } });
        console.log("✅ [AUTH] OTP Success:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("❌ [AUTH] OTP Error:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
            url: error.config?.url
        });
        throw error.response?.data || { message: error.message };
    }
};

const login = async (payload: any) => {
    try {
        const url = `${apiBaseUrl}/api/customer-login-page`;
        const normalizedPayload = {
            email: normalizePhone(payload.phone),
            password: payload.password
        };
        console.log("🚀 [AUTH] Login Request:", { url, payload: normalizedPayload });
        const response = await axios.post(url, normalizedPayload);
        console.log("✅ [AUTH] Login Success:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("❌ [AUTH] Login Error Context:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
            url: error.config?.url,
            payload: payload
        });
        // Throw a structured error that won't appear as {} in console.error if possible
        const errObj = error.response?.data || { message: error.message };
        throw errObj;
    }
};

export default { register, verifyPhone, generateOtp, login };
