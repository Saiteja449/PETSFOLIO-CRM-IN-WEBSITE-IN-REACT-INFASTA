export const API_BASE_URL = "https://crm-backend-14p9.onrender.com/api";

export const API_ENDPOINTS = {
  AUTH: {
    SEND_OTP: `${API_BASE_URL}/auth/send-otp`,
    VERIFY_OTP: `${API_BASE_URL}/auth/verify-otp`,
  },
  USERS: {
    BASE: `${API_BASE_URL}/users`,
  },
  NOTIFICATIONS: {
    BASE: `${API_BASE_URL}/notifications`,
  },
  LEADS: {
    BASE: `${API_BASE_URL}/leads`,
  },
  ACTIVITIES: {
    BASE: `${API_BASE_URL}/activities`,
  },
  FOLLOWUPS: {
    BASE: `${API_BASE_URL}/followups`,
  },
  WHATSAPP: {
    CONNECT: `${API_BASE_URL}/whatsapp/connect`,
    STATUS: `${API_BASE_URL}/whatsapp/status`,
    LOGOUT: `${API_BASE_URL}/whatsapp/logout`,
    QR: `${API_BASE_URL}/whatsapp/qr`,
    CONVERSATIONS: `${API_BASE_URL}/whatsapp/conversations`,
    CONVERSATION: (leadId) => `${API_BASE_URL}/whatsapp/conversation/${leadId}`,
    SEND_MESSAGE: `${API_BASE_URL}/whatsapp/message/send`,
    AI_TOGGLE: `${API_BASE_URL}/whatsapp/ai/toggle`,
    KB: `${API_BASE_URL}/whatsapp/knowledge-base`,
    UPLOAD: `${API_BASE_URL}/whatsapp/upload`,
  },
};
