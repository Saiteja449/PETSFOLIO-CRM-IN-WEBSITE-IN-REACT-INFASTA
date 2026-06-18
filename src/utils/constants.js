export const API_BASE_URL = "http://localhost:5000/api";

export const API_ENDPOINTS = {
  AUTH: {
    SEND_OTP: `${API_BASE_URL}/auth/send-otp`,
    VERIFY_OTP: `${API_BASE_URL}/auth/verify-otp`,
  },
  USERS: {
    BASE: `${API_BASE_URL}/users`,
  },
  LEADS: {
    BASE: `${API_BASE_URL}/leads`,
  }
};
